import OpenAI from 'openai';
import { formatPublishDate } from './utils/dateFormatter.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function callOpenAI(items, retryCount = 0) {
  const itemsList = items.map((item, idx) => 
    `${idx + 1}. [${item.source}] ${item.title}
   Published: ${formatPublishDate(item.pubDate)}
   Link: ${item.link}
   Context: ${item.description.substring(0, 200)}...
   Relevance Score: ${item.relevanceScore}/10`
  ).join('\n\n');

  const systemPrompt = `You are a pragmatic CTO briefing a product engineer building SaaS/web applications.

Your style:
- Concise and strategic
- Focus on business leverage, not hype
- Practical actions over theory
- Sharp, opinionated takes

Your audience:
- SaaS founders
- Product engineers
- Web/app builders
- Technical decision-makers

Output requirements:
- Select EXACTLY 5 items (highest strategic value)
- Total response: under 600 words
- No fluff, no rewrites of headlines
- Focus on: why it matters + what to do`;

  const userPrompt = `Analyze these ${items.length} pre-filtered tech items and create a CTO intelligence brief.

${itemsList}

Required output structure:

🎯 CTO BRIEF (2-3 lines)
[Summarize the main pattern/trend from today's tech movement]

🚀 HIGH-LEVERAGE MOVES (Top 5 Only)

For each of the 5 items:
### [Title]
Source: [Source Name]
Published: [Date]

CTO Take:
[Strategic explanation in max 80 words - why this matters for SaaS builders]

Why it matters:
[One business/product insight]

Action:
[One concrete actionable step]

---

🧠 SAAS OPPORTUNITY SIGNALS
[2-3 bullet points about patterns, cost signals, tooling gaps, or opportunities]

Keep total under 600 words. Be sharp and practical.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const summary = completion.choices[0].message.content;
    const usage = completion.usage;
    
    console.log(`📊 Token Usage:`);
    console.log(`   Input: ${usage.prompt_tokens} tokens`);
    console.log(`   Output: ${usage.completion_tokens} tokens`);
    console.log(`   Total: ${usage.total_tokens} tokens`);
    console.log(`   Cost: ~$${((usage.prompt_tokens * 0.15 + usage.completion_tokens * 0.60) / 1000000).toFixed(4)}`);
    
    return { summary, usage, success: true };

  } catch (error) {
    if (retryCount < 1) {
      console.log(`⚠️  OpenAI failed, retrying... (attempt ${retryCount + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
      return callOpenAI(items, retryCount + 1);
    }
    
    throw error;
  }
}

export async function summarizeItems(items, lowSignalItems = []) {
  if (!items || items.length === 0) {
    console.log('⚠️  No items to summarize');
    return {
      summary: 'No high-signal tech news found in the last 24 hours.',
      rawItems: [],
      fallback: true
    };
  }

  console.log(`🤖 Analyzing ${items.length} high-signal items with OpenAI...`);

  try {
    const { summary, usage } = await callOpenAI(items);
    
    console.log('✅ CTO brief generated successfully');

    return {
      summary,
      rawItems: items,
      lowSignalItems,
      itemCount: items.length,
      tokenUsage: usage,
      success: true
    };

  } catch (error) {
    console.error('❌ OpenAI failed after retry:', error.message);
    console.log('📋 Generating structured fallback...');
    
    // Structured fallback - top 10 items, clean format
    const top10 = items.slice(0, 10);
    
    const fallbackSummary = `🎯 CTO BRIEF
AI analysis temporarily unavailable. Here are today's top 10 high-signal items, ranked by strategic relevance.

🚀 TOP STRATEGIC ITEMS

${top10.map((item, idx) => 
  `${idx + 1}. ${item.title}
   Source: ${item.source} | Published: ${formatPublishDate(item.pubDate)}
   Relevance: ${item.relevanceScore}/10
   ${item.link}
`).join('\n')}

📊 Coverage: ${top10.length} items analyzed from last 24 hours
🔍 Relevance scores: ${top10[0]?.relevanceScore}/10 to ${top10[top10.length - 1]?.relevanceScore}/10`;

    return {
      summary: fallbackSummary,
      rawItems: top10,
      lowSignalItems,
      itemCount: top10.length,
      fallback: true
    };
  }
}
