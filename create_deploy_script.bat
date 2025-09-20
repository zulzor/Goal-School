@echo off
chcp 65001 >nul

echo # Скрипт для деплоя веб-приложения на сервер Beget > deploy_to_beget.ps1
echo # Удаление предыдущей версии и загрузка новой >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo param^(^ >> deploy_to_beget.ps1
echo     [Parameter^(Mandatory=$false^)^] >> deploy_to_beget.ps1
echo     [switch]$SkipConfirmation >> deploy_to_beget.ps1
echo ^) >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Параметры подключения >> deploy_to_beget.ps1
echo $sshKey = "C:\Users\jolab\.ssh\id_rsa" >> deploy_to_beget.ps1
echo $sshUser = "mrzulonz" >> deploy_to_beget.ps1
echo $sshHost = "mrzulonz.beget.tech" >> deploy_to_beget.ps1
echo $remotePath = "/home/m/mrzulonz/arsenal-junior.ru/public_html" >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Проверка наличия SSH ключа >> deploy_to_beget.ps1
echo if ^(^-not ^(Test-Path $sshKey^)^) { >> deploy_to_beget.ps1
echo     Write-Host "Ошибка: SSH ключ не найден по пути $sshKey" -ForegroundColor Red >> deploy_to_beget.ps1
echo     exit 1 >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Проверка наличия папки web-export >> deploy_to_beget.ps1
echo if ^(^-not ^(Test-Path "web-export"^)^) { >> deploy_to_beget.ps1
echo     Write-Host "Ошибка: Папка web-export не найдена" -ForegroundColor Red >> deploy_to_beget.ps1
echo     exit 1 >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Подтверждение перед выполнением >> deploy_to_beget.ps1
echo if ^(^-not $SkipConfirmation^) { >> deploy_to_beget.ps1
echo     $confirmation = Read-Host "Вы уверены, что хотите удалить предыдущую версию сайта и загрузить новую? (y/N)" >> deploy_to_beget.ps1
echo     if ^($confirmation -ne "y" -and $confirmation -ne "Y"^) { >> deploy_to_beget.ps1
echo         Write-Host "Операция отменена пользователем" -ForegroundColor Yellow >> deploy_to_beget.ps1
echo         exit 0 >> deploy_to_beget.ps1
echo     } >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo Write-Host "Начало деплоя веб-приложения на сервер Beget..." -ForegroundColor Cyan >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Создание временной папки для архива >> deploy_to_beget.ps1
echo $tempDir = "$env:TEMP\beget_deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss')" >> deploy_to_beget.ps1
echo try { >> deploy_to_beget.ps1
echo     New-Item -ItemType Directory -Path $tempDir ^| Out-Null >> deploy_to_beget.ps1
echo     Write-Host "Создана временная папка: $tempDir" -ForegroundColor Green >> deploy_to_beget.ps1
echo } catch { >> deploy_to_beget.ps1
echo     Write-Host "Ошибка при создании временной папки: $($_.Exception.Message)" -ForegroundColor Red >> deploy_to_beget.ps1
echo     exit 1 >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Создание архива локальной папки web-export >> deploy_to_beget.ps1
echo $archivePath = "$tempDir\web-export.zip" >> deploy_to_beget.ps1
echo $webExportPath = "web-export" >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo Write-Host "Создание архива из папки $webExportPath..." -ForegroundColor Green >> deploy_to_beget.ps1
echo try { >> deploy_to_beget.ps1
echo     Compress-Archive -Path $webExportPath\* -DestinationPath $archivePath -Force >> deploy_to_beget.ps1
echo     $archiveSize = ^(Get-Item $archivePath^).Length / 1KB >> deploy_to_beget.ps1
echo     Write-Host "Архив успешно создан: $archivePath ($([math]::Round($archiveSize, 2)) KB)" -ForegroundColor Green >> deploy_to_beget.ps1
echo } catch { >> deploy_to_beget.ps1
echo     Write-Host "Ошибка при создании архива: $($_.Exception.Message)" -ForegroundColor Red >> deploy_to_beget.ps1
echo     Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue >> deploy_to_beget.ps1
echo     exit 1 >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Загрузка архива на сервер через SFTP >> deploy_to_beget.ps1
echo Write-Host "Загрузка архива на сервер..." -ForegroundColor Green >> deploy_to_beget.ps1
echo $uploadScript = @" >> deploy_to_beget.ps1
echo cd $remotePath >> deploy_to_beget.ps1
echo rm -rf * >> deploy_to_beget.ps1
echo put `"$archivePath`" web-export.zip >> deploy_to_beget.ps1
echo exit >> deploy_to_beget.ps1
echo "@ >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo $uploadScriptPath = "$tempDir\upload.sftp" >> deploy_to_beget.ps1
echo Set-Content -Path $uploadScriptPath -Value $uploadScript >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Выполнение загрузки через SFTP >> deploy_to_beget.ps1
echo try { >> deploy_to_beget.ps1
echo     $sftpOutput = ^& "C:\Windows\System32\OpenSSH\sftp.exe" -i $sshKey -b $uploadScriptPath "$sshUser@$sshHost" 2^>^&1 >> deploy_to_beget.ps1
echo     if ^($LASTEXITCODE -ne 0^) { >> deploy_to_beget.ps1
echo         Write-Host "Ошибка при загрузке файлов через SFTP:" -ForegroundColor Red >> deploy_to_beget.ps1
echo         Write-Host $sftpOutput -ForegroundColor Red >> deploy_to_beget.ps1
echo         Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue >> deploy_to_beget.ps1
echo         exit 1 >> deploy_to_beget.ps1
echo     } >> deploy_to_beget.ps1
echo     Write-Host "Файлы успешно загружены на сервер" -ForegroundColor Green >> deploy_to_beget.ps1
echo } catch { >> deploy_to_beget.ps1
echo     Write-Host "Ошибка при загрузке файлов через SFTP: $($_.Exception.Message)" -ForegroundColor Red >> deploy_to_beget.ps1
echo     Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue >> deploy_to_beget.ps1
echo     exit 1 >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Удаленное выполнение команд через SSH для распаковки архива >> deploy_to_beget.ps1
echo Write-Host "Распаковка архива на сервере..." -ForegroundColor Green >> deploy_to_beget.ps1
echo try { >> deploy_to_beget.ps1
echo     # Переходим в директорию и распаковываем архив >> deploy_to_beget.ps1
echo     $sshOutput1 = ^& "C:\Windows\System32\OpenSSH\ssh.exe" -i $sshKey "$sshUser@$sshHost" "cd $remotePath" >> deploy_to_beget.ps1
echo     $sshOutput2 = ^& "C:\Windows\System32\OpenSSH\ssh.exe" -i $sshKey "$sshUser@$sshHost" "unzip -o web-export.zip" >> deploy_to_beget.ps1
echo     $sshOutput3 = ^& "C:\Windows\System32\OpenSSH\ssh.exe" -i $sshKey "$sshUser@$sshHost" "rm web-export.zip" >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo     Write-Host "Архив успешно распакован на сервере" -ForegroundColor Green >> deploy_to_beget.ps1
echo } catch { >> deploy_to_beget.ps1
echo     Write-Host "Ошибка при распаковке архива на сервере: $($_.Exception.Message)" -ForegroundColor Red >> deploy_to_beget.ps1
echo     Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue >> deploy_to_beget.ps1
echo     exit 1 >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo # Очистка временных файлов >> deploy_to_beget.ps1
echo try { >> deploy_to_beget.ps1
echo     Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue >> deploy_to_beget.ps1
echo     Write-Host "Временные файлы очищены" -ForegroundColor Green >> deploy_to_beget.ps1
echo } catch { >> deploy_to_beget.ps1
echo     Write-Host "Предупреждение: Не удалось очистить временные файлы: $($_.Exception.Message)" -ForegroundColor Yellow >> deploy_to_beget.ps1
echo } >> deploy_to_beget.ps1
echo. >> deploy_to_beget.ps1
echo Write-Host "Деплой завершен успешно!" -ForegroundColor Green >> deploy_to_beget.ps1
echo Write-Host "Сайт доступен по адресу: http://arsenal-junior.ru" -ForegroundColor Cyan >> deploy_to_beget.ps1
echo Write-Host "Если сайт не отображается, возможно, потребуется немного времени для обновления кэша сервера." -ForegroundColor Yellow >> deploy_to_beget.ps1

echo Скрипт успешно создан!
pause