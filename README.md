# Husain & Nayab — Wedding Invitation

A responsive wedding invitation for **Husain & Nayab**, built with HTML, CSS and JavaScript.

**Wedding:** 21 November 2026, 9:00 PM IST  
**Venue:** Chaudhary Palace Hotel & Marriage Hall

## Features

- Opening invitation screen with an animated envelope icon.
- Desktop photo slideshow beside the invitation, with a mobile-friendly single-column layout.
- Couple introductions, Arabic greetings, Quran verses and ceremony details.
- Live wedding countdown and a pre-filled Google Calendar event link.
- Google Maps directions to the venue.
- Photo galleries, background music and animation controls.
- Light and dark themes, accent colors and section navigation.

The shared photo album is currently a “coming soon” placeholder. No photo upload backend is included.

## Run locally

No build step or npm dependencies are required. From the project directory, run:

```bash
python3 -m http.server 8000
```

Open **http://localhost:8000** in your browser. Music begins after user interaction, subject to browser settings.

## Project structure

```text
index.html          Invitation content and wedding date
css/style.css       Layout, themes and animations
js/script.js        Countdown and date formatting
js/celebration.js   Google Calendar link and ceremony time
js/gate.js          Opening screen and interactive controls
assets/img/         Photos and placeholder illustrations
assets/mp3/         Background audio
assets/wedding.gif  Animated Muslim wedding illustration
husain-nayab-favicon.png  Browser icon
LICENSE             Original template license
```

## Customize

- **Names and copy:** edit `index.html`. Update the event title and description in `js/celebration.js` too.
- **Date and time:** change `data-wedding-date` on the `<body>` element in `index.html`. Current value: `2026-11-21T21:00:00+05:30`. Keep an explicit timezone offset. Also update the static date text and fallback Google Calendar link in the HTML.
- **Venue:** update the displayed venue, Maps URL and metadata in `index.html`, plus `location` in `js/celebration.js`.
- **Images:** replace the placeholders in `assets/img/`, or change the image paths in the HTML and CSS.
- **Music:** replace `assets/mp3/song.mp3` with audio you have permission to publish.
- **Styles:** edit `css/style.css`.

The countdown stops at zero after the wedding date. Google Calendar opens an editable draft with a default one-hour duration; guests must save it themselves.

## Publish with GitHub Pages

1. Create a GitHub repository named `husain-nayab-wedding`.
2. Push this project to the `main` branch, keeping `index.html` in the repository root.
3. In the repository, open **Settings → Pages**.
4. Select **Deploy from a branch**, choose **main** and **/ (root)**, then save.
5. After deployment, the site will be available at:

```text
https://husainsdr786.github.io/husain-nayab-wedding/
```

Relative asset paths support hosting under the repository URL.

## Customization and license

Customized and maintained by **[Husain (@husainsdr786)](https://github.com/husainsdr786)** for **Husain & Nayab**.

Customization includes the invitation layout, themes, animations, countdown, gallery, and calendar and venue integrations.

This is a customized version of an existing wedding invitation template. It retains the **GNU Affero General Public License v3.0**, available in [LICENSE](LICENSE).

Placeholder photographs were sourced from Unsplash. External fonts are served by Google Fonts. Third-party photos, music and fonts retain their respective rights and license terms; the code license does not grant rights to those assets.

## Connect and support

- **GitHub:** [@husainsdr786](https://github.com/husainsdr786)
- **Buy Me a Coffee:** [Support Husain](https://buymeacoffee.com/husainsdr786)

If you enjoy this project, you can support my work by buying me a coffee. Thank you!

The Muslim bride-and-groom illustration was AI-generated for this project. The wedding GIF uses a gentle looping zoom; reduced-motion users see the static illustration.
