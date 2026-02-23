# 🚀 Deployment Guide - Daily Tech Radar

## Option 1: GitHub Actions (RECOMMENDED) ⭐

### Why GitHub Actions?
- ✅ 100% FREE (2000 minutes/month free tier)
- ✅ No server maintenance
- ✅ Runs automatically in the cloud
- ✅ No need to keep your computer on
- ✅ Built-in logging and monitoring
- ✅ Takes 5 minutes to setup

### How It Works Behind the Scenes:
```
7:45 PM IST Daily
    ↓
GitHub's Cloud Server Wakes Up
    ↓
Installs Node.js & Dependencies
    ↓
Runs Your Script (index.js)
    ↓
Fetches RSS Feeds → Filters → AI Summarizes → Sends Email
    ↓
Server Shuts Down (costs you $0)
```

### Setup Steps:

#### Step 1: Create GitHub Repository
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit: Daily Tech Radar"

# Create a new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/daily-tech-radar.git
git branch -M main
git push -u origin main
```

#### Step 2: Add Secrets to GitHub
1. Go to your repo on GitHub.com
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 3 secrets:

| Secret Name | Value | How to Get |
|------------|-------|------------|
| `OPENAI_API_KEY` | `sk-proj-...` | [Get from OpenAI](https://platform.openai.com/api-keys) |
| `EMAIL` | `your-email@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `abcd efgh ijkl mnop` | [Gmail App Password](https://myaccount.google.com/apppasswords) |

**Getting Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already)
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** → **Other (Custom name)** → Type "Tech Radar"
5. Click **Generate**
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
7. Paste into GitHub secret (remove spaces)

#### Step 3: Enable GitHub Actions
1. Go to **Actions** tab in your repo
2. Click **"I understand my workflows, go ahead and enable them"**
3. Done! ✅

#### Step 4: Test It
**Manual Test:**
1. Go to **Actions** tab
2. Click **Daily Tech Radar** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait 2-3 minutes
5. Check your email! 📧

**Check Logs:**
- Click on the running workflow
- Click **send-digest** job
- See real-time logs of fetching, summarizing, and sending

### Monitoring & Maintenance:
- **Check if it ran:** Actions tab shows all runs
- **View logs:** Click any run to see detailed logs
- **Failed run?** GitHub emails you automatically
- **Cost:** $0 (uses ~2 minutes/day = 60 min/month, well under 2000 limit)

### Troubleshooting:
| Issue | Solution |
|-------|----------|
| Workflow not running | Check Actions are enabled in repo settings |
| Email not received | Verify secrets are correct (no extra spaces) |
| OpenAI error | Check API key and billing setup |
| Wrong time | Workflow uses UTC, already converted to 7:45 PM IST |

---

## Option 2: Local Machine (Your Computer)

### When to Use:
- You want full control
- Your computer is always on
- You're testing/developing

### How It Works:
```
Your Computer (Always On)
    ↓
Node.js Cron Job Runs at 7:45 PM
    ↓
Fetches → Summarizes → Emails
    ↓
Repeats Daily
```

### Setup Steps:

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

#### Step 3: Test Run
```bash
npm start -- --test
```

#### Step 4: Run Continuously
```bash
npm start
```

**Keep it running 24/7:**

**Windows:**
```bash
# Option A: Keep terminal open (simple but not ideal)
npm start

# Option B: Use PM2 (recommended)
npm install -g pm2
pm2 start index.js --name tech-radar
pm2 startup  # Auto-start on boot
pm2 save
```

**Mac/Linux:**
```bash
# Option A: Use PM2
npm install -g pm2
pm2 start index.js --name tech-radar
pm2 startup
pm2 save

# Option B: Use systemd (Linux)
# Create /etc/systemd/system/tech-radar.service
# (Advanced - Google for tutorial)
```

### Pros & Cons:
✅ Full control and instant testing
✅ No external dependencies
❌ Computer must stay on 24/7
❌ Uses electricity
❌ Stops if computer restarts

---

## Option 3: Cloud Hosting (Free Tier)

### When to Use:
- GitHub Actions doesn't work for you
- You want a "real" server
- You might add a web dashboard later

### Platform Options:

#### A) Render.com (Easiest)

**How It Works:**
```
Render's Server (Always On)
    ↓
Runs Your Node.js App 24/7
    ↓
Cron Job Triggers at 7:45 PM IST
    ↓
Sends Email
```

**Setup:**
1. Create account at [render.com](https://render.com)
2. Click **New** → **Background Worker**
3. Connect your GitHub repo
4. Set environment variables:
   - `OPENAI_API_KEY`
   - `EMAIL`
   - `EMAIL_PASS`
5. Build command: `npm install`
6. Start command: `npm start`
7. Deploy!

**Free Tier:**
- 750 hours/month free
- Enough for 24/7 operation
- Auto-sleeps after 15 min inactivity (but cron keeps it awake)

#### B) Railway.app

**Setup:**
1. Create account at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Select your repo
4. Add environment variables
5. Railway auto-detects Node.js
6. Deploy!

**Free Tier:**
- $5 free credit/month
- ~500 hours free
- More than enough for this app

#### C) Fly.io

**Setup:**
```bash
# Install Fly CLI
# Windows: iwr https://fly.io/install.ps1 -useb | iex
# Mac: brew install flyctl

# Login and deploy
fly auth login
fly launch
fly secrets set OPENAI_API_KEY=your-key
fly secrets set EMAIL=your-email
fly secrets set EMAIL_PASS=your-pass
fly deploy
```

**Free Tier:**
- 3 shared VMs free
- 160GB bandwidth/month

### Pros & Cons:
✅ Always running in the cloud
✅ Professional setup
✅ Can add web dashboard later
❌ Slightly more complex than GitHub Actions
❌ May need credit card (even for free tier)
❌ Free tier limits

---

## 📊 Comparison Table

| Feature | GitHub Actions | Local Machine | Cloud Hosting |
|---------|---------------|---------------|---------------|
| **Cost** | FREE | Electricity | FREE (with limits) |
| **Setup Time** | 5 minutes | 2 minutes | 10 minutes |
| **Maintenance** | Zero | Medium | Low |
| **Reliability** | Very High | Depends on PC | High |
| **Computer On?** | No | Yes (24/7) | No |
| **Best For** | Most users | Developers | Advanced users |

---

## 🎯 My Recommendation

**For You: Use GitHub Actions**

Why?
1. You're just starting → Keep it simple
2. It's 100% free forever
3. Zero maintenance
4. Professional and reliable
5. Takes 5 minutes to setup
6. You can always switch later

**Workflow:**
```
Day 1: Setup GitHub Actions (5 min)
    ↓
Day 2-365: Do nothing, get emails daily
    ↓
Cost: $0
Effort: 0
```

---

## 🔄 Migration Path

Start with GitHub Actions, then:

```
GitHub Actions (Start here)
    ↓
    ├─→ Stay on GitHub Actions (most users)
    ├─→ Move to Local (if you want more control)
    └─→ Move to Cloud (if you add web dashboard)
```

---

## 🆘 Need Help?

**GitHub Actions Issues:**
- Check Actions tab for error logs
- Verify secrets are set correctly
- Ensure workflow file is in `.github/workflows/`

**Local Machine Issues:**
- Make sure `.env` file exists
- Check Node.js version: `node --version` (need 18+)
- Test with: `npm start -- --test`

**Cloud Hosting Issues:**
- Check platform logs
- Verify environment variables
- Ensure build succeeds

---

## 📈 Next Steps After Deployment

1. **Week 1:** Monitor emails, check if content is relevant
2. **Week 2:** Adjust keywords in `fetchFeeds.js` if needed
3. **Week 3:** Customize AI prompt in `summarize.js` for better summaries
4. **Month 2:** Consider adding Telegram/Slack integration
5. **Month 3:** Add web dashboard to view history

---

**Ready to deploy? Start with GitHub Actions! 🚀**
