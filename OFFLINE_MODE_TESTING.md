# Testing Offline Mode Handling

This document explains how to test the offline mode handling implementation in the football school "Arsenal" application.

## How Offline Mode Handling Works

The application now has enhanced offline mode handling with the following features:

1. **Service Worker Detection**: The service worker monitors network connectivity and notifies clients when connection status changes.

2. **Automatic Redirect**: When internet connection is restored, users are automatically redirected from the fallback page to the main application.

3. **In-App Offline Notification**: Users see a banner notification when offline but can continue using the app.

4. **Enhanced Connectivity Checks**: Additional network verification beyond browser's online/offline events.

## How to Test Offline Mode Handling

### 1. Start the Application

```bash
# Start the main server
node main-server.js
```

The server will run on `http://localhost:3003`.

### 2. Open the Application

Open your browser and navigate to `http://localhost:3003`.

### 3. Test Offline Mode

#### Method 1: Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to the Network tab
3. Check the "Offline" checkbox to simulate offline mode
4. Observe the offline banner appearing in the app
5. Uncheck "Offline" to restore connection
6. Verify that the app automatically redirects from fallback page if needed

#### Method 2: Disconnect Network
1. Disconnect your computer from the network (turn off Wi-Fi or unplug Ethernet)
2. Wait for the offline banner to appear
3. Reconnect to the network
4. Verify that the app handles the connection restoration correctly

### 4. What to Observe

When testing offline mode, you should observe:

1. **Offline Banner**: A red banner appears at the top of the app when connection is lost
2. **Connection Restoration**: When connection is restored, the app should automatically redirect from the fallback page to the main application
3. **Retry Functionality**: The offline banner has a "Retry" button to manually check connection status

## Key Implementation Files

- `web-export/sw.js` - Service worker with connection monitoring
- `web-export/fallback.html` - Fallback page with automatic redirect
- `src/context/NetworkContext.tsx` - Network context with fallback handling
- `src/components/OfflineBanner.tsx` - In-app offline notification component
- `src/utils/netinfo.web.ts` - Enhanced connectivity checking for web

## Troubleshooting

If offline mode handling doesn't work as expected:

1. **Clear Browser Cache**: Service workers are cached, so you may need to clear browser cache
2. **Hard Refresh**: Use Ctrl+F5 or Cmd+Shift+R to force refresh
3. **Check Console**: Look for any errors in the browser's developer console
4. **Verify Files**: Ensure all implementation files are correctly updated

## Expected Behavior

| Scenario | Expected Behavior |
|----------|-------------------|
| Connection Lost | Offline banner appears, app continues to function |
| Connection Restored | Automatic redirect from fallback page to main app |
| Manual Retry | Connection status updates when retry button is clicked |
| Periodic Checks | Connection status is checked every 30 seconds |

This implementation provides a seamless offline experience for users of the football school "Arsenal" application.