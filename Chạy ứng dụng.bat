@echo off
title Khoi dong Goethe AI-Prep
echo ==================================================
echo   DANG KHOI DONG HE THONG LUYEN THI GOETHE AI-PREP
echo ==================================================
echo.
echo [1/2] Dang chuyen huong vao thu muc du an...
cd /d "d:\Antgravity\App luyện thi tiếng Đức"
echo.
echo [2/2] Dang khoi dong server tu dong...
start cmd /k "npm run dev"
echo.
echo Vui long cho 3 giay de server khoi dong hoan toan...
timeout /t 3 >nul
echo.
echo Dang mo ung dung tren Trinh duyet cua ban...
start http://localhost:5173/
echo.
echo ==================================================
echo   KHOI DONG THANH CONG! BAN CO THE BAT DAU HOC.
echo ==================================================
timeout /t 2 >nul
exit
