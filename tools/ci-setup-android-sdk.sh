ANDROID_TARGET_SDK="26"
ANDROID_BUILD_TOOLS="27.0.3"
ANDROID_SDK_TOOLS="25.2.3"

apt-get --quiet install --yes wget tar unzip lib32stdc++6 lib32z1
echo "WILL INSTALL SDK TOOLS $ANDROID_SDK_TOOLS"
wget --quiet --output-document=android-sdk.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
# wget --quiet --output-document=android-sdk.tgz https://dl.google.com/android/android-sdk_r${ANDROID_SDK_TOOLS}-linux.tgz
unzip android-sdk.zip -d android-sdk-linux
# tar --extract --gzip --file=android-sdk.tgz
mkdir -p tmp
rm -rf tmp/android-sdk-linux
mv android-sdk-linux tmp/
export ANDROID_HOME=$PWD/tmp/android-sdk-linux

# Agree to Google terms:
mkdir tmp/android-sdk-linux/licenses
printf "8933bad161af4178b1185d1a37fbf41ea5269c55\nd56f5187479451eabf01fb78af6dfcb131a6481e" > tmp/android-sdk-linux/licenses/android-sdk-license
printf "84831b9409646a918e30573bab4c9c91346d8abd" > tmp/android-sdk-linux/licenses/android-sdk-preview-license

ls tmp/android-sdk-linux/tools
ls tmp/android-sdk-linux/tools/bin
tmp/android-sdk-linux/tools/bin/sdkmanager "lldb;3.1"
tmp/android-sdk-linux/tools/bin/sdkmanager "ndk-bundle"
tmp/android-sdk-linux/tools/bin/sdkmanager "cmake;3.6.4111459"
echo y | tmp/android-sdk-linux/tools/android --silent update sdk --no-ui --all --filter android-25,android-${ANDROID_TARGET_SDK},platform-tools,build-tools-${ANDROID_BUILD_TOOLS},extra-android-m2repository
