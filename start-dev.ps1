$env:PATH = "C:\Windows\System32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0;" + $env:PATH
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Student Placement Platform - AI Digital Twin" -ForegroundColor Green
Write-Host " Starting Frontend (Vite) and Backend (Express + MongoDB)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
npm run dev:all
