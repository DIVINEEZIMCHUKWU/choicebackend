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
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Blog fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, category, excerpt, content, image_url, additional_images } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title,
          category: category || 'General',
          excerpt: excerpt || '',
          content,
          image_url: image_url || '',
          additional_images: additional_images || [],
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: data?.[0]
      });
    } catch (error) {
      console.error('Blog creation error:', error);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}