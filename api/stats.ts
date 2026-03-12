import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [
      { count: admissionsCount },
      { count: announcementsCount },
      { count: enquiriesCount },
      { count: eventsCount },
      { count: blogPostsCount },
      { count: jobApplicationsCount }
    ] = await Promise.all([
      supabase.from('admissions').select('*', { count: 'exact', head: true }),
      supabase.from('announcements').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('job_applications').select('*', { count: 'exact', head: true })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        admissions: admissionsCount || 0,
        announcements: announcementsCount || 0,
        enquiries: enquiriesCount || 0,
        events: eventsCount || 0,
        posts: blogPostsCount || 0,
        jobs: jobApplicationsCount || 0
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}