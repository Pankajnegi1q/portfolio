# Pankaj Portfolio

## Run the project

The project is a static HTML portfolio served by the `Start application` workflow:

```bash
python3 -m http.server 5000 --bind 0.0.0.0
```

Open `index.html` for the public portfolio. Open `admin.html` to manage the hero copy, about section, stats, contact details, and reels.

## Admin storage

The admin dashboard saves text content in `localStorage` and uploaded video files in browser `IndexedDB` on the current Replit origin. The dashboard includes an export backup action. This is intentionally lightweight and does not provide multi-user authentication or server-side storage.