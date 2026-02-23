// Extract and rank SaaS product launches

export function extractSaaSProducts(items) {
  console.log('🚀 Extracting SaaS product launches...');
  
  const SAAS_INDICATORS = [
    'launch', 'launched', 'introducing', 'announce', 'released',
    'new tool', 'new platform', 'new service', 'new app',
    'saas', 'platform', 'tool', 'app', 'service',
    'free tier', 'pricing', 'beta', 'waitlist'
  ];
  
  const PRODUCT_SOURCES = ['Product Hunt', 'Hacker News', 'TechCrunch'];
  
  // Filter for product launches
  const products = items.filter(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    // Must be from product-focused source OR contain launch indicators
    const isProductSource = PRODUCT_SOURCES.includes(item.source);
    const hasLaunchIndicator = SAAS_INDICATORS.some(indicator => 
      text.includes(indicator.toLowerCase())
    );
    
    // Exclude non-product items
    const isNotProduct = 
      text.includes('opinion:') ||
      text.includes('essay:') ||
      text.includes('discussion:') ||
      text.includes('ask hn:') ||
      text.includes('show hn: i wrote') ||
      text.includes('blog post');
    
    return (isProductSource || hasLaunchIndicator) && !isNotProduct;
  });
  
  // Score products
  const scoredProducts = products.map(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    let score = 5;
    
    // Boost for Product Hunt (primary source)
    if (item.source === 'Product Hunt') score += 3;
    
    // Boost for explicit launches
    if (text.includes('launch') || text.includes('introducing')) score += 2;
    
    // Boost for SaaS/tool keywords
    if (text.includes('saas') || text.includes('platform')) score += 2;
    if (text.includes('free') || text.includes('open source')) score += 1;
    
    // Boost for developer tools
    if (text.includes('developer') || text.includes('api') || text.includes('sdk')) score += 2;
    
    // Boost for AI products (hot category)
    if (text.includes('ai') || text.includes('llm') || text.includes('gpt')) score += 2;
    
    return { ...item, productScore: score };
  });
  
  // Sort by score and take top 5
  const top5 = scoredProducts
    .sort((a, b) => b.productScore - a.productScore)
    .slice(0, 5);
  
  console.log(`✅ Found ${products.length} product launches, selected top 5`);
  if (top5.length > 0) {
    console.log(`   Score range: ${top5[0]?.productScore} - ${top5[top5.length - 1]?.productScore}`);
  }
  
  return top5;
}
