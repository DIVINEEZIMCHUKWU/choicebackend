import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'thechoiceiconschools@gmail.com';

interface EmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
  type?: 'Contact' | 'Admission' | 'Career' | 'Feedback';
  cvUrl?: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function sendAdminEmail(data: EmailData) {
  try {
    console.log('🔧 Preparing admin email for:', data.email);
    console.log('📧 Admin email destination:', adminEmail);
    console.log('🔑 Resend API Key configured:', !!process.env.RESEND_API_KEY);
    console.log('📝 Email content preview:', {
      name: data.name,
      phone: data.phone,
      message: data.message.substring(0, 100) + '...',
      type: data.type
    });

    const typeLabel = data.type || 'Contact';
    const typeColor = data.type === 'Admission' ? '#EF4444' : data.type === 'Career' ? '#F59E0B' : '#EC4899';

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <info@choiceiconschools.com>',
      to: adminEmail,
      replyTo: data.email,
      subject: `New ${typeLabel} Form Submission - Choice Icon Schools`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; line-height: 1.6 !important; color: #333 !important; margin: 0 !important; padding: 0 !important; background-color: #f5f5f5 !important; }
              .wrapper { background-color: #f5f5f5 !important; padding: 20px !important; }
              .container { max-width: 600px !important; margin: 0 auto !important; background-color: #ffffff !important; border-radius: 8px !important; overflow: hidden !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; color: white !important; padding: 30px 20px !important; text-align: center !important; }
              .header h1 { margin: 0 !important; font-size: 28px !important; font-weight: 600 !important; }
              .header p { margin: 5px 0 0 0 !important; font-size: 14px !important; opacity: 0.9 !important; }
              .badge { display: inline-block !important; background-color: ${typeColor} !important; color: white !important; padding: 6px 16px !important; border-radius: 20px !important; font-size: 12px !important; font-weight: 600 !important; margin-top: 10px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }
              .content { padding: 30px 20px !important; }
              .form-section { margin-bottom: 25px !important; }
              .form-section h3 { color: #1e40af !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; margin: 0 0 10px 0 !important; border-bottom: 2px solid ${typeColor} !important; padding-bottom: 8px !important; }
              .field { margin-bottom: 15px !important; }
              .field-label { font-weight: 600 !important; color: #1e40af !important; font-size: 12px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; margin-bottom: 5px !important; display: block !important; }
              .field-value { background-color: #f9fafb !important; padding: 12px 15px !important; border-left: 4px solid ${typeColor} !important; border-radius: 4px !important; word-wrap: break-word !important; word-break: break-word !important; overflow-wrap: break-word !important; }
              .field-value a { color: #1e40af !important; text-decoration: none !important; word-break: break-word !important; }
              .field-value a:hover { text-decoration: underline !important; }
              .divider { border-top: 1px solid #e5e7eb !important; margin: 25px 0 !important; }
              .footer { background-color: #f3f4f6 !important; padding: 20px !important; text-align: center !important; border-top: 1px solid #e5e7eb !important; font-size: 12px !important; color: #666 !important; }
              .footer p { margin: 5px 0 !important; }
              .button { display: inline-block !important; background-color: #1e40af !important; color: white !important; padding: 10px 20px !important; border-radius: 4px !important; text-decoration: none !important; font-weight: 600 !important; margin-top: 10px !important; }
              .note { font-size: 12px !important; color: #666 !important; font-style: italic !important; text-align: center !important; padding: 15px !important; background-color: #f0f9ff !important; border-left: 3px solid #1e40af !important; margin-top: 20px !important; }
              table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
              td { padding: 8px 0 !important; word-break: break-word !important; overflow-wrap: break-word !important; }
              td:first-child { color: #1e40af !important; font-weight: 600 !important; width: 35% !important; text-transform: uppercase !important; font-size: 11px !important; letter-spacing: 0.5px !important; vertical-align: top !important; }
              td:last-child { width: 65% !important; word-break: break-word !important; }
              a { word-break: break-word !important; }
              .reply-section { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 20px !important; margin-top: 20px !important; }
              .reply-section h4 { color: #1e40af !important; margin: 0 0 10px 0 !important; font-size: 16px !important; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header">
                  <h1>Choice Icon Schools</h1>
                  <p>New Message Notification</p>
                  <div class="badge">${typeLabel} Form</div>
                </div>

                <div class="content">
                  <div class="form-section">
                    <h3>📋 Sender Information</h3>
                    <table>
                      <tr>
                        <td>Name:</td>
                        <td>${escapeHtml(data.name)}</td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
                      </tr>
                      <tr>
                        <td>Phone:</td>
                        <td><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td>
                      </tr>
                    </table>
                  </div>

                  <div class="divider"></div>

                  <div class="form-section">
                    <h3>💬 Message</h3>
                    <div class="field-value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
                  </div>

                  ${data.cvUrl ? `
                  <div class="divider"></div>
                  <div class="form-section">
                    <h3>📎 Attachments</h3>
                    <a href="${data.cvUrl}" class="button" target="_blank">📄 View CV</a>
                  </div>
                  ` : ''}

                  <div class="divider"></div>

                  <div class="reply-section">
                    <h4>📧 Reply to this message</h4>
                    <p>Click the reply button in your email client to respond to <strong>${escapeHtml(data.name)}</strong></p>
                  </div>
                </div>

                <div class="footer">
                  <p>© 2024 Choice Icon Schools. All rights reserved.</p>
                  <p>This email was sent because a new form was submitted on the website.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully to:', adminEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error };
  }
}

export async function sendConfirmationEmail(data: EmailData) {
  try {
    console.log('📧 Sending confirmation email to:', data.email);

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <info@choiceiconschools.com>',
      to: data.email,
      subject: `We Received Your ${data.type || 'Contact'} Request - Choice Icon Schools`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; line-height: 1.6 !important; color: #333 !important; margin: 0 !important; padding: 0 !important; background-color: #f5f5f5 !important; }
              .wrapper { background-color: #f5f5f5 !important; padding: 20px !important; }
              .container { max-width: 600px !important; margin: 0 auto !important; background-color: #ffffff !important; border-radius: 8px !important; overflow: hidden !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; color: white !important; padding: 30px 20px !important; text-align: center !important; }
              .header h1 { margin: 0 !important; font-size: 28px !important; font-weight: 600 !important; }
              .content { padding: 30px 20px !important; }
              .content p { margin: 15px 0 !important; color: #374151 !important; line-height: 1.8 !important; }
              .button { display: inline-block !important; background-color: #1e40af !important; color: white !important; padding: 12px 24px !important; border-radius: 4px !important; text-decoration: none !important; font-weight: 600 !important; margin-top: 20px !important; }
              .footer { background-color: #f3f4f6 !important; padding: 20px !important; text-align: center !important; border-top: 1px solid #e5e7eb !important; font-size: 12px !important; color: #666 !important; }
              .footer p { margin: 5px 0 !important; }
              .info-box { background-color: #f0f9ff !important; border-left: 4px solid #1e40af !important; padding: 15px !important; margin: 20px 0 !important; }
              .info-box p { margin: 8px 0 !important; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header">
                  <h1>Choice Icon Schools</h1>
                  <p>Thank You for Contacting Us</p>
                </div>

                <div class="content">
                  <p>Dear <strong>${escapeHtml(data.name)}</strong>,</p>

                  <p>Thank you for submitting your ${data.type?.toLowerCase() || 'enquiry'} to Choice Icon Schools. We have received your message and it is very important to us.</p>

                  <p>Our team will review your submission and respond to you within 24-48 hours.</p>

                  <div class="info-box">
                    <p><strong>📞 Need immediate assistance?</strong></p>
                    <p>Phone: +234-806-9077-937 / +234-810-7601-537</p>
                    <p>Email: thechoiceiconschools@gmail.com</p>
                  </div>

                  <p>We appreciate your interest in Choice Icon Schools and look forward to connecting with you soon.</p>

                  <p>Best regards,<br><strong>Choice Icon Schools Team</strong></p>
                </div>

                <div class="footer">
                  <p>© 2024 Choice Icon Schools. All rights reserved.</p>
                  <p>This is an automated confirmation email. Please do not reply to this message.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Confirmation email sent successfully to:', data.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Confirmation email sending failed:', error);
    return { success: false, error };
  }
}