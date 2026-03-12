import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { title, description, event_date, location, image_url } = req.body;

      if (!title || !description || !event_date || !location) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const { data, error } = await supabase
        .from('events')
        .update({
          title,
          description,
          event_date,
          location,
          image_url: image_url || ''
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: data?.[0]
      });
    } catch (error) {
      console.error('Event update error:', error);
      return res.status(500).json({ error: 'Failed to update event' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      console.error('Event deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete event' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}