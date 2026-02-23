# Daily Tech Radar - CTO Intelligence Brief

Production-grade automated intelligence system that delivers strategic tech insights for SaaS founders and product engineers.

## Features

- **Strategic Filtering**: Relevance scoring (0-10) filters noise, analyzes only top 15 items
- **CTO-Style Analysis**: Opinionated, actionable intelligence (not generic news summaries)
- **Smart Pipeline**: Fetches 50+ items, filters to 15, AI selects top 5 high-leverage items
- **24-Hour Coverage**: Only analyzes items from last 24 hours with IST timestamps
- **Bulletproof Reliability**: Auto-retry with structured fallback (never sends "AI failed" messages)
- **Professional Email**: HTML and plain text formats, under 700 words, mobile-optimized
- **Product Launches**: Automatically extracts and highlights top 5 SaaS product launches
- **Cost-Effective**: Approximately ₹3.50/month (~4,200 tokens per email)
- 🔄 **Bulletproof Reliability**: Auto-retry + structured fallback (never sends "AI failed" messages)
- 📧 **Professional Email**: HTML + plain text, under 600 words, mobile-optimized
- � **Cost-Effective**: ~₹2.25/month (~3,000 tokens per email)

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- Gmail account with App Password
- OpenAI API key

### Installation

1. Clone and install dependencies:
```bash
git clone <your-repo>
cd daily-tech-radar
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials:
```env
OPENAI_API_KEY=sk-your-key-here
EMAIL=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Getting Credentials

**Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate password for "Mail" and "Other (Custom name)"
5. Copy the 16-character password to `.env`

**OpenAI API Key:**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy to `.env`

## Testing

Run once to test the complete pipeline:
```bash
npm start -- --test
```

Or:
```bash
node index.js --test
```

## Running

### Option 1: Local (Continuous)

Run continuously with cron scheduling:
```bash
npm start
```

Runs daily at 11:00 AM IST (configurable in `.env`).

### Option 2: GitHub Actions (Recommended)

1. Push code to GitHub
2. Add repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add: `OPENAI_API_KEY`, `EMAIL`, `EMAIL_PASS`
3. Enable Actions in your repository
4. Workflow runs automatically at 11:00 AM IST daily

Manual trigger:
- Go to Actions tab → Daily Tech Radar → Run workflow
- Note: Only repository owner can manually trigger (security feature)

## Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...
EMAIL=you@gmail.com
EMAIL_PASS=your-app-password

# Optional
CRON_SCHEDULE=0 11 * * *          # Default: 11:00 AM IST daily
TZ=Asia/Kolkata                    # Timezone (default: IST)
RUN_ON_STARTUP=true                # Run immediately on start
```

### Customizing Filtering

Edit relevance scoring in `filter.js`:

```javascript
const STRATEGIC_KEYWORDS = {
  highValue: [...],    // +3 score boost
  mediumValue: [...],  // +2 score boost
  lowSignal: [...]     // -5 penalty
}
```

### Adding RSS Feeds

Edit `RSS_FEEDS` array in `fetchFeeds.js`:

```javascript
{
  name: 'Your Source',
  url: 'https://example.com/feed',
  limit: 10
}
```

### Email Output Format

```
CTO BRIEF (2-3 lines)
[Strategic pattern summary]

HIGH-LEVERAGE MOVES (Top 5 tech news)
[Title]
Source: [Source] | Published: [Date]
CTO Take: [Strategic explanation, max 80 words]
Why it matters: [Business insight]
Action: [Concrete actionable step]

FUNDED / YC SAAS TO WATCH (1-2 max)
[Title]
Problem: [What problem are they solving?]
Target Customer: [Who pays?]
Monetization Model: [Subscription/Usage/Freemium/Hybrid]
Moat Analysis: [Is it defensible?]
Founder Insight: [What can we learn?]

BOOTSTRAPPED / DEVTOOL SAAS SIGNAL (1-2 max)
[Title]
Why developers care: [Technical value]
How it makes money: [Revenue model]
Copyable: [Yes/No with reasoning]
Risk level: [Low/Medium/High with explanation]

AI / INFRA LEVERAGE MOVE (1 max)
[Title]
Strategic impact: [How it improves SaaS building]
Integration: [How to use it]
Cost/Retention benefit: [Specific advantage]

COPYABLE SAAS IDEA OF THE DAY
Problem: [Clear problem statement]
Target customer: [Specific segment]
Monetization model: [How it makes money]
Why now: [Market timing]
Risk level: [Assessment with reasoning]

OPTIMIZATION REMINDER
[One actionable SaaS optimization tip]
```

## Cost Estimate

**Per Email:**
- Tokens: ~4,200 (2,600 input + 1,600 output)
- Cost: ~$0.0014 (₹0.12)

**Monthly (30 emails):**
- OpenAI API: ~$0.042 (₹3.50)
- Gmail: Free
- GitHub Actions: Free (2000 minutes/month)

**Annual: ~₹42**

## Troubleshooting

**Email not sending:**
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Google account
- Try generating new App Password

**No items found:**
- Check internet connection
- RSS feeds may be temporarily down
- Verify 24-hour time window has content

**OpenAI errors:**
- Check API key validity
- Verify billing is set up on OpenAI account
- Check rate limits and quotas

**GitHub Actions not running:**
- Verify secrets are set correctly
- Check Actions are enabled in repository settings
- Review workflow logs for detailed errors
- Ensure you are the repository owner (security restriction)

## Project Structure

```
daily-tech-radar/
├── index.js                    # Main orchestrator and scheduler
├── fetchFeeds.js               # RSS fetching (last 24h only)
├── filter.js                   # Strategic relevance scoring and ranking
├── extractProducts.js          # SaaS product launch extraction
├── summarize.js                # AI analysis with retry and fallback
├── sendEmail.js                # Professional email delivery
├── utils/
│   └── dateFormatter.js        # IST timestamp utilities
├── package.json
├── .env.example
├── .github/workflows/
│   └── daily-digest.yml        # GitHub Actions (11:00 AM IST)
├── SECURITY.md                 # Security documentation
└── README.md
```

## 🔒 Security

- Never commit `.env` file
- Use App Passwords, not main Gmail password
- Rotate API keys periodically
- Keep dependencies updated: `npm audit fix`

## Deployment Options

### 1. GitHub Actions (Recommended)
- Zero infrastructure required
- Free tier sufficient for daily runs
- Automatic execution at scheduled time
- Built-in logging and monitoring

### 2. Local Machine
```bash
npm start
# Keep terminal running or use PM2 for process management
```

### 3. Cloud Platforms

**Render:**
- Deploy as background worker
- Set environment variables in dashboard
- Free tier: 750 hours/month

**Railway:**
```bash
railway up
# Configure environment variables in dashboard
```
- Free tier: $5 credit/month

## Security

The workflow is protected with owner-only manual triggers. See [SECURITY.md](SECURITY.md) for complete security documentation including:
- Workflow protection mechanisms
- Secret management best practices
- Repository visibility options
- Incident response procedures

## License

MIT

## Credits

Built with:
- [OpenAI GPT-4o-mini](https://openai.com)
- [rss-parser](https://github.com/rbren/rss-parser)
- [Nodemailer](https://nodemailer.com)
- [node-cron](https://github.com/node-cron/node-cron)

---

Production-grade intelligence automation for technical decision-makers.
