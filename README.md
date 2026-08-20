# Pankaj — Cinematic Video Editor Portfolio

A cinematic, responsive portfolio website for showcasing video editing work. The project is built with plain HTML, CSS, and JavaScript, so it stays fast and easy to customize without a build step.

## Features

- Responsive portfolio landing page with hero, about, recent edits, featured reels, and contact sections
- Hover-to-play video interactions and motion effects
- Mobile navigation menu
- Admin dashboard for managing portfolio content
- Edit hero copy, about content, stats, contact details, and footer text
- Add, edit, delete, reorder, and feature reels
- Upload videos directly from the admin dashboard
- Export a JSON backup of portfolio content
- Restore the original demo content at any time

## Run locally

This is a static site. Any static file server can run it:

```bash
python3 -m http.server 5000 --bind 0.0.0.0
```

Then open:

- Public portfolio: `http://localhost:5000/`
- Admin dashboard: `http://localhost:5000/admin.html`

On Replit, use the configured **Start application** workflow. It runs the same Python static server on port `5000`.

## Using the admin dashboard

Open `admin.html` or select **Admin** from the portfolio navigation.

From the dashboard you can:

1. Update the hero and about sections.
2. Change the three portfolio stats.
3. Add a reel using an existing asset path, hosted video URL, or a local video upload.
4. Mark reels as featured so they appear in the featured reel slider.
5. Reorder reels with the up and down controls.
6. Edit or delete existing reels.
7. Update Instagram, email, contact copy, and footer text.
8. Export a backup before moving to another browser or device.

## Storage notes

The current version is intentionally lightweight and does not require a database:

- Text content is saved in browser `localStorage`.
- Uploaded video files are saved in browser `IndexedDB`.
- Saved changes are available on the same browser and Replit origin.
- Use **Export backup** before switching devices or clearing browser data.

This browser-based admin is suitable for a personal portfolio. It does not currently include server-side authentication, shared multi-device storage, or protected user accounts.

## Project structure

```text
.
├── index.html          # Public portfolio page
├── admin.html          # Portfolio management dashboard
├── style.css           # Public portfolio styles
├── admin.css           # Admin dashboard styles
├── script.js           # Public interactions and dynamic rendering
├── admin.js            # Admin CRUD and backup actions
├── portfolio-data.js   # Default content, storage, and media helpers
└── assets/             # Portfolio video assets
```

## Customization

Default content and reel entries live in `portfolio-data.js`. Existing media files should be placed in `assets/`, then referenced with paths such as:

```text
assets/my-new-reel.mp4
```

The public page reads saved content at runtime and falls back to the defaults when no changes have been saved.