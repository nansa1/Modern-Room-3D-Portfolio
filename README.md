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
│   ├── models/          # All 3D models (.glb)
│   └── resume.pdf       # Downloadable resume
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

Replace:

```tsx
Adnan Saliyawala — Command Center
```

with your own name.

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
