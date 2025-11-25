
export function generateAppMetadata(description: string): {
  promotionalText: string;
  description: string;
  keywords: string[];
} {
  const words = description.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  
  const promotionalText = description.length > 50 
    ? `${description.substring(0, 170)}...`
    : `Discover ${description}. Download now and experience the difference!`;
  
  const enhancedDescription = `${description}\n\nKey Features:\n- User-friendly interface\n- Fast and reliable performance\n- Regular updates and improvements\n- Secure and private\n\nPerfect for anyone looking to enhance their mobile experience. Download today and see why users love this app!`;
  
  const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'your', 'will', 'can', 'app', 'mobile', 'their', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once']);
  
  const uniqueWords = words
    .filter(word => !commonWords.has(word) && word.length > 2)
    .filter((word, index, self) => self.indexOf(word) === index);
  
  const keywords = uniqueWords.slice(0, 10);
  
  if (keywords.length < 10) {
    const fillerKeywords = ['productivity', 'utility', 'lifestyle', 'tools', 'efficient', 'smart', 'modern', 'innovative', 'easy', 'simple'];
    while (keywords.length < 10 && fillerKeywords.length > 0) {
      const filler = fillerKeywords.shift();
      if (filler && !keywords.includes(filler)) {
        keywords.push(filler);
      }
    }
  }
  
  return {
    promotionalText: promotionalText.substring(0, 170),
    description: enhancedDescription,
    keywords: keywords,
  };
}
