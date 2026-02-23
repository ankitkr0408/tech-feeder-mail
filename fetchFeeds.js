import Parser from 'rss-parser';
import axios from 'axios';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; TechRadar/1.0)'
  }
});

// Enhanced keyword list for comprehensive tech coverage
const KEYWORDS = [
  // AI & ML
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'chatgpt',
  'neural', 'deep learning', 'transformer', 'diffusion', 'stable diffusion',
  
  // Development
  'developer', 'programming', 'code', 'coding', 'software', 'framework', 'library',
  'api', 'sdk', 'cli', 'tool', 'devtools', 'ide', 'vscode', 'github',
  
  // Languages & Frameworks
  'javascript', 'typescript', 'python', 'rust', 'go', 'java', 'react', 'vue',
  'angular', 'svelte', 'node', 'deno', 'bun', 'next.js', 'remix',
  
  // Cloud & Infrastructure
  'cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'container', 'serverless',
  'edge', 'cdn', 'deployment', 'ci/cd', 'devops',
  
  // SaaS & Products
  'saas', 'startup', 'product', 'launch', 'productivity', 'automation',
  'no-code', 'low-code', 'platform',
  
  // Open Source
  'open source', 'opensource', 'oss', 'github', 'gitlab',
  
  // Web & Mobile
  'web', 'mobile', 'app', 'pwa', 'responsive', 'frontend', 'backend', 'fullstack',
  
  // Data & Database
  'database', 'sql', 'nosql', 'postgres', 'mongodb', 'redis', 'data', 'analytics',
  
  // Security & Performance
  'security', 'authentication', 'encryption', 'performance', 'optimization',
  
  // Emerging Tech
  'blockchain', 'web3', 'crypto', 'quantum', 'iot', 'ar', 'vr', 'metaverse'
];

const RSS_FEEDS = [
  {
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    limit: 10
  },
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/feed',
    limit: 10
  },
  {
    name: 'GitHub Trending',
    url: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
    limit: 10
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/feed',
    limit: 10
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    limit: 10
  }
];

function matchesKeywords(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

function filterRelevantItems(items) {
  return items.filter(item => {
    const title = item.title || '';
    const description = item.contentSnippet || item.content || '';
    const combined = `${title} ${description}`;
    return matchesKeywords(combined);
  });
}

async function fetchSingleFeed(feed) {
  try {
    console.log(`📡 Fetching ${feed.name}...`);
    const feedData = await parser.parseURL(feed.url);
    
    const items = feedData.items.slice(0, feed.limit).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate || item.isoDate,
      source: feed.name,
      description: item.contentSnippet || item.content || ''
    }));

    const filtered = filterRelevantItems(items);
    console.log(`✅ ${feed.name}: ${filtered.length}/${items.length} relevant items`);
    
    return filtered;
  } catch (error) {
    console.error(`❌ Error fetching ${feed.name}:`, error.message);
    return [];
  }
}

export async function fetchAllFeeds() {
  console.log('🚀 Starting feed fetch...\n');
  
  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchSingleFeed(feed))
  );

  const allItems = results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);

  // Remove duplicates based on title similarity
  const uniqueItems = [];
  const seenTitles = new Set();

  for (const item of allItems) {
    const normalizedTitle = item.title.toLowerCase().trim();
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueItems.push(item);
    }
  }

  console.log(`\n📊 Total unique relevant items: ${uniqueItems.length}`);
  return uniqueItems;
}
