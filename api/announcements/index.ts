import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Announcements fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, content, is_active } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title,
          content,
          is_active: is_active ? 1 : 0,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: data?.[0]
      });
    } catch (error) {
      console.error('Announcement creation error:', error);
      return res.status(500).json({ error: 'Failed to create announcement' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}