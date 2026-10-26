# MFT Courier — Dedicated UK Logistics & Courier Services

Premium responsive website for **MFT Courier**, based in OL8 / Greater Manchester, UK.

- **Website Domain**: [https://mftcourier.co.uk/](https://mftcourier.co.uk/)
- **Repository**: [https://github.com/Sprinkeldrops/mft-courier](https://github.com/Sprinkeldrops/mft-courier)
- **Direct Telephone**: 07501419198 (+447501419198)
- **Email**: info@mftcourier.co.uk
- **Location**: OL8, Greater Manchester, United Kingdom
- **Direct Quotation**: [https://wa.me/447501419198](https://wa.me/447501419198)

---

## Technical Stack
- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
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

# Server will run at http://localhost:3000
```

---

## Production Build & Static Deployment
```bash
# Compile static production bundle
npm run build
```
The output files will be created in the `dist/` directory.

### Publishing to GitHub Pages:
1. Under **Repository Settings ➔ Pages** on GitHub (`Sprinkeldrops/mft-courier`):
   - **Source**: Deploy from a branch (e.g. `gh-pages` or `/docs` on `main`) or GitHub Actions.
   - If using a custom domain (`mftcourier.co.uk`), enter `mftcourier.co.uk` in the Custom Domain field.
2. The relative base path in `vite.config.ts` (`base: './'`) ensures assets load reliably on both custom domains and repository subpaths.
