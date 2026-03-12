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
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Enquiries fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}