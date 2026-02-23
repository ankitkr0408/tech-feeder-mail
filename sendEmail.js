import nodemailer from 'nodemailer';
import { getCurrentIST, getISTDate, getCoverageWindow } from './utils/dateFormatter.js';

function createHtmlEmail(summary, itemCount, today, coverageWindow, fallback = false) {
  // Convert markdown to HTML with newsletter-style formatting
  let htmlSummary = summary
    // Headers
    .replace(/^## (.*$)/gim, '<h2 style="color: #1e293b; margin-top: 32px; margin-bottom: 16px; font-size: 22px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #334155; margin-top: 24px; margin-bottom: 12px; font-size: 18px; font-weight: 600;">$1</h3>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1e293b; font-weight: 600;">$1</strong>')
    // Links - make them stand out
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline; font-weight: 500;">$1</a>')
    // Bullet points
    .replace(/^- (.*$)/gim, '<li style="margin-bottom: 8px; line-height: 1.7; color: #475569;">$1</li>')
    // Paragraphs - split on double newlines
    .split('\n\n')
    .map(para => {
      // Skip if it's a header or list item
      if (para.startsWith('<h') || para.startsWith('<li')) return para;
      // Wrap in paragraph tags
      return `<p style="margin: 0 0 16px 0; line-height: 1.8; color: #475569; font-size: 15px;">${para}</p>`;
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Tech Radar</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 24px 0;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px 24px 32px; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0 0 8px 0; color: #111827; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Daily Tech Radar
              </h1>
              <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Hey - Welcome to today's edition. ${today}
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="color: #374151; font-size: 15px; line-height: 1.8;">
                ${htmlSummary}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                Generated: ${getCurrentIST()} | ${itemCount} items analyzed
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                Powered by OpenAI • Built for founders and developers 🚀
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

function createPlainTextEmail(summary, itemCount, today, coverageWindow, fallback = false) {
  return `
════════════════════════════════════════════════════════════
DAILY TECH RADAR
════════════════════════════════════════════════════════════

Hey - Welcome to today's edition. ${today}

${summary}

────────────────────────────────────────────────────────────

Generated: ${getCurrentIST()} | ${itemCount} items analyzed
Powered by OpenAI • Built for founders and developers 🚀
  `.trim();
}

export async function sendEmail(summary, itemCount, fallback = false) {
  console.log('📧 Preparing newsletter email...');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const today = getISTDate();
  const coverageWindow = getCoverageWindow();
  const subject = `Daily Tech Radar – ${today}`;
  
  const htmlBody = createHtmlEmail(summary, itemCount, today, coverageWindow, fallback);
  const textBody = createPlainTextEmail(summary, itemCount, today, coverageWindow, fallback);

  const mailOptions = {
    from: `Daily Tech Radar <${process.env.EMAIL}>`,
    to: 'ankitk22it@student.mes.ac.in',
    subject: subject,
    text: textBody,
    html: htmlBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Newsletter sent successfully to ankitk22it@student.mes.ac.in');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.log('\n📄 Email content that failed to send:');
    console.log('─'.repeat(60));
    console.log(textBody);
    console.log('─'.repeat(60));
    throw error;
  }
}
