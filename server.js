import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from root and subdirectories
app.use(express.static(__dirname));

// Clean URL Route Mapping for SEO Pages
const pageRoutes = {
  '/same-day-courier': 'pages/same-day-courier.html',
  '/next-day-courier': 'pages/next-day-courier.html',
  '/dedicated-courier': 'pages/dedicated-courier.html',
  '/business-courier': 'pages/business-courier.html',
  '/pallet-delivery': 'pages/pallet-delivery.html',
  '/courier-manchester': 'pages/courier-manchester.html',
  '/courier-oldham': 'pages/courier-oldham.html',
  '/about': 'pages/about.html',
  '/contact': 'pages/contact.html',
  '/privacy-policy': 'pages/privacy-policy.html',
  '/cookie-policy': 'pages/cookie-policy.html',
  '/terms-and-conditions': 'pages/terms-and-conditions.html',
  '/accessibility': 'pages/accessibility.html'
};

Object.entries(pageRoutes).forEach(([route, fileRelPath]) => {
  const handler = (req, res) => {
    const fullPath = path.join(__dirname, fileRelPath);
    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath);
    } else {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  };
  app.get(route, handler);
  app.get(`${route}/`, handler);
});

// API endpoint for Quote Requests
app.post('/api/quote', (req, res) => {
  const { name, phone, email, pickupPostcode, dropPostcode, serviceType, description } = req.body || {};

  if (!name || !phone || !email || !pickupPostcode || !dropPostcode) {
    return res.status(400).json({ error: 'Missing required consignment fields.' });
  }

  const quoteRecord = {
    id: `MFT-${Date.now().toString().slice(-4)}`,
    name,
    phone,
    email,
    pickupPostcode: String(pickupPostcode).toUpperCase(),
    dropPostcode: String(dropPostcode).toUpperCase(),
    serviceType: serviceType || 'same-day',
    description: description || 'Standard consignment',
    receivedAt: new Date().toISOString()
  };

  console.log('[MFT Dispatch Desk] New Quote Received:', quoteRecord);
  return res.status(200).json({
    success: true,
    reference: quoteRecord.id,
    message: 'Quote logged at Manchester OL8 dispatch. Transport controller will respond within 15 minutes.'
  });
});

// API endpoint for Direct Contact
app.post('/api/contact', (req, res) => {
  const { name, phone, email, message } = req.body || {};

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Please supply name, phone and email.' });
  }

  console.log('[MFT Dispatch Desk] New Inquiry:', { name, phone, email, message, receivedAt: new Date().toISOString() });
  return res.status(200).json({
    success: true,
    message: 'Message delivered to MFT Courier Manchester dispatch.'
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'MFT Courier UK Logistics',
    hub: 'Greater Manchester OL8',
    timestamp: new Date().toISOString()
  });
});

// XML Sitemap & Robots.txt Direct Routes
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Primary fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MFT Courier production server running on http://0.0.0.0:${PORT}`);
});
