import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Enquiry deleted successfully'
      });
    } catch (error) {
      console.error('Enquiry deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete enquiry' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}