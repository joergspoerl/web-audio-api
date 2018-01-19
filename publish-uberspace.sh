git push
ionic cordova build android
scp platforms/android/build/outputs/apk/android-armv7-debug.apk jrg@deneb.uberspace.de:/home/jrg/html/web-audio-api/android-armv7-debug.apk
~/scripts/sendMail-apk-ready.sh "http://jrg.deneb.uberspace.de/mw/android-armv7-debug.apk"

# add manual in config.xml -> <preference name="loadUrlTimeoutValue" value="700000" />
