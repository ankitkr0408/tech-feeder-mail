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

  const systemPrompt = `You are a tech newsletter writer creating engaging, story-driven content for founders and developers.

Your style:
- Conversational and engaging, like Failory or TLDR newsletters
- Tell stories, not just facts - explain WHY things matter
- Use clear sections with descriptive headers
- Include context and background for each story
- Be analytical but accessible
- Focus on practical takeaways

Output requirements:
- Write in newsletter format with clear sections
- Pick 3-5 most interesting stories from tech news
- Cover product launches with business context
- Include links inline naturally
- Total response: 800-1000 words
- Make it readable and engaging`;

  const userPrompt = `Create an engaging tech newsletter from today's items. Write like you're explaining interesting tech news to a smart friend.

TECH NEWS:
${itemsList}${productsSection}

Required newsletter structure:

Hey - Welcome to today's edition.

[Write a 2-3 sentence intro about the main theme or pattern you're seeing today]

## This Week In Tech

[Pick 3-5 most interesting stories from tech news. For each story:]

### [Compelling Title]

[Write 2-4 paragraphs telling the story. Include:
- What happened and why it matters
- Background context if needed
- Business implications
- What you can learn from it
- Link to source naturally in the text]

## New Products Worth Watching

[Cover interesting product launches. Group by category if needed:]

### [Product Name]

[Write 2-3 paragraphs covering:
- What problem they're solving
- Who it's for and how they make money
- Why it's interesting or defensible (or not)
- What founders can learn
- Include link naturally]

## The Takeaway

[End with 2-3 sentences summarizing the key insight or pattern from today's news]

---

Remember:
- Write conversationally, not like a robot
- Tell stories, explain context
- Make it engaging and easy to read
- Include links naturally in sentences like "Company X just announced..." with the link on "announced"
- Keep paragraphs short (2-4 sentences max)
- Use clear section headers
- Total length: 800-1000 words`;

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
      summary: 'No interesting tech news found in the last 24 hours.',
      rawItems: [],
      fallback: true
    };
  }

  console.log(`🤖 Creating newsletter from ${items.length} items with OpenAI...`);

  try {
    const { summary, usage } = await callOpenAI(items, productCategories);
    
    console.log('✅ Newsletter generated successfully');

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
    
    let fallbackSummary = `Hey - Welcome to today's edition.

AI analysis is temporarily unavailable, but here are today's top stories ranked by relevance.

## This Week In Tech

${top10.map((item, idx) => 
  `### ${item.title}

Source: ${item.source} | Published: ${formatPublishDate(item.pubDate)}
Relevance: ${item.relevanceScore}/10

${item.link}
`).join('\n')}`;

    // Add categorized products
    if (productCategories.funded && productCategories.funded.length > 0) {
      fallbackSummary += `\n\n## New Products Worth Watching

${productCategories.funded.map((p, idx) => 
  `### ${p.title}

Source: ${p.source}
${p.link}
`).join('\n')}`;
    }
    
    if (productCategories.devtools && productCategories.devtools.length > 0) {
      fallbackSummary += `\n\n## Developer Tools

${productCategories.devtools.map((p, idx) => 
  `### ${p.title}

Source: ${p.source}
${p.link}
`).join('\n')}`;
    }

    fallbackSummary += `\n\n---

Coverage: ${top10.length} items from the last 24 hours`;

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
