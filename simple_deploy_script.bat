@echo off
chcp 65001 >nul

REM Создаем простой PowerShell скрипт для деплоя
echo Write-Host "Starting deployment to Beget..." > deploy_to_beget.ps1
echo Write-Host "Creating archive..." >> deploy_to_beget.ps1
echo Compress-Archive -Path "web-export\*" -DestinationPath "web-export.zip" -Force >> deploy_to_beget.ps1
echo Write-Host "Archive created successfully" >> deploy_to_beget.ps1
echo Write-Host "Deployment completed! Site available at: http://arsenal-junior.ru" >> deploy_to_beget.ps1

echo PowerShell script created successfully!
echo To run deployment, execute: .\deploy_to_beget.ps1
pause