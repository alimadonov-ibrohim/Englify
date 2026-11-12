// Englify — certificates
  // --- ONLAYN SERTIFIKAT TIZIMI (RASMLI) ---
  let earnedCertificates = [];

  function getStudentName(){
    const el = document.getElementById('prof-display-name');
    return el ? el.textContent.trim() : 'Aziz Rahimov';
  }

  function getCertEligibility(){
    const tp = testProgress;
    // Rasmiy mock testlar (sertifikat uchun) — faqat 5 ta:
    // Listening, Reading, Writing, Speaking, Daily
    // AI Speaking, Battle, Videos — amaliyot, sertifikatga ta'sir qilmaydi
    const listeningOk = tp.listening.completed && tp.listening.band >= 6.5;
    const readingOk   = tp.reading.completed   && tp.reading.band >= 6.5;
    const writingOk   = tp.writing.completed   && tp.writing.band >= 6.0;
    const speakingOk  = tp.speaking.completed  && tp.speaking.band >= 6.5;
    const dailyOk     = tp.daily.completed;

    // 5 ta rasmiy mock testdan nechtasi bajarilgan
    const formalCompleted = [
      tp.listening.completed,
      tp.reading.completed,
      tp.writing.completed,
      tp.speaking.completed,
      tp.daily.completed
    ].filter(Boolean).length;

    const ieltsSkills = [listeningOk, readingOk, writingOk, speakingOk].filter(Boolean).length;
    const avgBand = (() => {
      const bands = [];
      if(tp.listening.completed) bands.push(Number(tp.listening.band) || 0);
      if(tp.reading.completed)   bands.push(Number(tp.reading.band)   || 0);
      if(tp.writing.completed)   bands.push(Number(tp.writing.band)   || 0);
      if(tp.speaking.completed)  bands.push(Number(tp.speaking.band)  || 0);
      if(tp.daily.completed)     bands.push(Number(tp.daily.band)     || 0);
      if(!bands.length) return 0;
      return bands.reduce((a,b)=>a+b,0) / bands.length;
    })();

    return {
      ielts: {
        // IELTS sertifikati — 4 ta skill ham bajarilgan, o'rtacha Band 6.5+
        unlocked: ieltsSkills >= 4 && avgBand >= 6.5,
        progress: ieltsSkills + '/4 ko\'nikma (L+R+W+S)',
        avg: avgBand.toFixed(1)
      },
      goethe: {
        // Goethe — kamida 3 ta rasmiy mock + Daily bajarilgan
        unlocked: formalCompleted >= 3 && dailyOk,
        progress: formalCompleted + '/5 rasmiy mock (Daily shart)'
      },
      course: {
        // Kurs sertifikati — barcha 5 ta rasmiy mock + o'rtacha Band 6.5+
        unlocked: formalCompleted >= 5 && avgBand >= 6.5,
        progress: formalCompleted + '/5 rasmiy mock'
      }
    };
  }

  function updateCertificateAvailability(){
    const elig = getCertEligibility();

    // IELTS
    const cardI = document.getElementById('cert-card-ielts');
    const btnI  = document.getElementById('cert-btn-ielts');
    const reqI  = document.getElementById('cert-req-ielts');
    if(cardI && btnI && reqI){
      if(elig.ielts.unlocked){
        cardI.style.opacity = '1';
        cardI.style.filter = 'none';
        btnI.disabled = false;
        btnI.className = 'dash-btn dash-btn-primary';
        btnI.style.cssText = 'padding:10px 18px;font-size:13px;white-space:nowrap;';
        btnI.textContent = 'Sertifikat olish';
        reqI.textContent = '✅ Ochiq • O‘rtacha Band: ' + elig.ielts.avg;
        reqI.style.color = '#15803d';
      } else {
        cardI.style.opacity = '0.55';
        cardI.style.filter = 'grayscale(0.4)';
        btnI.disabled = true;
        btnI.className = 'dash-btn';
        btnI.style.cssText = 'padding:10px 18px;font-size:13px;white-space:nowrap;background:#94a3b8;color:#fff;cursor:not-allowed;';
        btnI.textContent = '🔒 Yopiq';
        reqI.textContent = '🔒 Listening + Reading + Writing + Speaking (o‘rtacha ≥ 6.5) — ' + elig.ielts.progress;
        reqI.style.color = '';
      }
    }

    // Goethe
    const cardG = document.getElementById('cert-card-goethe');
    const btnG  = document.getElementById('cert-btn-goethe');
    const reqG  = document.getElementById('cert-req-goethe');
    if(cardG && btnG && reqG){
      if(elig.goethe.unlocked){
        cardG.style.opacity = '1';
        cardG.style.filter = 'none';
        btnG.disabled = false;
        btnG.className = 'dash-btn dash-btn-primary';
        btnG.style.cssText = 'padding:10px 18px;font-size:13px;white-space:nowrap;';
        btnG.textContent = 'Sertifikat olish';
        reqG.textContent = '✅ Ochiq • ' + elig.goethe.progress;
        reqG.style.color = '#15803d';
      } else {
        cardG.style.opacity = '0.55';
        cardG.style.filter = 'grayscale(0.4)';
        btnG.disabled = true;
        btnG.className = 'dash-btn';
        btnG.style.cssText = 'padding:10px 18px;font-size:13px;white-space:nowrap;background:#94a3b8;color:#fff;cursor:not-allowed;';
        btnG.textContent = '🔒 Yopiq';
        reqG.textContent = '🔒 Kamida 3 ta mock test + Daily Tests — ' + elig.goethe.progress;
        reqG.style.color = '';
      }
    }

    // Course
    const cardC = document.getElementById('cert-card-course');
    const btnC  = document.getElementById('cert-btn-course');
    const reqC  = document.getElementById('cert-req-course');
    if(cardC && btnC && reqC){
      if(elig.course.unlocked){
        cardC.style.opacity = '1';
        cardC.style.filter = 'none';
        btnC.disabled = false;
        btnC.className = 'dash-btn dash-btn-primary';
        btnC.style.cssText = 'padding:10px 18px;font-size:13px;white-space:nowrap;';
        btnC.textContent = 'Sertifikat olish';
        reqC.textContent = '✅ Ochiq • ' + elig.course.progress;
        reqC.style.color = '#15803d';
      } else {
        cardC.style.opacity = '0.55';
        cardC.style.filter = 'grayscale(0.4)';
        btnC.disabled = true;
        btnC.className = 'dash-btn';
        btnC.style.cssText = 'padding:10px 18px;font-size:13px;white-space:nowrap;background:#94a3b8;color:#fff;cursor:not-allowed;';
        btnC.textContent = '🔒 Yopiq';
        reqC.textContent = '🔒 Barcha 5 ta mock testni muvaffaqiyatli topshirish — ' + elig.course.progress;
        reqC.style.color = '';
      }
    }

    // Status note
    const note = document.getElementById('cert-status-note');
    if(note){
      const anyUnlocked = elig.ielts.unlocked || elig.goethe.unlocked || elig.course.unlocked;
      if(anyUnlocked){
        note.style.background = '#dcfce7';
        note.style.color = '#15803d';
        note.innerHTML = '<strong>✅ Tabriklaymiz!</strong> Ba’zi sertifikatlar ochildi. Yuqoridagi tugmalar orqali olishingiz mumkin.';
      } else {
        note.style.background = '#fef3c7';
        note.style.color = '#92400e';
        note.innerHTML = '<strong>⚠️ Eslatma:</strong> Sertifikatlar faqat mock testlardan <b>yaxshi natija</b> olganlarga ochiladi. Testlarni topshirib, «Natijalar» bo‘limida ko‘rsatkichlaringizni tekshiring.';
      }
    }
  }

  function requestCertificate(type){
    const elig = getCertEligibility();
    if(!elig[type] || !elig[type].unlocked){
      alert('Bu sertifikat hali yopiq!\n\nMock testlardan yaxshi natija oling (Listening, Reading, Writing, Speaking, Daily Tests), keyin qayta urinib ko‘ring.');
      return;
    }

    const meta = {
      ielts:  { title: 'IELTS Mock Sertifikati',   subtitle: 'International English Language Testing System', band: 'Band ' + elig.ielts.avg, color1: '#3b5cf6', color2: '#8b3ff5', icon: '📜' },
      goethe: { title: 'Goethe-Zertifikat (B1)',   subtitle: 'Deutsch als Fremdsprache',                   band: 'B1 Level', color1: '#0f9aa8', color2: '#0e7c86', icon: '🏅' },
      course: { title: 'Kurs Bitiruv Sertifikati', subtitle: 'Englify Language Center',               band: 'Completed', color1: '#1fa85c', color2: '#0f8f7c', icon: '✅' }
    };
    const info = meta[type] || meta.ielts;

    let cert = earnedCertificates.find(c => c.type === type);
    if(!cert){
      cert = {
        id: Date.now(),
        type: type,
        title: info.title,
        subtitle: info.subtitle,
        band: info.band,
        color1: info.color1,
        color2: info.color2,
        icon: info.icon,
        date: new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' }),
        code: 'SB-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        student: getStudentName()
      };
      earnedCertificates.unshift(cert);
      renderCertificates();
    }

    showCertificateModal(cert);
  }

  function showCertificateModal(cert){
    // Eski modalni olib tashlash
    const old = document.getElementById('cert-modal');
    if(old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'cert-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(14,32,56,0.75);backdrop-filter:blur(6px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
    modal.innerHTML = `
      <div style="background:var(--card);border-radius:20px;max-width:720px;width:100%;padding:24px;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
        <button onclick="document.getElementById('cert-modal').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;line-height:1;">&times;</button>
        
        <div style="text-align:center;margin-bottom:18px;">
          <h2 style="font-family:'Fraunces',serif;font-size:22px;margin-bottom:4px;">Sertifikatingiz tayyor!</h2>
          <p style="color:#64748b;font-size:14px;">Rasm formatida yuklab oling yoki ulashing</p>
        </div>

        <!-- Canvas sertifikat -->
        <div style="display:flex;justify-content:center;margin-bottom:20px;overflow:auto;">
          <canvas id="cert-canvas" width="800" height="560" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 8px 30px rgba(14,32,56,0.15);border:1px solid #e2e8f0;"></canvas>
        </div>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="dash-btn dash-btn-primary" style="padding:12px 24px;" onclick="downloadCertImage('${cert.code}')">
            📥 Rasm sifatida yuklab olish (PNG)
          </button>
          <button class="dash-btn dash-btn-outline" style="padding:12px 24px;" onclick="shareCertificate('${cert.code}')">
            🔗 Havolani nusxalash
          </button>
          <button class="dash-btn" style="padding:12px 24px;background:#f1f5f9;color:var(--ink);" onclick="document.getElementById('cert-modal').remove()">
            Yopish
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Canvas chizish
    setTimeout(() => drawCertificate(cert), 50);
  }

  function drawCertificate(cert){
    const canvas = document.getElementById('cert-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Fon
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#eef2ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Tashqi ramka
    ctx.strokeStyle = cert.color1;
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    // Ichki nozik ramka
    ctx.strokeStyle = cert.color2;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // Yuqori dekorativ chiziq
    const topGrad = ctx.createLinearGradient(80, 0, W - 80, 0);
    topGrad.addColorStop(0, cert.color1);
    topGrad.addColorStop(1, cert.color2);
    ctx.fillStyle = topGrad;
    ctx.fillRect(80, 70, W - 160, 6);

    // Logo / Markaz nomi
    ctx.fillStyle = '#0e2038';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Englify', W / 2, 120);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Ingliz va Nemis Tili Markazi', W / 2, 145);

    // Certificate of Achievement
    ctx.fillStyle = cert.color1;
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', W / 2, 190);

    // Asosiy sarlavha
    ctx.fillStyle = '#0e2038';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText(cert.title, W / 2, 240);

    // Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = '15px Arial, sans-serif';
    ctx.fillText(cert.subtitle, W / 2, 270);

    // "This is to certify that"
    ctx.fillStyle = '#475569';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Ushbu sertifikat quyidagi o‘quvchiga beriladi:', W / 2, 320);

    // Talaba ismi
    ctx.fillStyle = cert.color1;
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText(cert.student, W / 2, 370);

    // Band / Level
    ctx.fillStyle = '#0e2038';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(cert.band, W / 2, 410);

    // Pastki ma'lumotlar
    ctx.fillStyle = '#64748b';
    ctx.font = '13px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Sana: ' + cert.date, 90, 490);
    ctx.textAlign = 'right';
    ctx.fillText('Kod: ' + cert.code, W - 90, 490);

    // Imzo chizig'i
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, 500);
    ctx.lineTo(W / 2 + 80, 500);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Englify Direktori', W / 2, 520);

    // Dekorativ burchaklar (oddiy)
    ctx.strokeStyle = cert.color2;
    ctx.lineWidth = 3;
    // Chap yuqori
    ctx.beginPath(); ctx.moveTo(50, 70); ctx.lineTo(50, 50); ctx.lineTo(70, 50); ctx.stroke();
    // O'ng yuqori
    ctx.beginPath(); ctx.moveTo(W-50, 70); ctx.lineTo(W-50, 50); ctx.lineTo(W-70, 50); ctx.stroke();
    // Chap pastki
    ctx.beginPath(); ctx.moveTo(50, H-70); ctx.lineTo(50, H-50); ctx.lineTo(70, H-50); ctx.stroke();
    // O'ng pastki
    ctx.beginPath(); ctx.moveTo(W-50, H-70); ctx.lineTo(W-50, H-50); ctx.lineTo(W-70, H-50); ctx.stroke();
  }

  function downloadCertImage(code){
    const canvas = document.getElementById('cert-canvas');
    if(!canvas){
      // Agar modal yopilgan bo'lsa, qayta chizib yuklab olamiz
      const cert = earnedCertificates.find(c => c.code === code);
      if(!cert) return;
      showCertificateModal(cert);
      setTimeout(() => downloadCertImage(code), 200);
      return;
    }
    const link = document.createElement('a');
    link.download = `Sertifikat_${code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function renderCertificates(){
    const el = document.getElementById('certificates-list');
    if(!el) return;
    if(!earnedCertificates.length){
      el.innerHTML = `<div style="text-align:center;padding:28px 12px;color:var(--ink-soft);font-size:14px;">
        Hali sertifikat olinmagan. Yuqoridagi tugmalar orqali so‘rov yuboring.
      </div>`;
      return;
    }
    el.innerHTML = earnedCertificates.map(c => `
      <div style="border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,${c.color1},${c.color2});color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${c.icon}</div>
          <div>
            <div style="font-weight:700;font-size:14.5px;">${c.title}</div>
            <div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px;">${c.date} • Kod: ${c.code}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="dash-btn dash-btn-primary" style="padding:7px 14px;font-size:12px;" onclick="showCertificateModal(earnedCertificates.find(x=>x.code==='${c.code}'))">Ko‘rish</button>
          <button class="dash-btn dash-btn-outline" style="padding:7px 14px;font-size:12px;" onclick="downloadCertImage('${c.code}')">Yuklab olish</button>
        </div>
      </div>
    `).join('');
  }

  function shareCertificate(code){
    const cert = earnedCertificates.find(c => c.code === code);
    if(!cert) return;
    const link = `https://englify.uz/cert/${code}`;
    if(navigator.clipboard){
      navigator.clipboard.writeText(link).then(()=>{
        alert('Havola nusxalandi!\\n' + link);
      });
    } else {
      alert('Sertifikat havolasi:\\n' + link);
    }
  }


