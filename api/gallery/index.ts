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
    const [imagesData, videosData] = await Promise.all([
      supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('gallery_videos')
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    if (imagesData.error || videosData.error) {
      throw imagesData.error || videosData.error;
    }

    const combinedData = [
      ...(imagesData.data || []).map(item => ({ ...item, type: 'image' })),
      ...(videosData.data || []).map(item => ({ ...item, type: 'video' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return res.status(200).json({
      success: true,
      data: combinedData
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
}