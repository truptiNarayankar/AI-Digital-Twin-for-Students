@echo off
set PATH=C:\Windows\System32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0;%PATH%
echo ========================================================
echo  Student Placement Platform - AI Digital Twin
echo  Starting Frontend (Vite) and Backend (Express + MongoDB)
echo ========================================================
echo.
echo Frontend will run on: http://localhost:5173
echo Backend API will run on: http://localhost:5000
echo.
npm run dev:all

