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

## Deploy on Replit

This project is a static website. It does not need Node.js, a database, a build command, or a backend server for the public portfolio. The recommended deployment type is **Static**.

### Before publishing

1. Make sure the project opens correctly in the Replit Preview.
2. Confirm the `Start application` workflow is running.
3. Open the public portfolio at `/` and check:
   - Hero text and contact button
   - About section and video
   - Recent edits
   - Featured reels
   - Contact links
   - Mobile navigation
4. Open `/admin.html` and confirm the dashboard loads.
5. If you made content changes in the browser admin, click **Export backup** and save the JSON file somewhere safe.
6. Make sure all videos used by the default content are inside the `assets/` directory.

### Publish through the Replit Publishing tool

1. Open this project in Replit.
2. Click **Publish** in the workspace.
3. Select the **Static** deployment type.
4. Set the **Public directory** to the project root:

   ```text
   .
   ```

5. Leave the **Build command** empty. This project has no build step.
6. Do not add a run command for the static deployment. The development workflow command is only used for the Replit Preview.
7. Review the deployment settings.
8. Choose the desired visibility:
   - **Public**: anyone with the production URL can view the portfolio.
   - **Private**: only permitted collaborators can access it.
   - **Password protected**: visitors must enter the deployment password.
9. Click **Publish**.
10. Wait for the deployment build to finish.
11. Open the production URL shown by Replit. Do not build a production URL manually from the Repl name.

The published portfolio should be available at:

```text
https://your-generated-domain.replit.app/
```

The exact URL is shown in the Publishing tool after a successful deployment.

### Verify the published website

After publishing, check the production URL in a private/incognito browser window:

1. Visit `/` and confirm the homepage loads without a blank screen.
2. Scroll through every section.
3. Confirm the videos load and play when hovered.
4. Test the About, Work, and Contact navigation links.
5. Test the Instagram and email buttons.
6. Test the layout on a phone-sized browser window.
7. Visit `/admin.html` and confirm the dashboard is reachable.
8. If the deployment is public, remember that `/admin.html` is also publicly reachable. The current admin dashboard does not have login protection.

### Add a custom domain

1. Open the project’s Publishing tool.
2. Open the domain settings.
3. Choose **Add custom domain**.
4. Enter the domain you own, such as:

   ```text
   www.example.com
   ```

5. Replit will show the DNS records that must be added at your domain registrar.
6. Add the records exactly as shown. Do not guess the values.
7. Wait for DNS verification and SSL certificate provisioning.
8. Return to the Publishing tool and confirm the domain is verified.
9. Open the custom domain in an incognito window and repeat the production verification checklist.

DNS changes can take time to propagate. Keep the generated Replit URL available while the custom domain is being verified.

### Publish updates

When you change code or default content:

1. Save the files in Replit.
2. Check the Preview first.
3. If you use GitHub, commit and push the changes to the repository.
4. Open the Publishing tool.
5. Publish a new version of the deployment.
6. Wait for the new build to complete.
7. Refresh the production URL and verify the changed section.

Publishing a new version is required for code changes to appear on the live site. Updating files in the development workspace alone does not update an already-published deployment.

## Important production limitation: admin storage

The current admin dashboard is browser-based:

- Text changes use `localStorage`.
- Uploaded videos use browser `IndexedDB`.
- The saved content belongs to the browser and origin where it was created.
- A different browser, device, or user will not automatically see the same saved content.
- Clearing browser storage can remove saved admin changes and uploaded videos.
- The exported JSON backup does not include the actual uploaded video files; keep original video files separately.
- The admin page is not protected by a login.

For a personal portfolio, this is a simple way to manage content without a database. For a real client-facing production system, do not treat it as secure multi-user administration. The next production upgrade should add:

1. Server-side authentication.
2. A shared database for portfolio text and reel metadata.
3. Object storage for uploaded video files.
4. Permission checks for every admin action.
5. A private admin route that is not publicly editable.

## Replit Preview vs. Production

These are different environments:

| Environment | URL | Purpose |
| --- | --- | --- |
| Local server | `http://localhost:5000/` | Testing on your computer |
| Replit Preview | Replit development preview | Building and checking changes |
| Published site | Replit production URL or custom domain | Public website visitors |

Use the Preview URL while developing. Use the production URL shown by the Publishing tool when sharing the finished website.

## Troubleshooting deployment

### The preview is blank

1. Confirm the `Start application` workflow is running.
2. Confirm it uses port `5000`.
3. Restart the workflow.
4. Open the browser console and check for JavaScript errors.
5. Confirm `index.html`, `style.css`, `script.js`, and `portfolio-data.js` are in the project root.

### The published site shows a 404

1. Confirm the deployment type is **Static**.
2. Confirm the public directory is `.`.
3. Confirm `index.html` is in the public directory root.
4. Publish a new version after correcting the settings.

### Videos do not load

1. Confirm the referenced file exists in `assets/`.
2. Check capitalization carefully. `PankuVID.mp4` and `pankuvid.mp4` are different paths on Linux.
3. Use a browser-supported video format such as MP4 with H.264 video.
4. Avoid moving or renaming an asset without updating its path in `portfolio-data.js`.
5. If the video was uploaded through the admin, remember that it is saved only in that browser’s IndexedDB and is not included in a static deployment.

### Admin changes are missing

1. Open the admin dashboard in the same browser and on the same deployed origin where the changes were created.
2. Do not use a private/incognito window if you need saved browser storage.
3. Check that browser storage is enabled.
4. Avoid clearing site data.
5. Restore the content from the default values or use a saved backup if needed.

### Code changes are not visible after publishing

1. Confirm the changes are saved in the workspace.
2. Confirm the Preview shows the changes.
3. Publish a new deployment version.
4. Wait for the build to finish.
5. Hard refresh the production page.
6. Check the current deployment logs if the new version still fails.

## GitHub workflow

The repository is:

```text
https://github.com/Pankajnegi1q/portfolio
```

To update GitHub from the Replit workspace:

```bash
git status
git add .
git commit -m "Describe your change"
git push origin main
```

If GitHub authentication fails, connect GitHub through Replit’s integration flow instead of pasting a password or access token into the terminal or chat.