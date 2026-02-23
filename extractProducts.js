// Extract and categorize SaaS product launches

export function extractSaaSProducts(items) {
  console.log('🚀 Extracting SaaS product launches...');
  
  const SAAS_INDICATORS = [
    'launch', 'launched', 'introducing', 'announce', 'released',
    'new tool', 'new platform', 'new service', 'new app',
    'saas', 'platform', 'tool', 'app', 'service',
    'free tier', 'pricing', 'beta', 'waitlist'
  ];
  
  const FUNDED_INDICATORS = [
    'yc', 'y combinator', 'funded', 'raised', 'series', 'seed',
    'venture', 'investment', 'backed by'
  ];
  
  const DEVTOOL_INDICATORS = [
    'developer', 'devtool', 'api', 'sdk', 'cli', 'framework',
    'library', 'open source', 'github', 'code', 'deployment'
  ];
  
  const AI_INFRA_INDICATORS = [
    'ai', 'llm', 'gpt', 'ml', 'machine learning', 'neural',
    'infrastructure', 'hosting', 'serverless', 'edge', 'cdn'
  ];
  
  const PRODUCT_SOURCES = ['Product Hunt', 'Hacker News', 'TechCrunch'];
  
  // Filter for product launches
  const products = items.filter(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    const isProductSource = PRODUCT_SOURCES.includes(item.source);
    const hasLaunchIndicator = SAAS_INDICATORS.some(indicator => 
      text.includes(indicator.toLowerCase())
    );
    
    const isNotProduct = 
      text.includes('opinion:') ||
      text.includes('essay:') ||
      text.includes('discussion:') ||
      text.includes('ask hn:') ||
      text.includes('show hn: i wrote') ||
      text.includes('blog post');
    
    return (isProductSource || hasLaunchIndicator) && !isNotProduct;
  });
  
  // Categorize and score products
  const categorizedProducts = products.map(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    let score = 5;
    let category = 'general';
    
    // Determine category
    const isFunded = FUNDED_INDICATORS.some(ind => text.includes(ind));
    const isDevtool = DEVTOOL_INDICATORS.some(ind => text.includes(ind));
    const isAIInfra = AI_INFRA_INDICATORS.some(ind => text.includes(ind));
    
    if (isFunded) {
      category = 'funded';
      score += 4;
    } else if (isDevtool) {
      category = 'devtool';
      score += 3;
    } else if (isAIInfra) {
      category = 'ai_infra';
      score += 3;
    }
    
    // Additional scoring
    if (item.source === 'Product Hunt') score += 2;
    if (text.includes('launch') || text.includes('introducing')) score += 2;
    if (text.includes('saas') || text.includes('platform')) score += 1;
    if (text.includes('free') || text.includes('open source')) score += 1;
    
    return { ...item, productScore: score, category };
  });
  
  // Get top products by category
  const funded = categorizedProducts
    .filter(p => p.category === 'funded')
    .sort((a, b) => b.productScore - a.productScore)
    .slice(0, 2);
  
  const devtools = categorizedProducts
    .filter(p => p.category === 'devtool')
    .sort((a, b) => b.productScore - a.productScore)
    .slice(0, 2);
  
  const aiInfra = categorizedProducts
    .filter(p => p.category === 'ai_infra')
    .sort((a, b) => b.productScore - a.productScore)
    .slice(0, 1);
  
  console.log(`✅ Categorized products:`);
  console.log(`   Funded/YC: ${funded.length}`);
  console.log(`   Devtools: ${devtools.length}`);
  console.log(`   AI/Infra: ${aiInfra.length}`);
  
  return {
    funded,
    devtools,
    aiInfra,
    all: categorizedProducts
  };
}
