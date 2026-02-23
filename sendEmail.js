import nodemailer from 'nodemailer';

function createHtmlEmail(summary, itemCount, today) {
  // Convert markdown-style summary to HTML
  const htmlSummary = summary
    .replace(/^# (.*$)/gim, '<h2 style="color: #2563eb; margin-top: 24px; margin-bottom: 12px; font-size: 20px;">$1</h2>')
    .replace(/^## (.*$)/gim, '<h3 style="color: #1e40af; margin-top: 20px; margin-bottom: 10px; font-size: 18px;">$1</h3>')
    .replace(/^### (.*$)/gim, '<h4 style="color: #374151; margin-top: 16px; margin-bottom: 8px; font-size: 16px; font-weight: 600;">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1f2937;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: none; border-bottom: 1px solid #93c5fd;">$1</a>')
    .replace(/^- (.*$)/gim, '<li style="margin-bottom: 6px; line-height: 1.6;">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li style="margin-bottom: 8px; line-height: 1.6;">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin: 12px 0; line-height: 1.7; color: #374151;">')
    .replace(/🔥/g, '<span style="font-size: 18px;">🔥</span>')
    .replace(/💡/g, '<span style="font-size: 18px;">💡</span>')
    .replace(/📌/g, '<span style="font-size: 18px;">📌</span>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Tech Radar</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Email Content -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                🧠 Daily Tech Radar
              </h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 400;">
                ${today}
              </p>
            </td>
          </tr>

          <!-- Stats Bar -->
          <tr>
            <td style="background-color: #f9fafb; padding: 16px 24px; border-bottom: 2px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${itemCount}</div>
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Items Analyzed</div>
                  </td>
                  <td style="text-align: center; padding: 8px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
                    <div style="font-size: 24px; font-weight: 700; color: #10b981;">5</div>
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Sources</div>
                  </td>
                  <td style="text-align: center; padding: 8px;">
                    <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">AI</div>
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Curated</div>
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

          <!-- Sources Section -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; border-top: 2px solid #e5e7eb;">
              <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                📡 Today's Sources
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0;">
                    <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; margin-right: 8px; margin-bottom: 8px;">Hacker News</span>
                    <span style="display: inline-block; background-color: #fce7f3; color: #be185d; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; margin-right: 8px; margin-bottom: 8px;">Product Hunt</span>
                    <span style="display: inline-block; background-color: #ddd6fe; color: #5b21b6; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; margin-right: 8px; margin-bottom: 8px;">GitHub Trending</span>
                    <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; margin-right: 8px; margin-bottom: 8px;">Dev.to</span>
                    <span style="display: inline-block; background-color: #fed7aa; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500; margin-bottom: 8px;">TechCrunch</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tips Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px 24px; border-top: 2px solid #fbbf24;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40" style="vertical-align: top; font-size: 32px; padding-right: 12px;">💡</td>
                  <td style="vertical-align: middle;">
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6; font-weight: 500;">
                      <strong>Pro Tip:</strong> Bookmark interesting items for weekend deep-dives! Use browser reading lists or save to Notion/Obsidian.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                🤖 Automated by <strong style="color: #e5e7eb;">Daily Tech Radar</strong>
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </p>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #374151;">
                <p style="margin: 0; color: #6b7280; font-size: 11px; line-height: 1.5;">
                  Powered by OpenAI GPT-4o-mini • Node.js • RSS Feeds<br>
                  Stay curious, stay updated 🚀
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

function createPlainTextEmail(summary, itemCount, today) {
  return `
╔════════════════════════════════════════════════════════════╗
║           🧠 DAILY TECH RADAR                              ║
║           ${today}                                         ║
╚════════════════════════════════════════════════════════════╝

📊 Today's Stats: ${itemCount} relevant items analyzed

${summary}

────────────────────────────────────────────────────────────

📡 Sources:
• Hacker News
• Product Hunt  
• GitHub Trending
• Dev.to
• TechCrunch

────────────────────────────────────────────────────────────

💡 Pro Tip: Bookmark interesting items for weekend deep-dives!

🤖 Automated by Daily Tech Radar
Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
  `.trim();
}

export async function sendEmail(summary, itemCount) {
  console.log('📧 Preparing email...');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  const subject = `🧠 Daily Tech Radar – ${today}`;
  
  const htmlBody = createHtmlEmail(summary, itemCount, today);
  const textBody = createPlainTextEmail(summary, itemCount, today);

  const mailOptions = {
    from: `Daily Tech Radar <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: subject,
    text: textBody,
    html: htmlBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    // Log the email content so it's not lost
    console.log('\n📄 Email content that failed to send:');
    console.log('─'.repeat(60));
    console.log(textBody);
    console.log('─'.repeat(60));
    
    throw error;
  }
}
