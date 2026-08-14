# Modern Room 3D Portfolio

An immersive **3D interactive portfolio** built with **React, TypeScript, Vite, Tailwind CSS, and React Three Fiber**. The project presents a command-center inspired room where users can explore portfolio sections such as **About, Projects, Experience, Skills, Education, and Contact** through interactive hotspots and animated camera transitions.

Designed for developers who want a unique portfolio experience that feels more like a game environment than a traditional website.

---

## Features

* Interactive 3D room built with React Three Fiber
* Smooth camera fly-to transitions
* Clickable hotspots for portfolio sections
* Responsive content panel
* Modular architecture for easy customization
* Replaceable 3D models (`.glb`)
* Easy deployment with Vite

---

## Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Three.js
* @react-three/fiber
* @react-three/drei

---

# Project Structure

```text
portfolio-3d/
├── public/
│   ├── models/           # All 3D models (.glb)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── site.webmanifest
│   ├── robots.txt        # Tells crawlers which pages they can index
│   ├── sitemap.xml       # Lists your pages for search engines
│   └── resume.pdf        # Downloadable resume
├── index.html            # SEO meta tags, favicon links, structured data
├── src/
│   ├── components/      # 3D scene components
│   ├── data/
│   │   └── content.ts   # Portfolio content and hotspot data
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

# Build for Production

```bash
npm run build
```

The production-ready files will be generated inside the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

# Deployment

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

or simply import the GitHub repository into **Vercel** and deploy.

## Deploy to Netlify

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```

---

# How to Customize the Portfolio

## Update Portfolio Content

Edit:

```text
src/data/content.ts
```

This file contains:

* Name
* About section
* Projects
* Experience
* Skills
* Education
* Contact information
* Hotspot positions
* Camera targets

No 3D code needs to be modified for content changes.

---

## Change the Displayed Name

Edit:

```text
src/App.tsx
```

Replace the placeholder name shown in the command-center header with your own name.

---

# Update `index.html` for SEO and Favicon

The root `index.html` file controls what search engines and social media previews show for your site — page title, description, keywords, social preview images, and the favicon (the small icon shown in browser tabs and search results). This is **separate from `content.ts`**, since `content.ts` only controls what's rendered inside the 3D scene itself, not the raw HTML that crawlers read before your JavaScript runs.

Open `index.html` in your project root and update the following sections:

## 1. Basic page info

```html
<title>[Your Name] — [Your Title] | [Key Skills/Keywords]</title>
```

Keep it under ~60 characters where possible so it doesn't get truncated in search results.

## 2. Meta description and keywords

```html
<meta
  name="description"
  content="[1-2 sentence summary of who you are and what you build, written for humans, ~150-160 characters]"
/>
<meta
  name="keywords"
  content="[Your Name], [skill 1], [skill 2], [role/title], [location], [company name]"
/>
```

## 3. Canonical URL

```html
<link rel="canonical" href="https://[yourdomain.com]/" />
```

Update this to your actual deployed domain — it tells search engines which URL is the "official" one if your site is reachable at multiple addresses (e.g. with and without `www`).

## 4. Open Graph and Twitter card (social preview)

```html
<meta property="og:url" content="https://[yourdomain.com]/" />
<meta property="og:title" content="[Your Name] — [Your Title]" />
<meta property="og:description" content="[Short description]" />
<meta property="og:image" content="https://[yourdomain.com]/[path-to-preview-image.jpg]" />

<meta name="twitter:title" content="[Your Name] — [Your Title]" />
<meta name="twitter:description" content="[Short description]" />
<meta name="twitter:image" content="https://[yourdomain.com]/[path-to-preview-image.jpg]" />
```

This is what shows up when your link is shared on LinkedIn, Twitter/X, Discord, WhatsApp, etc. Use a real screenshot or graphic from your `public/` folder — ideally 1200×630px.

## 5. Structured data (JSON-LD)

This block helps Google understand who you are independently of what's written elsewhere on the web:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "[Your Name]",
    "url": "https://[yourdomain.com]/",
    "jobTitle": "[Your Job Title]",
    "description": "[Short description]",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "[Your City]",
      "addressRegion": "[Your State/Region]",
      "addressCountry": "[Your Country Code]"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "[Your Company]"
    },
    "sameAs": [
      "https://www.linkedin.com/in/[your-linkedin]/",
      "https://github.com/[your-github]",
      "[any other profile URL]"
    ]
  }
</script>
```

Replace every bracketed value with your own details, or remove fields (like `worksFor`) that don't apply to you.

## 6. Hidden SEO content block

Since the 3D scene only reveals content on click and can't be reliably crawled, the `<div id="seo-content" class="sr-only">` block right before `<div id="root">` holds real, always-present HTML text for search engines to read. Update the headings, project descriptions, skills, experience, and education inside this block to match your own content — keep it in sync with `content.ts` so both sources agree.

---

# Add Your Own Favicon and Logo

1. **Create your icon files.** Use a tool like [realfavicongenerator.net](https://realfavicongenerator.net) — upload a square version of your logo and it will generate all required sizes and formats for you (`.ico`, `.svg`, `.png`, `site.webmanifest`).

2. **Place the generated files in `public/`:**

   ```text
   public/
   ├── favicon.ico
   ├── favicon.svg
   ├── favicon-96x96.png
   ├── apple-touch-icon.png
   └── site.webmanifest
   ```

3. **Reference them in `index.html`** (Vite serves everything in `public/` from the site root — do **not** use `%PUBLIC_URL%`, that placeholder only works in Create React App projects):

   ```html
   <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   <link rel="shortcut icon" href="/favicon.ico" />
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
   <meta name="apple-mobile-web-app-title" content="[Your Name]" />
   <link rel="manifest" href="/site.webmanifest" />
   ```

4. **Deploy, then verify** by visiting `https://[yourdomain.com]/favicon.svg` and `https://[yourdomain.com]/favicon-96x96.png` directly in your browser — you should see your logo, not a 404.

5. **Request re-indexing.** Search engines cache favicons separately from page content, so a new icon can take days to weeks to show up in results even after deployment. In [Google Search Console](https://search.google.com/search-console), use **URL Inspection** on your homepage and click **Request Indexing** to speed this up.

---

# Update `robots.txt` and `sitemap.xml`

These two files also live in `public/` and help search engines crawl your site correctly.

**`robots.txt`** tells crawlers what they're allowed to index:

```text
User-agent: *
Allow: /

Sitemap: https://[yourdomain.com]/sitemap.xml
```

**`sitemap.xml`** lists your pages so Google can find them faster:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[yourdomain.com]/</loc>
    <lastmod>[YYYY-MM-DD]</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

Update the domain and date, then submit the sitemap URL under **Sitemaps** in Google Search Console.

---

# Replace 3D Models

All models are located in:

```text
public/models/
```

Supported format:

```text
.glb
```

Examples already included:

* desk.glb
* chairDesk.glb
* computerScreen.glb
* laptop.glb
* bookcaseOpen.glb
* floorFull.glb
* wall.glb
* modern-neon-room.glb

To replace a model:

1. Place your new `.glb` file inside:

```text
public/models/
```

2. Open:

```text
src/components/Room.tsx
```

3. Replace the model path.

Example:

```tsx
<Model path="/models/desk.glb" />
```

can become:

```tsx
<Model path="/models/myDesk.glb" />
```

Adjust position, rotation, and scale if necessary.

---

# Change Images / Resume

## Resume

Replace:

```text
public/resume.pdf
```

with your own resume.

Keep the filename the same or update the reference in the content panel component.

## Other Images

If additional textures or images are added later, place them inside:

```text
public/
```

and reference them using:

```text
/images/your-image.png
```

---

# Where to Get 3D Models

Recommended sources:

* **Kenney Assets (CC0)** — https://kenney.nl/assets
* **Meshy AI** — https://www.meshy.ai
* **Sketchfab** — https://sketchfab.com
* **Poly Pizza** — https://poly.pizza

Use **GLB/GLTF** format for best compatibility with Three.js.

---

# Important Notes

* Keep models optimized for web performance.
* Prefer **GLB** over OBJ or FBX.
* Large textures may affect loading speed.
* Camera positions can be adjusted inside `content.ts` and `Scene.tsx`.

---

# Attribution & Reuse

This project was originally designed and developed by **Adnan Saliyawala**.

If you reuse, modify, fork, or use this project as a base for your own portfolio, **please keep the attribution** in your README or project credits.

Example:

```text
Based on the original Command Center 3D Portfolio by Adnan Saliyawala
```

GitHub: https://github.com/nansa1

---

# License

You are free to use this project for personal and educational purposes.

Commercial use and redistribution are permitted **only with proper credit to Adnan Saliyawala**.

---

## Author

**Adnan Saliyawala**

If this project helped you, consider giving the repository a ⭐ on GitHub.
