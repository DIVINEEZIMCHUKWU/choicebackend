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
        .from('settings')
        .select('key, value');

      if (error) {
        const defaultSettings = {
          phone: '+234-806-9077-937 / +234-810-7601-537',
          email: 'thechoiceiconschools@gmail.com',
          address: 'ICON Avenue, off Delta State Polytechnic Road, Behind Joanchim Filling Station, Ogwashi-Uku, Delta State',
          facebook: 'https://www.facebook.com/thechoiceiconschools',
          announcement_bar: 'Admissions Now Open for Early Years, Nursery, Primary and Secondary'
        };
        return res.status(200).json(defaultSettings);
      }

      const settings: Record<string, string> = {};
      (data || []).forEach(item => {
        settings[item.key] = item.value;
      });

      return res.status(200).json(settings);
    } catch (error) {
      console.error('Settings fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
      }

      const { data, error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Setting updated successfully',
        data: { key, value }
      });
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ error: 'Failed to update setting' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}