const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow the Vite dev server to call this API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Root ──
app.get('/', (req, res) => {
  res.json({
    name: 'GovTech API',
    version: '1.0.0',
    endpoints: [
      'GET  /api/health',
      'GET  /api/services',
      'GET  /api/services/:id',
      'GET  /api/news',
      'GET  /api/news/:id',
      'GET  /api/stats',
      'POST /api/contact',
      'POST /api/subscribe',
    ],
  });
});

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ── Services ──
const services = [
  { id: 1, title: 'Secure Digital Identity', category: 'Identity', description: 'Unified citizen identity platform with multi‑factor authentication and biometric verification.' },
  { id: 2, title: 'e‑Government Portal', category: 'Portal', description: 'One‑stop access to 500+ government services — from permits and licenses to tax filing.' },
  { id: 3, title: 'Smart Data Analytics', category: 'Analytics', description: 'AI‑powered insights for policy‑making, urban planning, and public resource optimisation.' },
  { id: 4, title: 'Citizen Engagement', category: 'Engagement', description: 'Real‑time feedback channels, petitions, and participatory budgeting tools.' },
  { id: 5, title: 'Cyber Security', category: 'Security', description: 'Government‑grade threat detection, zero‑trust architecture, and 24/7 SOC monitoring.' },
  { id: 6, title: 'Government Cloud', category: 'Cloud', description: 'Sovereign cloud infrastructure purpose‑built for compliance, resilience, and scale.' },
];

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/services/:id', (req, res) => {
  const service = services.find(s => s.id === parseInt(req.params.id));
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

// ── News ──
const news = [
  { id: 1, date: '2026-02-28', tag: 'Policy', title: 'GovTech launches National AI Strategy 2.0', excerpt: 'The updated framework outlines responsible AI adoption across 30 government agencies.' },
  { id: 2, date: '2026-02-15', tag: 'Identity', title: 'New biometric e‑Passport rollout begins nationwide', excerpt: 'Citizens can now apply for the next‑generation biometric passport entirely online.' },
  { id: 3, date: '2026-01-30', tag: 'Infrastructure', title: 'Smart city sensor network expanded to 12 new districts', excerpt: 'Real‑time environmental, traffic, and public safety sensors go live.' },
  { id: 4, date: '2026-01-12', tag: 'Cloud', title: 'Government Cloud achieves 99.99% uptime for 2025', excerpt: 'Our sovereign cloud platform delivered near‑perfect availability.' },
  { id: 5, date: '2025-12-20', tag: 'Engagement', title: 'Digital Town Hall platform reaches 5 million participants', excerpt: 'Citizens actively participated in budget consultations and policy feedback.' },
];

app.get('/api/news', (req, res) => {
  res.json(news);
});

app.get('/api/news/:id', (req, res) => {
  const article = news.find(n => n.id === parseInt(req.params.id));
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// ── Stats ──
app.get('/api/stats', (req, res) => {
  res.json([
    { label: 'Digital Services', value: '500+' },
    { label: 'Citizens Served', value: '120M' },
    { label: 'Platform Uptime', value: '99.97%' },
    { label: 'Cost Savings', value: '40%' },
  ]);
});

// ── Contact form (mock) ──
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  console.log('📩 New contact submission:', { name, email, subject, message });
  res.status(201).json({ success: true, message: 'Your message has been received. We will get back to you shortly.' });
});

// ── Newsletter subscribe (mock) ──
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  console.log('📬 New subscriber:', email);
  res.status(201).json({ success: true, message: 'You have been subscribed to the GovTech newsletter.' });
});

// ── 404 fallback ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`🚀 GovTech API server running at http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health`);
});
