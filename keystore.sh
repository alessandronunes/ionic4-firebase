#!/bin/bash
# Created by: João Júnior <joaojunior.mail@gmail.com>

if ! [ -n "$ANDROID_HOME" ]; then
  echo "ANDROID_HOME environment variable does not exist";
  exit;
fi

# Variables
APK_ID="ionic4-firebase" # application name (no spaces or special characters)
APK_KEYSTORE_PASSWORD="Teste!1234" # keystore password
APK_KEYSTORE_NAME="Alessandro Nunes" # owner name
APK_KEYSTORE_ORG_UNIT="Mobile" # company nickname 
APK_KEYSTORE_ORG_NAME="everis" # company name
APK_KEYSTORE_CITY="São Paulo" # city
APK_KEYSTORE_STATE="SP" # state
APK_KEYSTORE_COUNTRY="Brasil" # country

# Constants
readonly VERSION_SDK=$(eval "$ANDROID_HOME/tools/bin/sdkmanager --list | grep 'build-tools;' | tail -1 | grep -oEi '\d+\.\d+\.\d+' | tail -1")
readonly PATH_FILE="platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"

# Generate keystore file
if [[ "$1" == "generate" ]]; then
  if [ -e "$APK_ID.keystore" ]; then
    echo "File '$APK_ID.keystore' already exists"
  else
    eval "keytool -genkey -v -keystore $APK_ID.keystore -alias $APK_ID -keyalg RSA -keysize 2048 -validity 10000 -keypass $APK_KEYSTORE_PASSWORD -storepass $APK_KEYSTORE_PASSWORD -dname 'CN=$APK_KEYSTORE_NAME, OU=$APK_KEYSTORE_ORG_UNIT,  O=$APK_KEYSTORE_ORG_NAME, L=$APK_KEYSTORE_CITY, S=$APK_KEYSTORE_STATE, C=$APK_KEYSTORE_COUNTRY'"
  fi
fi

# Signs keystore file
if [[ "$1" == "assign" ]]; then
  echo "-----------------------------\n\rGENERATING APK RELEASE\n\r-----------------------------"
  eval "ionic cordova build android --release"
  if [ -e "$PATH_FILE" ]; then
    echo "-----------------------------\n\rSIGNING APK\n\r-----------------------------"
    eval "jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass $APK_KEYSTORE_PASSWORD -keystore $APK_ID.keystore $PATH_FILE $APK_ID"
    echo "-----------------------------\n\rOPTIMIZING APK\n\r-----------------------------"
    eval "rm $APK_ID.apk"
    eval "$ANDROID_HOME/build-tools/$VERSION_SDK/zipalign -v 4 $PATH_FILE $APK_ID.apk"
  else
    echo "The file '$PATH_FILE' does not exist"
  fi
fi
