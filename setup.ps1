# GEAR ECOMMERCE SETUP & RUN SCRIPT (Windows)
# This script configures the DB, installs dependencies, and runs the project.

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   GEAR ECOMMERCE PROJECT SETUP SCRIPT    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. CONFIG CONNECTION STRING
$server = Read-Host "`n[1/4] Enter SQL Server Name (default: localhost)"
if ([string]::IsNullOrWhiteSpace($server)) { $server = "localhost" }

Write-Host "Updating backend/appsettings.json..." -ForegroundColor Gray
$appSettingsPath = "backend/appsettings.json"
if (Test-Path $appSettingsPath) {
    $content = Get-Content $appSettingsPath -Raw | ConvertFrom-Json
    $content.ConnectionStrings.DefaultConnection = "Server=$server;Database=EcommerceDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
    $content | ConvertTo-Json -Depth 10 | Set-Content $appSettingsPath
    Write-Host "✓ Connection string updated." -ForegroundColor Green
} else {
    Write-Error "Could not find backend/appsettings.json"
}

# 2. BACKEND SETUP & MIGRATION
Write-Host "`n[2/4] Initializing Database & Backend..." -ForegroundColor Yellow
cd backend
dotnet restore
dotnet build
dotnet ef database update
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database schema created successfully." -ForegroundColor Green
} else {
    Write-Host "⚠ Database update failed. Please ensure SQL Server is running." -ForegroundColor Red
}
cd ..

# 3. FRONTEND SETUP
Write-Host "`n[3/4] Installing Frontend dependencies (npm)..." -ForegroundColor Yellow
cd frontend
npm install
cd ..
Write-Host "✓ Frontend ready." -ForegroundColor Green

# 4. RUN PROJECT
Write-Host "`n[4/4] Starting Project..." -ForegroundColor Cyan
Write-Host "Launching Backend and Frontend in separate windows..." -ForegroundColor Gray

# Start Backend in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run --launch-profile https"
# Start Frontend in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "   PROJECT IS RUNNING! HAVE FUN CODING!   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Note: If it's your first time, remember to run seed_data.sql in SSMS to get initial products." -ForegroundColor Gray
