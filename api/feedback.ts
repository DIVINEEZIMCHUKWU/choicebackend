import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendAdminEmail, sendConfirmationEmail } from '../lib/email';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

interface ContactFormData {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📝 Feedback form received:', { name: req.body.name, email: req.body.email });
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !phone || !message) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({ error: 'Name, phone, and message are required' });
    }

    // Save to Supabase
    console.log('💾 Saving to Supabase enquiries table...');
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          email: email || null,
          phone,
          message: `FEEDBACK/COMPLAINT: ${message}`,
          type: 'Feedback',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save message to database' });
    }

    console.log('✅ Saved to Supabase:', data);

    // Send emails
    try {
      console.log('📧 Sending admin email to:', process.env.ADMIN_EMAIL);
      await sendAdminEmail({ name, email: email || '', phone, message: `FEEDBACK/COMPLAINT: ${message}`, type: 'Contact' });
      console.log('✅ Admin email sent');

      if (email) {
        console.log('📧 Sending confirmation email to:', email);
        await sendConfirmationEmail({ name, email, phone, message, type: 'Contact' });
        console.log('✅ Confirmation email sent');
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your feedback has been received',
      data,
    });
  } catch (error) {
    console.error('❌ Feedback form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}