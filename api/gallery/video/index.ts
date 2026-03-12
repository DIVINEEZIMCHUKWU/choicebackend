import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, url, type } = req.body;

    if (!title || !url || !type) {
      return res.status(400).json({ error: 'Title, URL, and type are required' });
    }

    const { data, error } = await supabase
      .from('gallery_videos')
      .insert([{
        title,
        url,
        type,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Gallery video added successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('Gallery video creation error:', error);
    return res.status(500).json({ error: 'Failed to add video' });
  }
}