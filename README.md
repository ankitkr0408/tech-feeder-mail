# 🧠 Daily Tech Radar

Automated daily tech news aggregator that fetches, filters, and summarizes relevant developer/tech content from multiple RSS sources, then emails you a curated digest.

## ✨ Features

- 📡 Fetches from 5+ quality tech sources (Hacker News, Product Hunt, GitHub Trending, Dev.to, TechCrunch)
- 🎯 Smart filtering with 50+ tech keywords (AI, frameworks, tools, languages, etc.)
- 🤖 AI-powered summarization using OpenAI GPT-4o-mini
- 📧 Clean daily email digest
- ⏰ Automated scheduling (local cron or GitHub Actions)
- 🛡️ Robust error handling
- 💰 Cost-effective (< $5/month)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- Gmail account with App Password
- OpenAI API key

### Installation

1. Clone and install:
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

#### Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate password for "Mail" → "Other (Custom name)"
5. Copy the 16-character password to `.env`

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy to `.env`

## 🧪 Testing

Run once to test:
```bash
npm start -- --test
```

Or:
```bash
node index.js --test
```

## 🏃 Running

### Option 1: Local (Continuous)

Run continuously with cron scheduling:
```bash
npm start
```

Runs daily at 8 AM (configurable in `.env`).

### Option 2: GitHub Actions (Recommended)

1. Push code to GitHub
2. Add repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add: `OPENAI_API_KEY`, `EMAIL`, `EMAIL_PASS`
3. Enable Actions in your repo
4. Workflow runs automatically at 8 AM UTC daily

Manual trigger:
- Go to Actions tab → Daily Tech Radar → Run workflow

## ⚙️ Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...
EMAIL=you@gmail.com
EMAIL_PASS=your-app-password

# Optional
CRON_SCHEDULE=0 8 * * *           # Default: 8 AM daily
TZ=America/New_York                # Your timezone
RUN_ON_STARTUP=true                # Run immediately on start
```

### Customizing Keywords

Edit `KEYWORDS` array in `fetchFeeds.js` to adjust filtering.

### Adding RSS Feeds

Edit `RSS_FEEDS` array in `fetchFeeds.js`:

```javascript
{
  name: 'Your Source',
  url: 'https://example.com/feed',
  limit: 10
}
```

## 📊 Cost Estimate

- OpenAI API (gpt-4o-mini): ~$0.10-0.50/day
- Gmail: Free
- GitHub Actions: Free (2000 min/month)

Total: < $5/month

## 🐛 Troubleshooting

### Email not sending
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled
- Try generating new App Password

### No items found
- Check internet connection
- RSS feeds may be temporarily down
- Verify keywords match your interests

### OpenAI errors
- Check API key validity
- Verify billing is set up
- Check rate limits

### GitHub Actions not running
- Verify secrets are set correctly
- Check Actions are enabled
- Review workflow logs

## 📁 Project Structure

```
daily-tech-radar/
├── index.js              # Main entry point & scheduler
├── fetchFeeds.js         # RSS fetching & filtering
├── summarize.js          # OpenAI summarization
├── sendEmail.js          # Email delivery
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .github/
│   └── workflows/
│       └── daily-digest.yml  # GitHub Actions workflow
└── README.md
```

## 🔒 Security

- Never commit `.env` file
- Use App Passwords, not main Gmail password
- Rotate API keys periodically
- Keep dependencies updated: `npm audit fix`

## 🚀 Deployment Options

### 1. Local Machine
```bash
npm start
# Keep terminal running or use PM2
```

### 2. GitHub Actions (Recommended)
- Zero infrastructure
- Free tier sufficient
- Automatic execution

### 3. Cloud Platforms

#### Render
```bash
# Add as background worker
# Set environment variables in dashboard
```

#### Railway
```bash
railway up
# Configure environment variables
```

## 📈 Future Enhancements

- [ ] Relevance scoring algorithm
- [ ] Telegram bot integration
- [ ] Slack webhook support
- [ ] Weekly digest mode
- [ ] MongoDB history storage
- [ ] Web dashboard
- [ ] Custom email templates
- [ ] Multiple recipient support

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📄 License

MIT

## 🙏 Credits

Built with:
- [OpenAI](https://openai.com)
- [rss-parser](https://github.com/rbren/rss-parser)
- [Nodemailer](https://nodemailer.com)
- [node-cron](https://github.com/node-cron/node-cron)

---

Made with ☕ for staying current in tech
