# Clozapine 3D Mind Palace

An interactive 3D spatial mind palace walkthrough for master-level clinical pharmacology, receptor binding profiles, pharmacokinetic titration, hematological monitoring, toxicity protocols, recent advances, and research literature on Clozapine.

---

## Automatic GitHub Deployment

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes your website on every `git push` to `main` or `master`.

### How It Deploys:
1. **Automated `gh-pages` branch deployment**: The workflow compiles your site and pushes the production build directly to the `gh-pages` branch.
2. **GitHub Pages (One-Time Setting in your GitHub Repo)**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**:
     - **Option A (Recommended)**: Set Source to **Deploy from a branch**, and select **`gh-pages`** / `/(root)`.
     - **Option B**: Set Source to **GitHub Actions**.
   - Your website will immediately be live at `https://<your-username>.github.io/<your-repo-name>/`!

---

## Local Development & Build

### Prerequisites
- Node.js 18+ or 20+
- npm

### Installation
```bash
npm install
```

### Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

### Build the Static Website for Production
```bash
npm run build:client
```
The compiled, optimized static website assets will be output to the `dist/` directory.

### Build the Full-Stack Server Bundle
```bash
npm run build
npm start
```
