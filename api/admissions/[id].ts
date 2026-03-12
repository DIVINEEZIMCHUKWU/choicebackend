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
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const { data, error } = await supabase
        .from('admissions')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Admission updated successfully',
        data: data?.[0]
      });
    } catch (error) {
      console.error('Admission update error:', error);
      return res.status(500).json({ error: 'Failed to update admission' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('admissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Admission deleted successfully'
      });
    } catch (error) {
      console.error('Admission deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete admission' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}