# 🌿 GreenMOOC — Sustainable Learning Platform

A modern MOOC (Massive Open Online Course) platform on **Green & Circular Economy for SMEs**, built with **React 18**, **Vite**, and **Firebase**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Install Dependencies](#install-dependencies)
3. [Create a Firebase Project](#create-a-firebase-project)
4. [Enable Authentication](#enable-authentication)
5. [Enable Firestore](#enable-firestore)
6. [Paste Firebase Config](#paste-firebase-config)
7. [Add Videos and PDFs](#add-videos-and-pdfs)
8. [Run Locally](#run-locally)
9. [Deploy](#deploy)

---

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 (comes with Node.js)
- A free **Google / Firebase** account

---

## Install Dependencies

```bash
# Clone the repository (or download the ZIP)
git clone <your-repo-url>
cd mooc

# Install all dependencies
npm install
```

---

## Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** → give it a name (e.g. `greenmooc`).
3. Disable or enable Google Analytics as you prefer, then click **Create project**.
4. Once the project is ready, click **Continue**.

---

## Enable Authentication

1. In your Firebase project, go to **Build → Authentication** in the left sidebar.
2. Click **Get started**.
3. Under **Sign-in method**, enable **Email/Password**.
4. Click **Save**.

> You can also enable Google sign-in or other providers later if desired.

---

## Enable Firestore

1. In Firebase Console, go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** (for development) or **production mode** (you will need to write security rules later).
4. Select your preferred Cloud Firestore location (e.g. `europe-west1`).
5. Click **Enable**.

### Recommended Security Rules (production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write only their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/progress/{unitId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/actionPlans/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Paste Firebase Config

1. In Firebase Console, go to **Project Settings** (⚙️ icon in the top-left) → **General**.
2. Scroll down to **Your apps** → click the **Web** icon (`</>`) → register a new app.
3. Copy the `firebaseConfig` object.
4. Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: 'YOUR_REAL_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef'
};
```

> ⚠️ The app will show a warning banner if it detects placeholder values like `YOUR_API_KEY`.

---

## Add Videos and PDFs

The project expects lesson assets in the `public/assets/` folder following this structure:

```
public/assets/
├── module-1/
│   ├── unit-1-1/
│   │   ├── video.mp4       ← Lesson video
│   │   └── material.pdf    ← Reading material / slides
│   ├── unit-1-2/
│   │   ├── video.mp4
│   │   └── material.pdf
│   └── ...
├── module-2/
│   ├── unit-2-1/
│   │   ├── video.mp4
│   │   └── material.pdf
│   └── ...
├── ...
└── module-6/
    ├── unit-6-1/ ... unit-6-5/
```

### Naming convention

| File | Format | Notes |
|------|--------|-------|
| `video.mp4` | MP4 (H.264) | Keep under 100 MB for fast loading |
| `material.pdf` | PDF | Slides or reference document |

Each unit folder already has a `.gitkeep` placeholder. Simply drop your files in.

> **Tip:** If you don't have videos yet, the player will show a placeholder card instead of a broken player. Once a real `video.mp4` is added, the normal player UI appears automatically.

### Alternative: Firebase Storage

If you prefer to host assets on Firebase Storage:
1. Enable **Storage** in Firebase Console.
2. Upload your files.
3. Update `videoUrl` and `materialUrl` in `src/data/courseData.js` with the download URLs.

---

## Run Locally

```bash
npm run dev
```

The app starts at `http://localhost:5173` (or the next available port).

---

## Deploy

### Option A — Firebase Hosting (recommended)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting
# → Select your project
# → Public directory: dist
# → Single-page app: Yes
# → GitHub deploys: No

# Build the production bundle
npm run build

# Deploy
firebase deploy --only hosting
```

### Option B — Vercel

```bash
npm install -g vercel
vercel
```

### Option C — Netlify

1. Push your code to GitHub.
2. Connect the repo on [netlify.com](https://netlify.com).
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## 📁 Project Structure

```
mooc/
├── public/
│   └── assets/          ← Lesson videos & PDFs (module-1 … module-6)
├── src/
│   ├── components/      ← Reusable React components
│   ├── context/         ← AuthContext (Firebase Auth state)
│   ├── data/            ← courseData.js (modules & units)
│   ├── pages/           ← Page-level components
│   ├── styles/          ← main.css (design system)
│   ├── firebase.js      ← Firebase SDK initialization
│   └── main.jsx         ← App entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Bundler | Vite 5 |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Styling | Vanilla CSS (design tokens) |
| Fonts | Inter (Google Fonts) |

---

## License

This project is part of an Erasmus+ funded initiative. See the project documentation for licensing details.
