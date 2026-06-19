# Solar-Powered IoT Seismic Intensity Monitoring and Early Warning System

A production-ready Next.js 15 dashboard for real-time seismic monitoring using ESP32 + MPU6050 + Firebase Realtime Database.

## Tech Stack

- **Next.js 15** + **React 19** + **TypeScript**
- **TailwindCSS** — Custom dark theme
- **Recharts** — Data visualization
- **Firebase Realtime Database** — Live data sync
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **Sonner** — Toast notifications

## Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Configure Firebase

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC9guU_SLwXdris6UZVkw0eVZKEffO7Ilc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seismic-monitoring-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://seismic-monitoring-system-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seismic-monitoring-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seismic-monitoring-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

```bash
npx vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Firebase Database Structure

```
/seismic/live
  magnitude: number
  status: "WEAK" | "MODERATE" | "STRONG"
  x: number
  y: number
  z: number
  timestamp: number

/seismic/history/{timestamp}
  magnitude: number
  status: "WEAK" | "MODERATE" | "STRONG"
  x: number
  y: number
  z: number
  timestamp: number
```

## Dashboard Features

| Feature | Description |
|---|---|
| **Live Seismograph** | Scrolling real-time waveform (last 100 points) |
| **XYZ Axes Chart** | Multi-line accelerometer chart |
| **Magnitude History** | Time-series with peak markers |
| **KPI Cards** | 6 live metric cards |
| **Alert Panel** | Automated threshold alerting |
| **Analytics Panel** | Statistics from all events |
| **Event Log Table** | Search, filter, sort, paginate, export CSV/Excel |
| **Toast Alerts** | Real-time status change notifications |

## Intensity Thresholds

| Level | Magnitude | Color |
|---|---|---|
| WEAK | < 10.5 | Green |
| MODERATE | 10.5 – 12 | Yellow |
| STRONG | ≥ 12 | Red |

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/
│   │   ├── MagnitudeHistory.tsx
│   │   ├── Seismograph.tsx
│   │   └── XYZChart.tsx
│   └── dashboard/
│       ├── AlertPanel.tsx
│       ├── AnalyticsPanel.tsx
│       ├── ErrorBanner.tsx
│       ├── EventTable.tsx
│       ├── Header.tsx
│       ├── KPICards.tsx
│       └── LoadingScreen.tsx
├── hooks/
│   ├── useClock.ts
│   └── useSeismicData.ts
├── lib/
│   └── firebase.ts
├── types/
│   └── index.ts
└── utils/
    └── index.ts
```
