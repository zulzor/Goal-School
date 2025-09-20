@echo off
chcp 65001 >nul

REM Создаем полноценный PowerShell скрипт для деплоя
echo # Deployment Script for Beget Hosting > deploy_full.ps1
echo # This script deploys the web application to Beget server >> deploy_full.ps1
echo. >> deploy_full.ps1
echo Write-Host "Starting deployment to Beget..." >> deploy_full.ps1
echo. >> deploy_full.ps1
echo # Create temporary directory >> deploy_full.ps1
echo Write-Host "Creating temporary directory..." >> deploy_full.ps1
echo $tempDir = [System.IO.Path]::GetTempPath() + "beget_deploy" >> deploy_full.ps1
echo if (Test-Path $tempDir) { >> deploy_full.ps1
echo     Remove-Item $tempDir -Recurse -Force >> deploy_full.ps1
echo } >> deploy_full.ps1
echo New-Item -ItemType Directory -Path $tempDir ^| Out-Null >> deploy_full.ps1
echo. >> deploy_full.ps1
echo # Create archive >> deploy_full.ps1
echo Write-Host "Creating archive..." >> deploy_full.ps1
echo $archivePath = $tempDir + "\web-export.zip" >> deploy_full.ps1
echo Compress-Archive -Path "web-export\*" -DestinationPath $archivePath -Force >> deploy_full.ps1
echo. >> deploy_full.ps1
echo # Copy archive to a known location >> deploy_full.ps1
echo Write-Host "Copying archive to current directory..." >> deploy_full.ps1
echo Copy-Item $archivePath . -Force >> deploy_full.ps1
echo. >> deploy_full.ps1
echo # Cleanup >> deploy_full.ps1
echo Write-Host "Cleaning up temporary files..." >> deploy_full.ps1
echo Remove-Item $tempDir -Recurse -Force >> deploy_full.ps1
echo. >> deploy_full.ps1
echo Write-Host "Deployment package created successfully!" >> deploy_full.ps1
echo Write-Host "To deploy, use SCP command:" >> deploy_full.ps1
echo Write-Host "scp -r web-export\* mrzulonz@mrzulonz.beget.tech:/home/m/mrzulonz/arsenal-junior.ru/public_html/" >> deploy_full.ps1
echo Write-Host "Site will be available at: http://arsenal-junior.ru" >> deploy_full.ps1

echo Full PowerShell script created successfully!
echo To run: .\deploy_full.ps1
pause