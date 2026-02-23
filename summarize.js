import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function summarizeItems(items) {
  if (!items || items.length === 0) {
    console.log('⚠️  No items to summarize');
    return {
      summary: 'No relevant tech news found today.',
      rawItems: []
    };
  }

  console.log(`🤖 Summarizing ${items.length} items with OpenAI...`);

  // Prepare items for AI
  const itemsList = items.map((item, idx) => 
    `${idx + 1}. [${item.source}] ${item.title}\n   Link: ${item.link}\n   Preview: ${item.description.substring(0, 150)}...`
  ).join('\n\n');

  const systemPrompt = `You are an expert tech scout and curator for software developers and tech entrepreneurs.

Your mission: Analyze tech news and identify HIGH-VALUE content that matters for:
- Software developers (all levels)
- SaaS builders and founders
- Tech enthusiasts staying current

Focus on:
✅ New tools, libraries, frameworks
✅ AI/ML breakthroughs and applications
✅ Developer productivity tools
✅ Open source projects worth knowing
✅ API launches and integrations
✅ Platform updates (GitHub, AWS, etc.)
✅ Programming language updates
✅ Security vulnerabilities and fixes
✅ Performance optimization techniques
✅ Emerging tech trends

Categorize into 3 sections:
1. 🔥 MUST KNOW - Critical updates, game-changing tools
2. 💡 WORTH EXPLORING - Interesting but not urgent
3. 📌 QUICK MENTIONS - Brief awareness items

For each item provide:
- Clear title
- What it does (1 sentence)
- Why it matters (1 sentence)
- Practical use case or action item

Be concise, actionable, and skip hype. Focus on practical value.`;

  const userPrompt = `Analyze and categorize these tech items:\n\n${itemsList}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const summary = completion.choices[0].message.content;
    console.log('✅ Summary generated successfully');

    return {
      summary,
      rawItems: items,
      itemCount: items.length
    };

  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    
    // Fallback: return raw items formatted
    const fallbackSummary = `⚠️ AI summarization unavailable. Here are today's ${items.length} relevant items:\n\n` +
      items.map((item, idx) => 
        `${idx + 1}. ${item.title}\n   Source: ${item.source}\n   ${item.link}\n`
      ).join('\n');

    return {
      summary: fallbackSummary,
      rawItems: items,
      itemCount: items.length,
      error: true
    };
  }
}
