# Dinh Nguyen Neon Runner Portfolio (React + Vite)

An interactive portfolio site built with React and Vite, designed like a side-scrolling platformer where users explore projects and experience by moving through a game world.

Live Demo: [View My Portfolio Site](https://dtoe07.github.io/dinh-react/)

# Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide Icons
- GitHub Pages (deployment)

---

# Project Setup (Local Development)

## 1. Clone the repository

```bash
git clone git@github.com:dtoe07/dinh-react.git
cd dinh-react
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start development server

```bash
npm run dev
```

The site will run at:

```bash
http://localhost:5173
```

Vite provides hot-reload so changes update automatically in the browser.

# Build Production Version

To create the optimized production build:

```bash
npm run build
```

This generates the production files in:

```bash
dist/
```

# Deploy to GitHub Pages

What this does:

1. Runs the build process
2. Creates a production bundle
3. Pushes the `dist` folder to the `gh-pages` branch
4. GitHub Pages automatically publishes the site

# Updating the Live Site

Whenever you make changes:

1. Commit your changes
   ```bash
   git add .
   git commit -m "update site"
   git push origin main
   ```
2. Deploy the updated build
   ```bash
   npm run build
   npm run deploy
   ```

# Live Site

```bash
https://dtoe07.github.io/dinh-react/
```

# Project Structure

```
src
├── assets
│   ├── jump.wav
│   ├── jump1.mp3
│   ├── jump2.mp3
│   └── jump3.mp3
├── components
│   ├── Background.jsx
│   └── Player.jsx
├── config
│   └── physics.js
├── data
│   ├── assets.js
│   └── background.js
├── utils
│   ├── audio.js
│   └── color.js
├── App.jsx
├── index.css
└── main.jsx
```

# Vite Configuration for GitHub Pages

The `vite.config.js` file includes a base path so assets work correctly on GitHub Pages:

```bash
export default defineConfig({
  base: '/dinh-react/',
  plugins: [react()],
})
```
