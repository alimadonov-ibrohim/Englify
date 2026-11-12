@echo off
rem ================================================
rem  Englify + AI backend (OpenAI / Gemini)
rem  Sayt va API bitta serverda: http://localhost:8000
rem ================================================
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo XATO: Node.js topilmadi.
  echo Node.js ni o'rnating: https://nodejs.org
  pause
  exit /b 1
)

if not exist "backend\.env" (
  echo.
  echo DIQQAT: backend\.env fayli topilmadi.
  echo AI ishlashi uchun backend\.env.example ni backend\.env deb nusxalab,
  echo ichiga OPENAI_API_KEY yoki GEMINI_API_KEY yozing.
  echo Hozir AI o'chirilgan rejimda ishga tushadi.
  echo.
)

start "Englify AI Server" /min cmd /c "node backend\server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000/Englify.html"

echo.
echo   Sayt: http://localhost:8000/Englify.html
echo   API:  http://127.0.0.1:8000/api/health
echo.
echo   AI kalitini backend\.env fayliga yozing.
echo   Serverni to'xtatish: "Englify AI Server" oynasini yoping.
echo.
pause
