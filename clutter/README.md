# Clutter 

Our CLimbing flUTTER app.

Takes the data built by our nextjs application, and surfaces it in a fast, offline, cross platform
app for exploring the crag.

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
