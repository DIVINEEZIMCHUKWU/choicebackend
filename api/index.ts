import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json({
      success: true,
      message: 'Choice Icon Schools API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
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
    });
  } catch (error) {
    console.error('API health check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}