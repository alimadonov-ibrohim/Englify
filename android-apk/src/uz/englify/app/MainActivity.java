package uz.englify.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.ArrayDeque;
import java.util.Locale;
import java.util.Set;

/**
 * Englify — WebView ilova.
 * Sayt APK ichidagi assets/www papkasidan ochiladi.
 * Native Android TextToSpeech orqali Listening/Speaking ovozlari tiniq va sifatli bo'ladi.
 */
public class MainActivity extends Activity {

    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int AUDIO_PERMISSION_REQUEST = 1002;

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;

    private TextToSpeech tts;
    private volatile boolean ttsReady = false;
    private boolean ttsFlushed = true;
    private final ArrayDeque<String[]> ttsQueue = new ArrayDeque<>();

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Mikrofon ruxsati (AI Speaking uchun)
        if (Build.VERSION.SDK_INT >= 23) {
            if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{ Manifest.permission.RECORD_AUDIO }, AUDIO_PERMISSION_REQUEST);
            }
        }

        webView = new WebView(this);
        webView.setBackgroundColor(Color.BLACK);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient());

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;
                try {
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");
                    startActivityForResult(Intent.createChooser(intent, "Fayl tanlang"), FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception e) {
                    filePathCallback = null;
                    return false;
                }
            }
        });

        initTts();
        webView.addJavascriptInterface(new TTSBridge(), "EnglifyTTS");

        setContentView(webView);
        webView.loadUrl("file:///android_asset/www/Englify.html");
    }

    /* ---------------- Native TTS ---------------- */

    private void initTts() {
        try {
            tts = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
                @Override
                public void onInit(int status) {
                    if (status != TextToSpeech.SUCCESS) {
                        ttsReady = false;
                        return;
                    }
                    ttsReady = true;
                    configureTts();
                    drainTtsQueue();
                }
            });
        } catch (Exception e) {
            ttsReady = false;
        }
    }

    private void configureTts() {
        if (tts == null) return;
        try {
            int res = tts.setLanguage(Locale.US);
            if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                res = tts.setLanguage(Locale.UK);
                if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts.setLanguage(Locale.ENGLISH);
                }
            }

            if (Build.VERSION.SDK_INT >= 21) {
                Voice best = null;
                int bestScore = Integer.MIN_VALUE;
                Set<Voice> voices = tts.getVoices();
                if (voices != null) {
                    for (Voice v : voices) {
                        if (v == null || v.getLocale() == null) continue;
                        if (!"en".equals(v.getLocale().getLanguage())) continue;

                        int score = 0;
                        String lang = v.getLocale().toString().replace('_', '-').toLowerCase(Locale.US);
                        if (lang.equals("en-us")) score += 24;
                        else if (lang.equals("en-gb")) score += 20;
                        else score += 10;

                        if (v.getQuality() == Voice.QUALITY_VERY_HIGH) score += 120;
                        else if (v.getQuality() == Voice.QUALITY_HIGH) score += 70;
                        else if (v.getQuality() == Voice.QUALITY_NORMAL) score += 20;

                        if (v.getLatency() == Voice.LATENCY_VERY_LOW) score += 30;
                        else if (v.getLatency() == Voice.LATENCY_LOW) score += 20;

                        // Offline ishlashi uchun lokal ovozlarni afzal ko'ramiz.
                        if (!v.isNetworkConnectionRequired()) score += 80;

                        String name = v.getName() == null ? "" : v.getName().toLowerCase(Locale.US);
                        if (name.contains("network") || name.contains("neural") || name.contains("natural")) score += 90;
                        if (name.contains("google")) score += 40;
                        if (name.contains("espeak") || name.contains("compact") || name.contains("pico")) score -= 200;

                        if (score > bestScore) {
                            bestScore = score;
                            best = v;
                        }
                    }
                }
                if (best != null) {
                    try { tts.setVoice(best); } catch (Exception e) {}
                }
            }

            tts.setSpeechRate(0.95f);
            tts.setPitch(1.0f);
        } catch (Exception e) {
            // Standart sozlamalar qoladi.
        }
    }

    private void drainTtsQueue() {
        if (!ttsReady || tts == null) return;
        synchronized (ttsQueue) {
            while (!ttsQueue.isEmpty()) {
                String[] item = ttsQueue.pollFirst();
                if (item == null) continue;
                float rate = 0.95f;
                try { rate = Float.parseFloat(item[2]); } catch (Exception e) {}
                speakNow(item[0], rate);
            }
        }
    }

    private void speakNow(String text, float rate) {
        if (tts == null || !ttsReady) return;
        try {
            tts.setSpeechRate(rate);
            tts.setPitch(1.0f);
            int mode = ttsFlushed ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD;
            ttsFlushed = false;
            tts.speak(text, mode, null, "englify-tts");
        } catch (Exception e) {
            // ignore
        }
    }

    private class TTSBridge {
        @JavascriptInterface
        public boolean isReady() {
            return ttsReady;
        }

        @JavascriptInterface
        public void speak(String text, String lang, double rate) {
            if (text == null || text.trim().isEmpty()) return;
            final float safeRate = (rate > 0.1 && rate < 3.0) ? (float) rate : 0.95f;
            if (!ttsReady || tts == null) {
                synchronized (ttsQueue) {
                    ttsQueue.add(new String[]{ text, lang == null ? "en-US" : lang, String.valueOf(safeRate) });
                    while (ttsQueue.size() > 24) ttsQueue.removeFirst();
                }
                return;
            }
            final String safeText = text;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    speakNow(safeText, safeRate);
                }
            });
        }

        @JavascriptInterface
        public void stop() {
            synchronized (ttsQueue) {
                ttsQueue.clear();
            }
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    ttsFlushed = true;
                    if (tts != null) {
                        try { tts.stop(); } catch (Exception e) {}
                    }
                }
            });
        }
    }

    /* ---------------- WebView callbacks ---------------- */

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    } else if (data.getData() != null) {
                        results = new Uri[]{ data.getData() };
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        try {
            if (tts != null) {
                tts.stop();
                tts.shutdown();
            }
        } catch (Exception e) {}
        tts = null;
        ttsReady = false;
        super.onDestroy();
    }
}
