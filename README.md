# QuickCart PWA (Simple E-commerce Demo)

A simple **E-commerce Progressive Web App (PWA)** built with **HTML, CSS, and JavaScript**.

It demonstrates:
- Responsive product listing UI
- Add-to-cart interaction
- Web App Manifest setup
- Service Worker lifecycle events
- Offline support via caching
- Background sync simulation
- Push notification simulation

## Project Structure

```text
.
├── index.html
├── style.css
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-192.svg
    └── icon-512.svg
```

## Run Locally

> Service workers require HTTP(S) (or localhost), so use a local server.

From this project directory, run:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## PWA Features Implemented

### 1) Manifest (`manifest.json`)
- App name and short name
- Theme/background colors
- Display mode: `standalone`
- App icons

### 2) Service Worker (`service-worker.js`)
- `install` event: caches static assets
- `activate` event: removes old caches and claims clients
- `fetch` event: cache-first strategy with offline fallback
- `sync` event: simulates background task logging
- `push` event: simulates push notification display

## Verify in Browser DevTools (Chrome/Edge)

1. Open the app at `http://localhost:5500`
2. Open DevTools (`F12` / `Cmd+Option+I`)
3. Go to **Application** tab:
   - **Service Workers**: confirm registration and active state
   - **Manifest**: confirm name, colors, display mode, icons
   - **Cache Storage**: confirm cached app shell files
4. Go to **Console** and look for logs:
   - `[App] Service Worker registered...`
   - `[SW] Install event`
   - `[SW] Activate event`
   - `[SW] Fetch event ...`
   - `[SW] Sync event fired: cart-sync`
   - `[SW] Push event received`

## Test Offline Support

1. Load the app once while online.
2. In DevTools → **Network**, enable **Offline**.
3. Refresh the page.
4. The cached app shell should still load.

## Test Background Sync (Simulation)

When supported, the page attempts to register a sync task with tag `cart-sync`.
Check Console logs in the service worker to see simulated sync behavior.

## Test Push (Simulation)

In DevTools → **Application → Service Workers**, use the **Push** button.
Send optional payload text and observe:
- Notification shown by service worker
- Push-related logs in Console

---

This project is intentionally minimal and framework-free to highlight core PWA concepts.