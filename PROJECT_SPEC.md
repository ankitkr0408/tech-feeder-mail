# 🧠 Daily Tech Radar – Personal Automation System

## 🎯 Goal

Build a simple automated system that:

1. Fetches daily tech updates from free RSS sources
2. Filters relevant developer/AI/SaaS content
3. Summarizes them using OpenAI API
4. Sends one clean email daily
5. Runs automatically via cron or GitHub Actions

This is for personal use only.

---

# 🏗 Tech Stack

- Node.js (latest LTS)
- OpenAI API (gpt-4o-mini)
- RSS Parser
- Nodemailer (Gmail SMTP)
- node-cron (local) OR GitHub Actions (cloud)
- dotenv for environment variables

No database required. No frontend required.

---

# 📂 Folder Structure

```
tech-radar/
│
├── index.js
├── fetchFeeds.js
├── summarize.js
├── sendEmail.js
├── package.json
├── .env.example
└── README.md
```

---

# 🔌 Dependencies

Install:

```bash
npm init -y
npm install axios rss-parser nodemailer node-cron openai dotenv
```

---

# 🌐 Data Sources (Free RSS)

Use:

- Hacker News: https://hnrss.org/frontpage
- Product Hunt: https://www.producthunt.com/feed
- GitHub Trending: scrape or use community RSS

Fetch top 5 items from each.

---

# 🔎 Filtering Rules

Only keep items containing keywords:

- AI
- SaaS
- API
- open source
- developer
- productivity
- framework
- tool

Filtering should be case-insensitive.

---

# 🤖 OpenAI Summarization

Use model: gpt-4o-mini

Prompt structure:

System: "You are a tech scout for a SaaS developer. Extract only high-value tools or ideas. Be concise and actionable."

User: Pass list of titles + links.

Return format:

```
1. Tool/News Title
   - What it does
   - Why it matters
   - Practical use case
```

Keep summaries short and structured.

---

# 📧 Email Format

Subject: 🧠 Daily Tech Radar – {Date}

Body:

Section 1: Top Tools
Section 2: Worth Exploring
Section 3: Ignore Today (optional)

Plain text format is fine.

Send email to self only.

---

# 🔐 Environment Variables (.env)

```
OPENAI_API_KEY=
EMAIL=
EMAIL_PASS=
```

EMAIL_PASS should be Gmail App Password.

---

# ⏰ Automation

Option 1: Use node-cron: Run daily at 8:00 AM.

Option 2: Use GitHub Actions with a scheduled workflow (recommended).

---

# 🧪 Error Handling

- If RSS fails → log error but continue
- If OpenAI fails → send raw titles
- If email fails → log error

App must not crash silently.

---

# 🚀 Deployment Options

- Local machine with cron
- Render free tier
- Railway free tier
- GitHub Actions (preferred)

---

# 📈 Future Improvements (Optional)

- Relevance scoring
- Telegram bot integration
- Slack integration
- Weekly digest mode
- Store history in MongoDB

---

# 🧠 Success Criteria

- One email per day
- Relevant content only
- Cost under $5/month
- Zero manual work after setup

End of specification.
