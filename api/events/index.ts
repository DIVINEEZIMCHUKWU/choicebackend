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
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Events fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, event_date, location, image_url } = req.body;

      if (!title || !description || !event_date || !location) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          title,
          description,
          event_date,
          location,
          image_url: image_url || '',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: data?.[0]
      });
    } catch (error) {
      console.error('Event creation error:', error);
      return res.status(500).json({ error: 'Failed to create event' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}