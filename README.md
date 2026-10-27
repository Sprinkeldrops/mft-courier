# MFT Courier — Dedicated UK Logistics & Courier Services

Premium responsive website and live courier telematics platform for **MFT Courier**, based in OL8 / Greater Manchester, UK.

- **Website Domain**: [https://mftcourier.co.uk/](https://mftcourier.co.uk/)
- **Repository**: [https://github.com/Sprinkeldrops/mft-courier](https://github.com/Sprinkeldrops/mft-courier)
- **Direct Telephone**: 07501419198 (+447501419198)
- **Email**: info@mftcourier.co.uk
- **Location**: OL8, Greater Manchester, United Kingdom
- **Direct Quotation**: [https://wa.me/447501419198](https://wa.me/447501419198)

---

## What Was Added

### 1. Live GPS Tracking (Interactive Leaflet Map)
- Real-time vehicle telematics with moving courier van marker, rotating heading indicator, and pulsating radar beacon.
- Route corridor display (Manchester OL8 Hub ➔ In Transit ➔ Destination Postcode).
- Dynamic ETA, speed (mph), accuracy, and consignment milestone chain of custody.
- Direct customer tracking URLs: `https://mftcourier.co.uk/?track=MFT-84920` (No login or app required for customers).
- **5-Day Security Expiration**: Consignments automatically expire from public tracking after 5 days in accordance with data privacy guidelines.

### 2. Simple 7-Digit Numeric Driver Login & Device Persistence
- **Ultra-simple Driver Interface**: One input field strictly accepting 7 numeric digits (e.g. `7492015`), one Login button. No email, password, or PIN required for the driver.
- **Cryptographic Device Binding**: The Driver ID is bound to the driver's device on initial sign-in, preventing unauthorized device spoofing or ID guessing.
- **Persistent Sessions**: Drivers remain logged in across visits with automatic session resumption.
- **Screen Wake-Lock & Quota-Safe GPS**: Uses `navigator.wakeLock` to prevent mobile handsets from sleeping during highway transit, with intelligent 12–15s throttling to stay safely within free quotas.

### 3. Private Dispatch Admin Portal (Max 10 Drivers)
- Access via **Dispatch Desk** in navigation or `?admin=1` with master dispatch passcode (`MFT2026`).
- Hard limit of **10 authorized drivers** strictly enforced in UI and database rules.
- Driver management: Add driver (generates unique 7-digit ID), activate/deactivate, reset device binding, and remove driver.
- Point-to-point consignment creation: Generates instant 5-day customer tracking link and WhatsApp dispatch share button.

---

## Technical Stack
- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Mapping**: Leaflet + OpenStreetMap (100% free, zero operating cost)
- **Database & Auth**: Cloud Firestore + Firebase SDK (Spark free-tier compatible with resilient client sync)
- **3D Graphics**: Three.js (Procedural clay logistics globe with animated UK transit arcs)
- **Styling**: Tailwind CSS v4 with custom warm ivory (`#FAF8F5`), charcoal (`#121316`), and electric-lime (`#84CC16`) palette
- **Icons**: Lucide React

---

## Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# Server runs at http://localhost:3000
```

---

## Production Build & Static Deployment (GitHub Pages)
```bash
# Compile static production bundle
npm run build
```
The output files will be created in the `dist/` directory.

### Publishing to GitHub Pages:
1. Under **Repository Settings ➔ Pages** on GitHub (`Sprinkeldrops/mft-courier`):
   - **Source**: Deploy from branch (e.g. `gh-pages` or `/docs` on `main`) or GitHub Actions.
   - If using a custom domain (`mftcourier.co.uk`), enter `mftcourier.co.uk` in the Custom Domain field.
2. The relative base path in `vite.config.ts` (`base: './'`) ensures assets load reliably on both custom domains and repository subpaths.
