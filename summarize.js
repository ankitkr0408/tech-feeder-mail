import OpenAI from 'openai';
import { formatPublishDate } from './utils/dateFormatter.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function callOpenAI(items, products = [], retryCount = 0) {
  const itemsList = items.map((item, idx) => 
    `${idx + 1}. [${item.source}] ${item.title}
   Published: ${formatPublishDate(item.pubDate)}
   Link: ${item.link}
   Context: ${item.description.substring(0, 200)}...
   Relevance Score: ${item.relevanceScore}/10`
  ).join('\n\n');

  let productsSection = '';
  if (products && products.length > 0) {
    productsSection = `\n\nNEW SAAS PRODUCT LAUNCHES (${products.length} items):\n\n` + 
      products.map((product, idx) => 
        `${idx + 1}. ${product.title}
   Source: ${product.source}
   Link: ${product.link}
   Context: ${product.description.substring(0, 150)}...`
      ).join('\n\n');
  }

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
- Select EXACTLY 5 items from tech news (highest strategic value)
- Include ALL product launches in a separate section
- Total response: under 700 words
- No fluff, no rewrites of headlines
- Focus on: why it matters + what to do`;

  const userPrompt = `Analyze these ${items.length} pre-filtered tech items and ${products.length} product launches to create a CTO intelligence brief.

TECH NEWS:
${itemsList}${productsSection}

Required output structure:

🎯 CTO BRIEF (2-3 lines)
[Summarize the main pattern/trend from today's tech movement]

🚀 HIGH-LEVERAGE MOVES (Top 5 Only from tech news)

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

🎁 NEW SAAS PRODUCT LAUNCHES

For each product launch:
### [Product Name]
Source: [Source]
[One-line description of what it does and why it's interesting for SaaS builders]
Link: [URL]

---

🧠 SAAS OPPORTUNITY SIGNALS
[2-3 bullet points about patterns, cost signals, tooling gaps, or opportunities]

Keep total under 700 words. Be sharp and practical.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1800
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
      return callOpenAI(items, products, retryCount + 1);
    }
    
    throw error;
  }
}

export async function summarizeItems(items, lowSignalItems = [], products = []) {
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
    const { summary, usage } = await callOpenAI(items, products);
    
    console.log('✅ CTO brief generated successfully');

    return {
      summary,
      rawItems: items,
      lowSignalItems,
      products,
      itemCount: items.length,
      tokenUsage: usage,
      success: true
    };

  } catch (error) {
    console.error('❌ OpenAI failed after retry:', error.message);
    console.log('📋 Generating structured fallback...');
    
    // Structured fallback - top 10 items, clean format
    const top10 = items.slice(0, 10);
    
    let fallbackSummary = `🎯 CTO BRIEF
AI analysis temporarily unavailable. Here are today's top 10 high-signal items, ranked by strategic relevance.

🚀 TOP STRATEGIC ITEMS

${top10.map((item, idx) => 
  `${idx + 1}. ${item.title}
   Source: ${item.source} | Published: ${formatPublishDate(item.pubDate)}
   Relevance: ${item.relevanceScore}/10
   ${item.link}
`).join('\n')}`;

    // Add products section if available
    if (products && products.length > 0) {
      fallbackSummary += `\n\n🎁 NEW SAAS PRODUCT LAUNCHES

${products.map((product, idx) => 
  `${idx + 1}. ${product.title}
   Source: ${product.source}
   ${product.link}
`).join('\n')}`;
    }

    fallbackSummary += `\n\n📊 Coverage: ${top10.length} items analyzed from last 24 hours
🔍 Relevance scores: ${top10[0]?.relevanceScore}/10 to ${top10[top10.length - 1]?.relevanceScore}/10`;

    return {
      summary: fallbackSummary,
      rawItems: top10,
      lowSignalItems,
      products,
      itemCount: top10.length,
      fallback: true
    };
  }
}
