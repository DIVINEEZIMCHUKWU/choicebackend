// Express-based API server for testing
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Documentation
const apiDocs = {
  success: true,
  message: 'Choice Icon Schools API is running',
  version: '1.0.0',
  environment: 'development',
  endpoints: {
    auth: {
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me'
    },
    forms: {
      contact: 'POST /api/contact',
      admission: 'POST /api/admission',
      feedback: 'POST /api/feedback',
      career: 'POST /api/career'
    },
    admin: {
      enquiries: 'GET /api/enquiries',
      admissions: 'GET /api/admissions',
      jobs: 'GET /api/jobs',
      blog: 'GET /api/blog',
      announcements: 'GET /api/announcements',
      events: 'GET /api/events',
      gallery: 'GET /api/gallery',
      settings: 'GET /api/settings',
      stats: 'GET /api/stats'
    }
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

// API Documentation
app.get('/api', (req, res) => {
  res.json({ ...apiDocs, timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Choice Icon Schools Backend API', docs: `http://localhost:${PORT}/api` });
});

// ========== FORM ENDPOINTS ==========

// Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required (name, email, phone, message)' });
    }

    console.log('📧 Contact form submitted:', { name, email, phone });
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: { name, email, phone, submittedAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Admission Form
app.post('/api/admission', async (req, res) => {
  try {
    const { fullName, email, phone, class: admissionClass, guardianName } = req.body;
    
    if (!fullName || !email || !phone || !admissionClass) {
      return res.status(400).json({ error: 'Required fields: fullName, email, phone, class' });
    }

    console.log('🎓 Admission form submitted:', { fullName, email, admissionClass });
    res.status(200).json({
      success: true,
      message: 'Admission form submitted successfully',
      data: { fullName, email, phone, class: admissionClass, submittedAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Admission form error:', error);
    res.status(500).json({ error: 'Failed to submit admission form' });
  }
});

// Feedback Form
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body;
    
    if (!name || !email || !feedback) {
      return res.status(400).json({ error: 'Required fields: name, email, feedback' });
    }

    console.log('💬 Feedback submitted:', { name, email, rating });
    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { name, email, feedback, rating, submittedAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Career Form
app.post('/api/career', async (req, res) => {
  try {
    const { fullName, email, phone, position, experience } = req.body;
    
    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({ error: 'Required fields: fullName, email, phone, position' });
    }

    console.log('💼 Career form submitted:', { fullName, email, position });
    res.status(200).json({
      success: true,
      message: 'Career application submitted successfully',
      data: { fullName, email, phone, position, experience, submittedAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Career form error:', error);
    res.status(500).json({ error: 'Failed to submit career application' });
  }
});

// ========== AUTH ENDPOINTS ==========

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    console.log('🔐 Login attempt:', email);
    res.status(200).json({
      success: true,
      message: 'Login successful (development mode)',
      token: 'mock_token_' + Date.now(),
      user: { email, role: 'user' }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  res.json({
    success: true,
    user: { email: 'user@example.com', role: 'user', id: '123' }
  });
});

// ========== ADMIN ENDPOINTS ==========

// Get enquiries
app.get('/api/enquiries', (req, res) => {
  res.json({ success: true, data: [], message: 'No enquiries' });
});

// Get admissions
app.get('/api/admissions', (req, res) => {
  res.json({ success: true, data: [], message: 'No admissions' });
});

// Get jobs
app.get('/api/jobs', (req, res) => {
  res.json({ success: true, data: [], message: 'No jobs' });
});

// Get blog posts
app.get('/api/blog', (req, res) => {
  res.json({ success: true, data: [], message: 'No blog posts' });
});

// Get announcements
app.get('/api/announcements', (req, res) => {
  res.json({ success: true, data: [], message: 'No announcements' });
});

// Get events
app.get('/api/events', (req, res) => {
  res.json({ success: true, data: [], message: 'No events' });
});

// Get gallery
app.get('/api/gallery', (req, res) => {
  res.json({ success: true, data: { images: [], videos: [] }, message: 'Gallery empty' });
});

// Get settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: {}, message: 'Settings retrieved' });
});

// Get stats
app.get('/api/stats', (req, res) => {
  res.json({ success: true, data: { students: 0, staff: 0, events: 0 }, message: 'Stats retrieved' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    suggestion: `Visit http://localhost:${PORT}/api for available endpoints`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Choice Icon Schools API Server`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
});
