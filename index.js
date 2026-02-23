import 'dotenv/config';
import cron from 'node-cron';
import { fetchAllFeeds } from './fetchFeeds.js';
import { summarizeItems } from './summarize.js';
import { sendEmail } from './sendEmail.js';

async function runDailyDigest() {
  const startTime = Date.now();
  console.log('\n' + '═'.repeat(60));
  console.log('🧠 DAILY TECH RADAR - Starting...');
  console.log('═'.repeat(60) + '\n');

  try {
    // Step 1: Fetch feeds
    const items = await fetchAllFeeds();

    if (items.length === 0) {
      console.log('⚠️  No relevant items found today. Skipping email.');
      return;
    }

    // Step 2: Summarize with AI
    const { summary, itemCount } = await summarizeItems(items);

    // Step 3: Send email
    await sendEmail(summary, itemCount);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Daily digest completed in ${duration}s`);
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Fatal error in daily digest:');
    console.error(error);
    console.log('═'.repeat(60) + '\n');
    
    // Don't crash the process, just log and continue
    // This ensures cron keeps running for next day
  }
}

// Validate environment variables
function validateEnv() {
  const required = ['OPENAI_API_KEY', 'EMAIL', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Copy .env.example to .env and fill in your credentials');
    process.exit(1);
  }
}

// Main execution
async function main() {
  validateEnv();

  const isTestMode = process.argv.includes('--test');

  if (isTestMode) {
    console.log('🧪 Running in TEST mode (one-time execution)\n');
    await runDailyDigest();
    process.exit(0);
  }

  // Production mode: run on schedule
  const schedule = process.env.CRON_SCHEDULE || '45 19 * * *'; // Default: 7:45 PM IST daily
  
  console.log('🚀 Daily Tech Radar is running!');
  console.log(`⏰ Schedule: ${schedule}`);
  console.log(`📧 Email: ${process.env.EMAIL}`);
  console.log(`🌍 Timezone: ${process.env.TZ || 'System default'}`);
  console.log('\n💡 Press Ctrl+C to stop\n');

  // Run immediately on startup (optional)
  if (process.env.RUN_ON_STARTUP === 'true') {
    console.log('▶️  Running initial digest...\n');
    await runDailyDigest();
  }

  // Schedule daily runs
  cron.schedule(schedule, async () => {
    await runDailyDigest();
  }, {
    timezone: process.env.TZ || 'Asia/Kolkata'
  });
}

main().catch(error => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});
