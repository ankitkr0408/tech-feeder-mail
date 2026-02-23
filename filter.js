// Strategic filtering for CTO-level intelligence

const STRATEGIC_KEYWORDS = {
  // High value (score boost: +3)
  highValue: [
    'ai', 'llm', 'gpt', 'claude', 'gemini', 'openai', 'anthropic',
    'saas', 'pricing', 'revenue', 'monetization',
    'framework', 'library', 'api', 'sdk',
    'performance', 'optimization', 'cost',
    'serverless', 'edge', 'cdn', 'hosting',
    'postgres', 'redis', 'database', 'supabase',
    'vercel', 'railway', 'render', 'fly.io',
    'observability', 'monitoring', 'analytics',
    'open source', 'oss', 'github'
  ],
  
  // Medium value (score boost: +2)
  mediumValue: [
    'developer', 'devtools', 'productivity',
    'react', 'vue', 'svelte', 'next.js', 'remix',
    'typescript', 'javascript', 'python', 'rust', 'go',
    'docker', 'kubernetes', 'deployment',
    'security', 'authentication', 'auth',
    'startup', 'funding', 'launch'
  ],
  
  // Low signal (score penalty: -5)
  lowSignal: [
    'elon musk', 'twitter drama', 'ceo fired', 'board member',
    'political', 'election', 'controversy', 'scandal',
    'celebrity', 'influencer', 'viral tweet',
    'opinion:', 'hot take:', 'unpopular opinion'
  ]
};

function calculateRelevanceScore(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  let score = 5; // Base score
  
  // Boost for high-value keywords
  STRATEGIC_KEYWORDS.highValue.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) score += 3;
  });
  
  // Boost for medium-value keywords
  STRATEGIC_KEYWORDS.mediumValue.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) score += 2;
  });
  
  // Penalty for low-signal content
  STRATEGIC_KEYWORDS.lowSignal.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) score -= 5;
  });
  
  // Boost for technical sources
  if (['GitHub Trending', 'Hacker News'].includes(item.source)) {
    score += 2;
  }
  
  // Penalty for pure opinion pieces
  if (text.includes('opinion:') || text.includes('hot take:')) {
    score -= 3;
  }
  
  return Math.max(0, Math.min(10, score)); // Clamp between 0-10
}

export function filterAndRankItems(items) {
  console.log(`🔍 Filtering ${items.length} items...`);
  
  // Score all items
  const scoredItems = items.map(item => ({
    ...item,
    relevanceScore: calculateRelevanceScore(item)
  }));
  
  // Filter: only items with score >= 6
  const filtered = scoredItems.filter(item => item.relevanceScore >= 6);
  
  console.log(`✅ ${filtered.length} items passed relevance filter (score >= 6)`);
  
  // Sort by score (descending) and recency
  const sorted = filtered.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    // If scores are equal, prefer more recent
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
  
  // Take top 15 for AI analysis
  const top15 = sorted.slice(0, 15);
  
  console.log(`📊 Top 15 items selected for AI analysis`);
  console.log(`   Score range: ${top15[0]?.relevanceScore} - ${top15[top15.length - 1]?.relevanceScore}`);
  
  return {
    topItems: top15,
    allScored: sorted
  };
}

export function getLowSignalItems(allScored, topItems) {
  // Get items that were filtered out or ranked low
  const topTitles = new Set(topItems.map(item => item.title));
  const lowSignal = allScored
    .filter(item => !topTitles.has(item.title) && item.relevanceScore < 6)
    .slice(0, 3);
  
  return lowSignal;
}
