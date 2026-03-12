import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = (fields.bucket?.[0] as string) || 'blog-images';
    const fileContent = readFileSync(file.filepath);
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.originalFilename}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileContent, {
        contentType: file.mimetype || 'application/octet-stream'
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: publicUrlData.publicUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}