# 🚀 GunLink Deployment Guide (Vercel + Render)

This guide provides step-by-step instructions for deploying GunLink to production using **Vercel** for the Frontend (Display & Controller web app) and **Render** for the Backend (Node.js Fastify & Socket.IO server).

---

## 🏗️ Architecture Overview for Production

```
┌────────────────────────────────────────┐
│             Vercel (Frontend)          │
│   • Display Landing & 3D Game Canvas   │
│   • Mobile Motion Gun Controller Web App│
└───────────────────┬────────────────────┘
                    │
       Real-time WebSocket & API
                    │
┌───────────────────▼────────────────────┐
│              Render (Backend)          │
│   • Node.js 22 + Fastify + Socket.IO   │
│   • QR Code API Generator Endpoint     │
└─────────┬──────────────────────┬───────┘
          │                      │
┌─────────▼────────┐   ┌─────────▼────────┐
│  Upstash Redis   │   │     Supabase     │
│ (Session Cache)  │   │  (Leaderboard)   │
└──────────────────┘   └──────────────────┘
```

---

## 📦 Step 1: Deploy Backend to Render

Render hosts the Node.js Fastify server with WebSocket support (`ws://` / `wss://`).

### 1.1 Create Web Service on Render
1. Push your repository to GitHub / GitLab.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your repository (`Prajapatidax/GunLink--game`).

### 1.2 Configure Service Settings
- **Name**: `gunlink-backend`
- **Environment**: `Node`
- **Region**: Choose the closest region to your target audience.
- **Branch**: `main`
- **Root Directory**: `server`
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm run start
  ```

### 1.3 Set Environment Variables on Render
Under **Environment Variables** in Render, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `10000` | Port assigned by Render (automatically set by Render) |
| `HOST` | `0.0.0.0` | Bind host |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | (Optional) Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | `A...=` | (Optional) Upstash Token |
| `SUPABASE_URL` | `https://...supabase.co` | (Optional) Supabase Project URL |
| `SUPABASE_ANON_KEY` | `eyJ...` | (Optional) Supabase Anon Key |

4. Click **Deploy Web Service**.
5. Once deployed, note down your Render Web Service URL (e.g., `https://gunlink-backend.onrender.com`).

---

## 🌐 Step 2: Deploy Frontend to Vercel

Vercel hosts the React 19 single-page application containing both the Desktop Display and Mobile Controller router.

### 2.1 Import Project into Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
2. Select your `GunLink--game` repository.

### 2.2 Project Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Set Environment Variable on Vercel
Add the following environment variable to link Vercel to your Render backend server:

| Environment Variable | Value |
| :--- | :--- |
| `VITE_SERVER_URL` | `https://gunlink-backend.onrender.com` |

*(Replace `https://gunlink-backend.onrender.com` with your exact Render backend URL).*

### 2.4 Deploy
Click **Deploy**. Vercel will build and serve your application under a custom domain (e.g. `https://gun-link.vercel.app`).

---

## 🗄️ Step 3: Upstash Redis Setup (Optional Cloud Cache)

1. Create a free Redis Database at [Upstash](https://upstash.com/).
2. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Upstash console.
3. Paste these keys into Render environment variables to enable persistent room caching across server restarts.

---

## 📊 Step 4: Supabase PostgreSQL Setup (Optional Leaderboard)

1. Create a project at [Supabase](https://supabase.com/).
2. In the Supabase SQL Editor, execute the following script to create the leaderboard table:

```sql
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playerName VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  accuracy FLOAT NOT NULL,
  comboMax INT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) and grant public read/insert
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON leaderboard FOR INSERT WITH CHECK (true);
```

3. Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your Render environment variables.

---

## 📱 Mobile HTTPS Requirements Note

Modern mobile browsers (especially **Safari on iOS 13+**) strictly enforce HTTPS for accessing motion sensors (`DeviceOrientationEvent`).

- Deploying your frontend to **Vercel** automatically provides **HTTPS / SSL certificates**, ensuring the mobile phone controller can seamlessly activate its gyroscope and vibration APIs.

---

## ✅ Deployment Checklist

- [x] Backend deployed to Render (`https://gunlink-backend.onrender.com`).
- [x] CORS allowed on backend for Vercel domain.
- [x] `VITE_SERVER_URL` set on Vercel pointing to Render URL.
- [x] QR Code generation tested via mobile browser scan.
- [x] Mobile Gyroscope aiming verified on live HTTPS site.
