
export function generateAppMetadata(description: string): {
  promotionalText: string;
  description: string;
  keywords: string;
} {
  const words = description.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  
  const promotionalText = description.length > 50 
    ? `${description.substring(0, 170)}...`
    : `Discover ${description}. Download now and experience the difference!`;
  
  const enhancedDescription = `${description}\n\nKey Features:\n- User-friendly interface\n- Fast and reliable performance\n- Regular updates and improvements\n- Secure and private\n\nPerfect for anyone looking to enhance their mobile experience. Download today and see why users love this app!`;
  
  const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'your', 'will', 'can', 'app', 'mobile']);
  const keywords = words
    .filter(word => !commonWords.has(word))
    .slice(0, 10)
    .join(', ');
  
  return {
    promotionalText: promotionalText.substring(0, 170),
    description: enhancedDescription,
    keywords: keywords || 'mobile, app, productivity, utility',
  };
}
