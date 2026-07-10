#!/bin/bash
# 1. Compilar
cd android
./gradlew assembleDebug
cd ..

# 2. Definir variables de ruta (para mayor claridad)
ADB="/c/Users/adona/AppData/Local/Android/Sdk/platform-tools/adb.exe"
APK="android/app/build/outputs/apk/debug/app-debug.apk"
PACKAGE="/c/Users/adona/AppData/Local/Android/Sdk/platform-tools/adb.exe shell monkey -p com.felixcompany.thegem -c android.intent.category.LAUNCHER 1"

# 3. Instalar y ejecutar
$ADB install -r "$APK"
$ADB shell am start -n "$PACKAGE"