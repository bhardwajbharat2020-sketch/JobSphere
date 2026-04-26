const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Common tech skills database
const TECH_SKILLS = [
  'javascript', 'python', 'java', 'react', 'node.js', 'express', 'mongodb',
  'mysql', 'postgresql', 'html', 'css', 'typescript', 'angular', 'vue.js',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'rest api',
  'graphql', 'redux', 'firebase', 'machine learning', 'deep learning',
  'tensorflow', 'pytorch', 'data science', 'sql', 'nosql', 'redis',
  'kafka', 'rabbitmq', 'jenkins', 'ci/cd', 'agile', 'scrum',
  'tailwind', 'bootstrap', 'sass', 'webpack', 'vite', 'next.js',
  'spring boot', 'django', 'flask', 'fastapi', 'c++', 'c#', 'ruby',
  'php', 'laravel', 'terraform', 'ansible', 'linux', 'bash',
];

// Education keywords
const EDUCATION_KEYWORDS = [
  'bachelor', 'master', 'phd', 'degree', 'university', 'college',
  'b.tech', 'm.tech', 'b.sc', 'm.sc', 'bca', 'mca', 'mba',
  'diploma', 'certification', 'institute', 'school',
];

// Extract skills from text
function extractSkills(text) {
  const lowerText = text.toLowerCase();
  const foundSkills = [];

  TECH_SKILLS.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)]; // Remove duplicates
}

// Extract education information
function extractEducation(text) {
  const sentences = text.split(/[.\n]+/);
  const educationInfo = [];

  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    const hasEducationKeyword = EDUCATION_KEYWORDS.some(keyword =>
      lowerSentence.includes(keyword)
    );

    if (hasEducationKeyword && sentence.length > 10 && sentence.length < 200) {
      educationInfo.push(sentence.trim());
    }
  });

  return educationInfo.slice(0, 5); // Return top 5
}

// Parse resume text
function parseResume(text) {
  if (!text || typeof text !== 'string') {
    return {
      skills: [],
      education: [],
      keywords: [],
    };
  }

  const skills = extractSkills(text);
  const education = extractEducation(text);

  // Extract additional keywords using TF-IDF
  const terms = tokenizer.tokenize(text);
  const stopWords = natural.stopwords;
  const filteredTerms = terms.filter(
    term => !stopWords.includes(term.toLowerCase()) && term.length > 2
  );

  const wordFreq = {};
  filteredTerms.forEach(term => {
    const lowerTerm = term.toLowerCase();
    wordFreq[lowerTerm] = (wordFreq[lowerTerm] || 0) + 1;
  });

  // Get top keywords by frequency
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);

  return {
    skills,
    education,
    keywords,
  };
}

module.exports = {
  parseResume,
  extractSkills,
  extractEducation,
};
