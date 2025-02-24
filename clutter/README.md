# Clutter 

Our CLimbing flUTTER app.

Takes the data built by our nextjs application, and surfaces it in a fast, offline, cross platform
app for exploring the crag.

The user facing application name is currently "Boulder Buddy [Crag]"

## WSL2 Local Device Development

```powershell
# Restart windows adb service if necessary
./adb.exe kill-server
./adb.exe start-server
./adb.exe devices

# Run on port 5555 
./adb.exe tcpip 5555
```

```bash
adb connect $IP:5555
```

## Release

### Android

```
flutter build appbundle

# Upload to play store
# [project]/build/app/outputs/bundle/release/app.aab

# Add debug artifacts from
# [project]\build\app\intermediates\merged_native_libs\release\out\lib
# zip all folders and upload to play store
```