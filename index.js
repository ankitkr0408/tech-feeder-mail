import 'dotenv/config';
import cron from 'node-cron';
import { fetchAllFeeds } from './fetchFeeds.js';
import { filterAndRankItems, getLowSignalItems } from './filter.js';
import { extractSaaSProducts } from './extractProducts.js';
import { summarizeItems } from './summarize.js';
import { sendEmail } from './sendEmail.js';

async function runDailyDigest() {
  const startTime = Date.now();
  console.log('\n' + '═'.repeat(60));
  console.log('📰 DAILY TECH RADAR - NEWSLETTER GENERATION');
  console.log('═'.repeat(60) + '\n');

  try {
    // Step 1: Fetch feeds (last 24 hours)
    const allItems = await fetchAllFeeds();

    if (allItems.length === 0) {
      console.log('⚠️  No items found in last 24 hours. Skipping email.');
      return;
    }

    // Step 2: Filter and rank (top 15 for AI)
    const { topItems, allScored } = filterAndRankItems(allItems);

    if (topItems.length === 0) {
      console.log('⚠️  No high-signal items found. Skipping email.');
      return;
    }

    // Step 3: Extract and categorize SaaS product launches
    const productCategories = extractSaaSProducts(allItems);
    const totalProducts = (productCategories.funded?.length || 0) + 
                         (productCategories.devtools?.length || 0) + 
                         (productCategories.aiInfra?.length || 0);

    // Step 4: Get low-signal items for "Ignore" section
    const lowSignalItems = getLowSignalItems(allScored, topItems);

    // Step 5: AI summarization (with retry + fallback)
    const { summary, itemCount, fallback } = await summarizeItems(topItems, lowSignalItems, productCategories);

    // Step 6: Send newsletter email
    await sendEmail(summary, itemCount, fallback);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Newsletter completed in ${duration}s`);
    console.log(`📊 Pipeline: ${allItems.length} fetched → ${topItems.length} analyzed → ${itemCount} items delivered`);
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Fatal error in newsletter generation:');
    console.error(error);
    console.log('═'.repeat(60) + '\n');
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
  const schedule = process.env.CRON_SCHEDULE || '0 11 * * *'; // Default: 11:00 AM IST daily
  
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
