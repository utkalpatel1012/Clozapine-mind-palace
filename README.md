# Clozapine 3D Mind Palace

An interactive 3D spatial mind palace walkthrough for master-level clinical pharmacology, receptor binding profiles, pharmacokinetic titration, hematological monitoring, toxicity protocols, recent advances, and research literature on Clozapine.

---

## Automatic GitHub Pages Deployment

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and publishes the website whenever you push changes to the `main` or `master` branch.

### Enabling GitHub Pages in your Repository (One-Time Setup)

1. Push this repository to your GitHub account.
2. In your GitHub repository, click on the **Settings** tab.
3. In the left sidebar under *Code and automation*, click on **Pages**.
4. Under **Build and deployment** > **Source**, change the dropdown from *Deploy from a branch* to **GitHub Actions**.
5. Once selected, pushing any commit to `main` or `master` will trigger the deployment workflow automatically!
6. Your live website URL will be displayed at the top of the Pages settings page (`https://<your-username>.github.io/<your-repo-name>/`).

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
