import nodemailer from 'nodemailer';
import { getCurrentIST, getISTDate, getCoverageWindow } from './utils/dateFormatter.js';

function createHtmlEmail(summary, itemCount, today, coverageWindow, fallback = false) {
  const htmlSummary = summary
    .replace(/^# (.*$)/gim, '<h2 style="color: #2563eb; margin-top: 24px; margin-bottom: 12px; font-size: 20px;">$1</h2>')
    .replace(/^## (.*$)/gim, '<h3 style="color: #1e40af; margin-top: 20px; margin-bottom: 10px; font-size: 18px;">$1</h3>')
    .replace(/^### (.*$)/gim, '<h4 style="color: #374151; margin-top: 16px; margin-bottom: 8px; font-size: 16px; font-weight: 600;">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1f2937;">$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: none; border-bottom: 1px solid #93c5fd;">$1</a>')
    .replace(/^- (.*$)/gim, '<li style="margin-bottom: 6px; line-height: 1.6;">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin: 12px 0; line-height: 1.7; color: #374151;">')
    .replace(/🎯/g, '<span style="font-size: 18px;">🎯</span>')
    .replace(/🚀/g, '<span style="font-size: 18px;">🚀</span>')
    .replace(/🧠/g, '<span style="font-size: 18px;">🧠</span>')
    .replace(/❌/g, '<span style="font-size: 18px;">❌</span>');

  const statusBadge = fallback 
    ? '<span style="background-color: #fbbf24; color: #78350f; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">STRUCTURED FALLBACK</span>'
    : '<span style="background-color: #10b981; color: #064e3b; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">AI ANALYZED</span>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Tech Radar - CTO Brief</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                🧠 Daily Tech Radar
              </h1>
              <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 14px; font-weight: 400;">
                CTO Intelligence Brief
              </p>
            </td>
          </tr>

          <!-- Meta Bar -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 24px; border-bottom: 2px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 4px 0;">
                    <div style="font-size: 13px; color: #475569; margin-bottom: 4px;">
                      <strong style="color: #1e293b;">Date:</strong> ${today}
                    </div>
                    <div style="font-size: 13px; color: #475569; margin-bottom: 8px;">
                      <strong style="color: #1e293b;">Coverage:</strong> ${coverageWindow}
                    </div>
                    <div>
                      ${statusBadge}
                      <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 8px;">${itemCount} ITEMS</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <div style="color: #1f2937; font-size: 15px; line-height: 1.7;">
                ${htmlSummary}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;">
                🤖 Automated CTO Brief by <strong style="color: #e2e8f0;">Daily Tech Radar</strong>
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                Generated: ${getCurrentIST()}
              </p>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155;">
                <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.5;">
                  Powered by OpenAI GPT-4o-mini • Strategic Filtering • RSS Intelligence<br>
                  Built for SaaS founders and product engineers 🚀
                </p>
              </div>
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
  const status = fallback ? '[STRUCTURED FALLBACK]' : '[AI ANALYZED]';
  
  return `
╔════════════════════════════════════════════════════════════╗
║           🧠 DAILY TECH RADAR - CTO BRIEF                  ║
╚════════════════════════════════════════════════════════════╝

${today}
Coverage: ${coverageWindow}
Status: ${status} | Items: ${itemCount}

────────────────────────────────────────────────────────────

${summary}

────────────────────────────────────────────────────────────

🤖 Automated CTO Brief by Daily Tech Radar
Generated: ${getCurrentIST()}

Powered by OpenAI GPT-4o-mini • Strategic Filtering • RSS Intelligence
Built for SaaS founders and product engineers 🚀
  `.trim();
}

export async function sendEmail(summary, itemCount, fallback = false) {
  console.log('📧 Preparing CTO brief email...');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const today = getISTDate();
  const coverageWindow = getCoverageWindow();
  const subject = `🧠 Daily Tech Radar – ${today}`;
  
  const htmlBody = createHtmlEmail(summary, itemCount, today, coverageWindow, fallback);
  const textBody = createPlainTextEmail(summary, itemCount, today, coverageWindow, fallback);

  const mailOptions = {
    from: `Tech Radar CTO Brief <${process.env.EMAIL}>`,
    to: 'ankitk22it@student.mes.ac.in',
    subject: subject,
    text: textBody,
    html: htmlBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ CTO brief sent successfully to ankitk22it@student.mes.ac.in');
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
