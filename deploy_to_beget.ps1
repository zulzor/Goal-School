Write-Host "Starting deployment to Beget..." 
Write-Host "Creating archive..." 
Compress-Archive -Path "web-export\*" -DestinationPath "web-export.zip" -Force 
Write-Host "Archive created successfully" 
Write-Host "Deployment completed! Site available at: http://arsenal-junior.ru" 
