<div align="center">
  <img src="assets/logo.png" alt="SingStarDB Logo" width="120" />
  <h1>SingStarDB.app</h1>
  <p>The ultimate searchable database for all your favorite SingStar tracks.</p>

  <!-- AI Assistance Badge -->
  <a href="https://gemini.google.com/">
    <img src="https://img.shields.io/badge/Developed%20with-AI%20Assistance-8A2BE2?style=flat-square&logo=google-gemini" alt="Developed with AI Assistance">
  </a>
</div>

<br />

SingStarDB is a lightning-fast, glassmorphic web application that allows users to instantly search for songs and find out which exact SingStar versions and platforms they are available on. 

**🚀 Try it live here: [http://singstardb.app.marvin.cx/](http://singstardb.app.marvin.cx/)**

## ✨ Features
- **Instant Search:** Find songs by artist or title instantly with a highly optimized Vanilla JS filtering system.
- **Region Filtering:** Filter tracks globally or by specific countries (e.g., DE, UK, US).
- **Platform Badges:** Easily see if a song is available on PS2, PS3, or both.
- **Premium Design:** A modern dark-mode aesthetic featuring glassmorphism, dynamic background blobs, and micro-animations.
- **Zero Dependencies:** Built purely with HTML, CSS, and Vanilla JavaScript. No build steps required.

## 🚀 Deployment (Cloudflare Pages)

Because this application uses a pure Vanilla stack, deploying to **Cloudflare Pages** is incredibly simple:
1. Connect this GitHub repository to your Cloudflare Pages account.
2. Set the build framework to **None**.
3. Leave the build command **empty**.
4. Set the build output directory to `/` (the root of the repository).
5. Cloudflare will automatically serve `index.html`!

## 💻 Local Development
There is no `npm install` or build step required to work on this app.
However, because the `app.js` fetches `data/singstarData.json` locally, you need to run a local web server to bypass browser CORS restrictions during development.

Using Python:
```bash
python -m http.server 8080
```

Using Node (`http-server`):
```bash
npx http-server -p 8080 -c-1
```
Then visit `http://localhost:8080` in your browser.

## 🤝 Help needed!
I have only added German PS2 SingStar songs for now. 
Feel free to open up a PR and add more songs to the [`data/singstarData.json`](https://github.com/Stockenberger/singstardb.app/blob/main/data/singstarData.json).

---

*Coded with help from AI.*
