# MFT Courier — Premium British Logistics Website

> **Award-Winning Web Design & Direct GitHub Pages Deployment Package**  
> Operations Base: Greater Manchester (OL8), United Kingdom  
> Telephone: 07501 419198 · International: +44 7501 419198  
> WhatsApp Dispatch: [wa.me/447501419198](https://wa.me/447501419198)  
> Email: info@mftcourier.co.uk  

---

## 1. Project Overview

This repository contains the complete, production-ready website redesign for **MFT Courier**. Built with an industrial creative-agency aesthetic (inspired by Active Theory), it features:

- **Hero Experience**: Headline *"Move it fast. Move it right."*, layered cursor-follow reveal, authentic British road logistics photography, and direct WhatsApp quote CTAs. *(Zero 3D toy delivery vans).*
- **Signature 3D Experience (`js/globe.js`)**: Interactive WebGL Three.js spatial logistics globe & UK arterial network visualization, centered on the **Greater Manchester OL8 hub**, featuring interactive corridor nodes (London, Birmingham, Leeds, Liverpool, Glasgow, Bristol) with verified motorway routes and distance notes.
- **Brand Identity (`assets/logo/`)**: Custom SVG monogram and wordmark suite (primary, monogram, light for dark backgrounds, dark for light backgrounds, and `favicon.svg`).
- **Interactive Quote Generator (`js/main.js`)**: Structured WhatsApp inquiry form that compiles journey details into a clean URL-encoded message directly to `+447501419198`.
- **Zero-Pill Restraint & Anti-Slop Design**: Editorial typography (Space Grotesk, Plus Jakarta Sans, JetBrains Mono), deep charcoal obsidian palette (`#0B0F15`) with electric lime accent (`#22C55E`), and WCAG 2.2 AA accessibility.
- **Verified Facts & Operational Truth**: Zero fabricated review scores, fake star ratings, or simulated tracking.
- **Search Engine Optimization (SEO)**: Semantic HTML5, Schema.org `LocalBusiness` JSON-LD, Open Graph, Twitter cards, `sitemap.xml`, and `robots.txt`.
- **100% GitHub Pages Ready**: Fully static, clean relative file paths (`index.html`, `404.html`, `assets/`, `css/`, `js/`, `pages/`).

---

## 2. Complete File Structure

```text
├── index.html              # Main landing page (all 11 master sections)
├── 404.html                # Custom 404 error page matching brand identity
├── CNAME                   # Custom domain pointer (mftcourier.co.uk)
├── robots.txt              # Search engine crawler instructions
├── sitemap.xml             # XML sitemap with all verified subpages
├── site.webmanifest        # Progressive Web App manifest
├── favicon.svg             # High-resolution SVG monogram icon
├── README.md               # Master deployment & maintenance guide
├── assets/
│   ├── logo/
│   │   ├── logo-primary.svg   # Full brand mark with typography
│   │   ├── logo-monogram.svg  # Compact MFT square mark
│   │   ├── logo-light.svg     # White/lime version for dark backgrounds
│   │   └── logo-dark.svg      # Dark version for light backgrounds
│   └── images/                # Authentic British road logistics photography
│       ├── hero_british_courier_road_1790543302361.jpg
│       ├── hero_reveal_courier_cargo_1790543312550.jpg
│       ├── journey_highway_motion_1790544939721.jpg
│       ├── journey_delivery_handover_1790544950590.jpg
│       ├── service_same_day_urgency_1790544913995.jpg
│       ├── service_next_day_scheduled_1790544925795.jpg
│       ├── service_dedicated_transit_1790543334017.jpg
│       └── service_pallets_freight_1790543323503.jpg
├── css/
│   └── styles.css          # Industrial design system & Active Theory styles
├── js/
│   ├── main.js             # GSAP motion, cursor spotlight, mobile drawer & WhatsApp generator
│   └── globe.js            # Three.js 3D logistics globe & UK arterial network
└── pages/                  # Complete directory of verified service & legal subpages
    ├── about.html
    ├── contact.html
    ├── same-day-courier.html
    ├── dedicated-courier.html
    ├── next-day-courier.html
    ├── business-courier.html
    ├── pallet-delivery.html
    ├── courier-manchester.html
    ├── courier-oldham.html
    ├── privacy-policy.html
    ├── terms-and-conditions.html
    ├── cookie-policy.html
    └── accessibility.html
```

---

## 3. How to Deploy to GitHub Pages

### Method A: Direct Upload via GitHub Web Interface

1. **Log in to GitHub** and open your repository (e.g. `your-username/mft-courier` or `your-username.github.io`).
2. **Delete or Replace Existing Files**:
   - If replacing an old version, navigate into your repository and delete the old files or click **"Add file"** > **"Upload files"**.
3. **Upload the Project Files**:
   - Drag and drop all files from this project folder:
     - `index.html`
     - `404.html`
     - `CNAME`
     - `robots.txt`
     - `sitemap.xml`
     - `site.webmanifest`
     - `favicon.svg`
     - `README.md`
     - The folders: `assets/`, `css/`, `js/`, and `pages/`.
4. **Commit Changes**: Add a message like `Deploy MFT Courier website redesign` and click **"Commit changes"**.
5. **Enable GitHub Pages**:
   - Go to your repository **Settings** tab.
   - On the left sidebar, click **"Pages"**.
   - Under **Build and deployment > Source**, select **"Deploy from a branch"**.
   - Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
   - Click **Save**.
   - Within 1–2 minutes, your website will be live at `https://your-username.github.io/repository-name/` or your custom domain!

### Method B: Git Command Line

```bash
# Clone your existing GitHub repository
git clone https://github.com/your-username/your-repository.git
cd your-repository

# Copy all new files into the cloned folder, replacing existing files

# Add all files to Git
git add .

# Commit changes
git commit -m "feat: complete MFT Courier redesign for GitHub Pages"

# Push to GitHub
git push origin main
```

---

## 4. Custom Domain Configuration (e.g. `mftcourier.co.uk`)

The repository includes a `CNAME` file containing `mftcourier.co.uk`.

If publishing to `mftcourier.co.uk`, configure your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap) with the standard GitHub Pages DNS records:

| Record Type | Name / Host | Target / Value |
| :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` |
| **A** | `@` | `185.199.109.153` |
| **A** | `@` | `185.199.110.153` |
| **A** | `@` | `185.199.111.153` |
| **CNAME** | `www` | `your-username.github.io` |

In GitHub: **Settings > Pages > Custom domain**, enter `mftcourier.co.uk` and check **"Enforce HTTPS"**.

---

## 5. Local Development & Preview

Because this project is built with standard HTML5, CSS3, ES6 JavaScript, and WebGL, you can preview it locally in several ways:

### Option 1: Using Vite (Included)
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Option 2: Using Python's Built-in Server
```bash
python3 -m http.server 8000
# Opens at http://localhost:8000
```

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 6. SEO & Google Search Console Checklist

1. **Verify Ownership**:
   - Go to [Google Search Console](https://search.google.com/search-console).
   - Add property: `https://mftcourier.co.uk` (or your GitHub Pages URL).
   - Verify via DNS TXT record or HTML meta tag.
2. **Submit Sitemap**:
   - In Search Console under **Sitemaps**, submit: `https://mftcourier.co.uk/sitemap.xml`.
3. **Verify Robots**:
   - Search Console will fetch `https://mftcourier.co.uk/robots.txt` which permits full crawling.
4. **Structured Data Check**:
   - Validate with the [Google Rich Results Test](https://search.google.com/test/rich-results) to confirm the embedded `LocalBusiness` schema is valid.

---

## 7. Business Source of Truth & Support

All links and operational details are strictly grounded in verified facts:
- **Business Name**: MFT Courier
- **Telephone**: 07501 419198 (`tel:+447501419198`)
- **WhatsApp Quote**: [https://wa.me/447501419198](https://wa.me/447501419198)
- **Email**: [info@mftcourier.co.uk](mailto:info@mftcourier.co.uk)
- **Base of Operations**: Greater Manchester (OL8), United Kingdom
- **Market**: Dedicated UK Same-Day Courier & Logistics
