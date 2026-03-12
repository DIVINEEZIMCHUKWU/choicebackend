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
      const { title, category, excerpt, content, image_url, additional_images } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title,
          category: category || 'General',
          excerpt: excerpt || '',
          content,
          image_url: image_url || '',
          additional_images: additional_images || []
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: data?.[0]
      });
    } catch (error) {
      console.error('Blog update error:', error);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      console.error('Blog deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}