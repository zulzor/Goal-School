@echo off
echo Установка Java Development Kit (JDK) и Android SDK...
echo.

echo Шаг 1: Установка OpenJDK 11 с помощью Chocolatey
echo Проверка наличия Chocolatey...
choco -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey не найден. Установка Chocolatey...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
) else (
    echo Chocolatey уже установлен.
)

echo.
echo Установка OpenJDK 11...
choco install openjdk11 -y

echo.
echo Шаг 2: Установка Android SDK Command-line Tools
echo Создание папки для Android SDK...
mkdir "%USERPROFILE%\android-sdk" >nul 2>&1

echo Скачивание Android SDK Command-line Tools...
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile '%USERPROFILE%\android-sdk\commandlinetools.zip'"

echo Распаковка Android SDK Command-line Tools...
powershell -Command "Expand-Archive -Path '%USERPROFILE%\android-sdk\commandlinetools.zip' -DestinationPath '%USERPROFILE%\android-sdk'"

echo.
echo Шаг 3: Настройка переменных среды
echo Установка JAVA_HOME...
setx JAVA_HOME "C:\Program Files\OpenJDK\jdk-11.0.24-hotspot"
echo Установка ANDROID_HOME...
setx ANDROID_HOME "%USERPROFILE%\android-sdk\cmdline-tools"
echo Добавление путей в PATH...
setx PATH "%PATH%;%JAVA_HOME%\bin;%ANDROID_HOME%\bin"

echo.
echo Шаг 4: Установка необходимых компонентов Android SDK
echo Установка платформ и инструментов...
echo y | "%USERPROFILE%\android-sdk\cmdline-tools\bin\sdkmanager.bat" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo.
echo Установка завершена!
echo.
echo ВАЖНО: Закройте и откройте заново командную строку для применения изменений.
echo После этого вы сможете собрать APK с помощью скрипта build_apk.bat
pause