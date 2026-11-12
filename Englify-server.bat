@echo off
rem ================================================
rem  Englify - mahalliy server (bir marta bosish)
rem  Videolar sayt ichida oynashi uchun kerak.
rem ================================================
cd /d "%~dp0"
echo Englify serveri ishga tushmoqda...
start "Englify Server" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0englify-server.ps1"
timeout /t 1 /nobreak >nul
start "" "http://localhost:8138/Englify.html"
echo.
echo   Sayt ochiladi: http://localhost:8138/Englify.html
echo   Bu oynani yopsangiz ham server ishlayveradi.
echo   Serverni toxtatish: pastdagi "Englify Server" oynasini yoping.
echo.
echo   Eslatma: .bat, Englify.html va assets papkasi bir joyda bolishi kerak.
echo.
pause
