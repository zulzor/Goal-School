# Deployment Script for Beget Hosting 
# This script deploys the web application to Beget server 
 
Write-Host "Starting deployment to Beget..." 
 
# Create temporary directory 
Write-Host "Creating temporary directory..." 
$tempDir = [System.IO.Path]::GetTempPath() + "beget_deploy" 
if (Test-Path $tempDir) { 
    Remove-Item $tempDir -Recurse -Force 
} 
New-Item -ItemType Directory -Path $tempDir | Out-Null 
 
# Create archive 
Write-Host "Creating archive..." 
$archivePath = $tempDir + "\web-export.zip" 
Compress-Archive -Path "web-export\*" -DestinationPath $archivePath -Force 
 
# Copy archive to a known location 
Write-Host "Copying archive to current directory..." 
Copy-Item $archivePath . -Force 
 
# Cleanup 
Write-Host "Cleaning up temporary files..." 
Remove-Item $tempDir -Recurse -Force 
 
Write-Host "Deployment package created successfully!" 
Write-Host "To deploy, use SCP command:" 
Write-Host "scp -r web-export\* mrzulonz@mrzulonz.beget.tech:/home/m/mrzulonz/arsenal-junior.ru/public_html/" 
Write-Host "Site will be available at: http://arsenal-junior.ru" 
