# 🔫 GunLink — Motion-Controlled 3D Web Shooter

> **Turn your mobile phone into a physical 3D motion gun controller.**  
> Scan a QR code on your Desktop/TV display, aim using your smartphone's physical gyroscope, and fire real-time physics projectiles at procedural AI robot targets.

---

## 🌟 Key Features & Portfolio Highlights

- 📱 **Zero-App Mobile Motion Controller**: Operates 100% inside modern web browsers using the standard **DeviceOrientation API**, **Vibration API**, and **Screen Wake Lock API**. No App Store or Play Store downloads needed!
- 🎯 **Gyroscope Aiming & Smoothing**: Custom exponential smoothing filter (alpha/beta/gamma interpolation) for jitter-free, ultra-responsive pitch and yaw movement. Includes one-tap zeroing calibration.
- ⚡ **Ultra-Low Latency Synchronization**: Powered by Node.js, Fastify, and Socket.IO real-time event relays with cross-origin room pairing.
- 🎮 **3D Rapier Physics Engine**: Rendered in WebGL using Three.js, React Three Fiber (`@react-three/fiber`), and `@react-three/rapier` physical rigidbodies.
- 🤖 **Procedural AI Targets**: Intelligent robot enemies (Scouts, Heavy Mechs, Drones) constructed procedurally from 3D primitives with state machines (Patrol, Search, Hit Reaction, Death Shatter).
- 🔊 **Procedural Web Audio Engine**: Synthesizes punchy gunshots, metallic hit markers, sub-bass explosions, mechanical reload ratchets, and UI chimes using Web Audio API + Howler.js—requiring **zero external sound assets**!
- 💎 **Cyberpunk Glassmorphism UI**: High-FPS reactive HUD with motion-tracking reticle crosshair, combo multipliers, ammo status, and global leaderboard.
- 🚀 **Zero-Config Local Fallbacks**: Upstash Redis session cache and Supabase PostgreSQL leaderboard include automatic in-memory fallbacks so the entire application runs out-of-the-box locally without setup overhead.

---

## 🛠️ Architecture & Monorepo Structure

GunLink is organized as a clean TypeScript monorepo containing three core modules:

```
GunLink/
├── shared/                 # Shared TypeScript interfaces, socket contracts & constants
│   ├── src/
│   │   ├── types.ts        # Room, Player, GameState, Weapon, Bot state definitions
│   │   ├── socketEvents.ts # Strongly typed Socket.IO event contracts
│   │   └── constants.ts    # Game balance, weapon config, physics constants
├── server/                 # Fastify + Socket.IO Backend Server
│   ├── src/
│   │   ├── server.ts       # Fastify setup & port binding
│   │   ├── sockets/        # Room manager, orientation relay & shoot handler
│   │   ├── services/       # Upstash Redis & Supabase state management (with memory fallback)
│   │   └── utils/          # QR code generation & room code generator
├── client/                 # Vite + React 19 Frontend Monorepo Application
│   ├── src/
│   │   ├── display/        # Desktop 3D Canvas, R3F, Rapier Physics, Landing, HUD
│   │   │   ├── components/ # Landing, RoomQR, Canvas3D, HUD, Crosshair, Bots, Weapon
│   │   │   ├── game/       # Physics setup, bot AI state machine, projectile manager
│   │   │   ├── audio/      # Howler.js spatial sound engine & procedural Web Audio generators
│   │   │   └── store/      # Zustand game state & connection state
│   │   ├── controller/     # Mobile Controller Application
│   │   │   ├── components/ # Motion controller, trigger button, gyro preview, settings
│   │   │   ├── hooks/      # useDeviceOrientation, useVibration, useWakeLock
│   │   │   └── store/      # Zustand mobile controller settings & socket sync
│   │   └── shared/         # Client UI primitives & glassmorphism theme components
```

---

## 🔄 Real-Time Game Flow

```
[ Desktop User visits Website ]
               ↓
    [ Click "START GAME" ]
               ↓
  [ Fastify generates Room Code ]
               ↓
  [ QR Code rendered on Desktop ]
               ↓
  [ Mobile scans QR Code ]
               ↓
[ Phone opens /#/controller?room=CODE ]
               ↓
[ Socket.IO pairs Display & Phone ]
               ↓
 [ Display receives "GUN CONNECTED" ]
               ↓
  [ Countdown: 3 ... 2 ... 1 ... START ]
               ↓
 [ Phone Gyro streams 60Hz orientation ]
               ↓
 [ Desktop Gun rotates in real-time ]
               ↓
 [ Player taps Trigger on Phone ]
               ↓
[ Haptic vibration + Bullet fired ]
               ↓
 [ Rapier Physics Hit Detection ]
               ↓
[ Score & Combo Streak Update ]
```

---

## 💻 Tech Stack Summary

| Layer | Technology |
| :--- | :--- |
| **3D Rendering** | Three.js, React Three Fiber, `@react-three/drei` |
| **Physics** | `@react-three/rapier` |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS v4, Motion (Framer Motion), Lucide Icons |
| **State Management** | Zustand |
| **Backend Server** | Node.js 22, Fastify, Socket.IO, `qrcode` |
| **Real-time Session Cache**| Upstash Redis (with In-Memory fallback) |
| **Database & Leaderboard**| Supabase PostgreSQL (with In-Memory fallback) |
| **Audio** | Web Audio API + Howler.js |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v20+ or v22 LTS
- **npm**: v10+

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prajapatidax/GunLink--game.git
   cd GunLink--game
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Mode** (Launches both Backend Server and Frontend Vite Dev Server concurrently):
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   - **Desktop Display**: Open `http://localhost:5173`
   - **Mobile Controller**: Scan the QR code displayed on the desktop landing screen, or navigate directly to `http://<YOUR_LOCAL_IP>:5173/#/controller?room=<ROOM_CODE>` on your phone connected to the same local Wi-Fi.

---

## ⚙️ Environment Variables (Optional Cloud Services)

To enable persistent cloud session caching via **Upstash Redis** and persistent leaderboard storage via **Supabase PostgreSQL**, create a `.env` file in `server/`:

```env
# server/.env
PORT=3001
HOST=0.0.0.0

# Upstash Redis Credentials
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Supabase Credentials
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

*Note: If these variables are not provided, GunLink automatically runs in zero-config mode using built-in high-performance in-memory stores.*

---

## 🛡️ License

MIT License. Developed for showcase and portfolio demonstration.
