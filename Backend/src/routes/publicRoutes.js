const express = require('express');

const router = express.Router();

const services = [
  {
    id: 1,
    title: 'Secure Digital Identity',
    category: 'Identity',
    description:
      'Unified citizen identity platform with multi-factor authentication and biometric verification.',
  },
  {
    id: 2,
    title: 'e-Government Portal',
    category: 'Portal',
    description:
      'One-stop access to 500+ government services from permits and licenses to tax filing.',
  },
  {
    id: 3,
    title: 'Smart Data Analytics',
    category: 'Analytics',
    description:
      'AI-powered insights for policy making, urban planning, and public resource optimization.',
  },
  {
    id: 4,
    title: 'Citizen Engagement',
    category: 'Engagement',
    description:
      'Real-time feedback channels, petitions, and participatory budgeting tools.',
  },
  {
    id: 5,
    title: 'Cyber Security',
    category: 'Security',
    description:
      'Government-grade threat detection, zero-trust architecture, and 24/7 SOC monitoring.',
  },
  {
    id: 6,
    title: 'Government Cloud',
    category: 'Cloud',
    description:
      'Sovereign cloud infrastructure built for compliance, resilience, and scale.',
  },
];

const news = [
  {
    id: 1,
    date: '2026-02-28',
    tag: 'Policy',
    title: 'GovTech launches National AI Strategy 2.0',
    excerpt: 'The updated framework outlines responsible AI adoption across 30 government agencies.',
  },
  {
    id: 2,
    date: '2026-02-15',
    tag: 'Identity',
    title: 'New biometric e-Passport rollout begins nationwide',
    excerpt: 'Citizens can now apply for the next-generation biometric passport entirely online.',
  },
  {
    id: 3,
    date: '2026-01-30',
    tag: 'Infrastructure',
    title: 'Smart city sensor network expanded to 12 new districts',
    excerpt: 'Real-time environmental, traffic, and public safety sensors are now live.',
  },
  {
    id: 4,
    date: '2026-01-12',
    tag: 'Cloud',
    title: 'Government Cloud achieves 99.99% uptime for 2025',
    excerpt: 'The sovereign cloud platform delivered near-perfect availability.',
  },
  {
    id: 5,
    date: '2025-12-20',
    tag: 'Engagement',
    title: 'Digital Town Hall platform reaches 5 million participants',
    excerpt: 'Citizens actively participated in budget consultations and policy feedback.',
  },
];

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/services', (req, res) => {
  res.status(200).json({ success: true, data: services });
});

router.get('/services/:id', (req, res) => {
  const serviceId = Number.parseInt(req.params.id, 10);
  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  return res.status(200).json({ success: true, data: service });
});

router.get('/news', (req, res) => {
  res.status(200).json({ success: true, data: news });
});

router.get('/news/:id', (req, res) => {
  const newsId = Number.parseInt(req.params.id, 10);
  const article = news.find((item) => item.id === newsId);

  if (!article) {
    return res.status(404).json({ success: false, message: 'Article not found.' });
  }

  return res.status(200).json({ success: true, data: article });
});

router.get('/stats', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { label: 'Digital Services', value: '500+' },
      { label: 'Citizens Served', value: '120M' },
      { label: 'Platform Uptime', value: '99.97%' },
      { label: 'Cost Savings', value: '40%' },
    ],
  });
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    });
  }

  console.log('New contact submission:', { name, email, subject, message });

  return res.status(201).json({
    success: true,
    message: 'Your message has been received. We will get back to you shortly.',
  });
});

router.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
    });
  }

  console.log('New subscriber:', email);

  return res.status(201).json({
    success: true,
    message: 'You have been subscribed to the VitalCode newsletter.',
  });
});

module.exports = router;
