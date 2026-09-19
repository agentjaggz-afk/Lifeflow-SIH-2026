Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    Starting LifeFlow Blood Network Platform       " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

if (Test-Path "$PSScriptRoot\Site\package.json") {
    Set-Location "$PSScriptRoot\Site"
} elseif (Test-Path "$PSScriptRoot\hospital&ngo\package.json") {
    Set-Location "$PSScriptRoot\hospital&ngo"
} else {
    Write-Error "Could not find package.json in Site or hospital&ngo folder."
    pause
    exit 1
}

Write-Host "`nStarting unified platform on http://localhost:5173..." -ForegroundColor Green
Start-Process "http://localhost:5173"
npm run dev
