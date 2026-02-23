import OpenAI from 'openai';
import { formatPublishDate } from './utils/dateFormatter.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function callOpenAI(items, productCategories = {}, retryCount = 0) {
  const itemsList = items.map((item, idx) => 
    `${idx + 1}. [${item.source}] ${item.title}
   Published: ${formatPublishDate(item.pubDate)}
   Link: ${item.link}
   Context: ${item.description.substring(0, 200)}...
   Relevance Score: ${item.relevanceScore}/10`
  ).join('\n\n');

  let productsSection = '';
  
  if (productCategories.funded && productCategories.funded.length > 0) {
    productsSection += `\n\nFUNDED/YC SAAS (${productCategories.funded.length} items):\n\n` + 
      productCategories.funded.map((p, idx) => 
        `${idx + 1}. ${p.title}
   Source: ${p.source}
   Link: ${p.link}
   Context: ${p.description.substring(0, 200)}...`
      ).join('\n\n');
  }
  
  if (productCategories.devtools && productCategories.devtools.length > 0) {
    productsSection += `\n\nBOOTSTRAPPED/DEVTOOL SAAS (${productCategories.devtools.length} items):\n\n` + 
      productCategories.devtools.map((p, idx) => 
        `${idx + 1}. ${p.title}
   Source: ${p.source}
   Link: ${p.link}
   Context: ${p.description.substring(0, 200)}...`
      ).join('\n\n');
  }
  
  if (productCategories.aiInfra && productCategories.aiInfra.length > 0) {
    productsSection += `\n\nAI/INFRA TOOLS (${productCategories.aiInfra.length} items):\n\n` + 
      productCategories.aiInfra.map((p, idx) => 
        `${idx + 1}. ${p.title}
   Source: ${p.source}
   Link: ${p.link}
   Context: ${p.description.substring(0, 200)}...`
      ).join('\n\n');
  }

  const systemPrompt = `You are a pragmatic CTO and product strategist analyzing SaaS opportunities.

Your expertise:
- Business model analysis (monetization, moats, defensibility)
- Founder insights and strategic patterns
- Technical leverage and cost optimization
- Market timing and competitive analysis

Your style:
- Sharp, analytical, opinionated
- Focus on "why now" and "is it defensible"
- Practical monetization insights
- Risk assessment

Output requirements:
- Select EXACTLY 5 items from tech news
- Analyze ALL product launches with business lens
- Include one copyable SaaS idea derived from patterns
- Total response: under 900 words
- Be brutally honest about defensibility`;

  const userPrompt = `Analyze these ${items.length} tech items and product launches to create a strategic CTO brief.

TECH NEWS:
${itemsList}${productsSection}

Required output structure:

🎯 CTO BRIEF (2-3 lines)
[Main pattern/trend from today]

🚀 HIGH-LEVERAGE MOVES (Top 5 from tech news)
For each:
### [Title]
Source: [Source] | Published: [Date]
CTO Take: [Strategic explanation, max 80 words]
Why it matters: [Business insight]
Action: [Concrete step]

---

🔥 FUNDED / YC SAAS TO WATCH (1-2 max)
For each:
### [Title]
Source: [Source] | Published: [Date]

Problem: [What problem are they solving?]
Target Customer: [Who pays?]
Monetization Model: [Subscription/Usage/Freemium/Hybrid]
Moat Analysis: [Is it defensible? Why/why not?]
Founder Insight: [What can we learn from their approach?]

---

🧠 BOOTSTRAPPED / DEVTOOL SAAS SIGNAL (1-2 max)
For each:
### [Title]
Source: [Source]

Why developers care: [Technical value prop]
How it makes money: [Revenue model]
Copyable: [Yes/No - explain why]
Risk level: [Low/Medium/High - explain]

---

💡 AI / INFRA LEVERAGE MOVE (1 max if available)
### [Title]
Strategic impact: [How it improves SaaS building]
Integration: [How to use it]
Cost/Retention benefit: [Specific advantage]

---

🎁 COPYABLE SAAS IDEA OF THE DAY
[Derived from patterns across all news]

Problem: [Clear problem statement]
Target customer: [Specific segment]
Monetization model: [How it makes money]
Why now: [Market timing]
Risk level: [Assessment with reasoning]

---

📊 OPTIMIZATION REMINDER
[One actionable SaaS optimization tip - event tracking, retention, pricing, infra cost, or onboarding]

Keep total under 900 words. Be analytical and honest about defensibility.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2200
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

export async function summarizeItems(items, lowSignalItems = [], productCategories = {}) {
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
    const { summary, usage } = await callOpenAI(items, productCategories);
    
    console.log('✅ CTO brief generated successfully');

    return {
      summary,
      rawItems: items,
      lowSignalItems,
      productCategories,
      itemCount: items.length,
      tokenUsage: usage,
      success: true
    };

  } catch (error) {
    console.error('❌ OpenAI failed after retry:', error.message);
    console.log('📋 Generating structured fallback...');
    
    const top10 = items.slice(0, 10);
    
    let fallbackSummary = `CTO BRIEF
AI analysis temporarily unavailable. Here are today's top 10 high-signal items, ranked by strategic relevance.

TOP STRATEGIC ITEMS

${top10.map((item, idx) => 
  `${idx + 1}. ${item.title}
   Source: ${item.source} | Published: ${formatPublishDate(item.pubDate)}
   Relevance: ${item.relevanceScore}/10
   ${item.link}
`).join('\n')}`;

    // Add categorized products
    if (productCategories.funded && productCategories.funded.length > 0) {
      fallbackSummary += `\n\nFUNDED/YC SAAS

${productCategories.funded.map((p, idx) => 
  `${idx + 1}. ${p.title}
   Source: ${p.source}
   ${p.link}
`).join('\n')}`;
    }
    
    if (productCategories.devtools && productCategories.devtools.length > 0) {
      fallbackSummary += `\n\nDEVTOOL SAAS

${productCategories.devtools.map((p, idx) => 
  `${idx + 1}. ${p.title}
   Source: ${p.source}
   ${p.link}
`).join('\n')}`;
    }

    fallbackSummary += `\n\nCoverage: ${top10.length} items analyzed from last 24 hours
Relevance scores: ${top10[0]?.relevanceScore}/10 to ${top10[top10.length - 1]?.relevanceScore}/10`;

    return {
      summary: fallbackSummary,
      rawItems: top10,
      lowSignalItems,
      productCategories,
      itemCount: top10.length,
      fallback: true
    };
  }
}
