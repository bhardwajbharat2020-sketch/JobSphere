const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract structured data from resume PDF
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Object} Parsed resume data
 */
exports.parseResumePDF = async (pdfBuffer) => {
  try {
    // Extract text from PDF
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    // Parse the extracted text
    const parsedData = extractStructuredData(text);

    return {
      success: true,
      rawText: text,
      ...parsedData,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return {
      success: false,
      error: 'Failed to parse PDF resume',
    };
  }
};

/**
 * Extract structured data from resume text
 * @param {string} text - Raw resume text
 * @returns {Object} Structured data
 */
function extractStructuredData(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    skills: extractSkills(text, lines),
    education: extractEducation(text, lines),
    experience: extractExperience(text, lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    name: extractName(lines),
    summary: extractSummary(text, lines),
    keywords: extractKeywords(text),
  };
}

/**
 * Extract skills from resume
 */
function extractSkills(text, lines) {
  const skills = new Set();
  
  // Common technical skills patterns
  const skillPatterns = [
    // Programming languages
    /\b(Java|JavaScript|TypeScript|Python|C\+\+|C#|Ruby|Go|Rust|PHP|Swift|Kotlin|Scala|Perl|R|MATLAB)\b/gi,
    // Web technologies
    /\b(React|Angular|Vue\.js|Node\.js|Express|Django|Flask|Spring|ASP\.NET|Laravel|Next\.js|Nuxt\.js|Gatsby)\b/gi,
    // Databases
    /\b(MongoDB|PostgreSQL|MySQL|Redis|SQLite|Oracle|SQL Server|Cassandra|DynamoDB|Firebase)\b/gi,
    // Cloud & DevOps
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|CI\/CD|Terraform|Ansible|Linux|Unix)\b/gi,
    // Other technologies
    /\b(REST|GraphQL|SOAP|Microservices|Agile|Scrum|TDD|BDD|OOP|SOLID|Design Patterns)\b/gi,
    // Tools & Frameworks
    /\b(TensorFlow|PyTorch|Pandas|NumPy|Jupyter|VS Code|IntelliJ|Eclipse|Webpack|Babel)\b/gi,
  ];

  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(skill => skills.add(skill.trim()));
    }
  });

  // Look for "Skills:" section
  const skillsSectionMatch = text.match(/skills?\s*[:\-]\s*([\s\S]*?)(?=\n\s*[A-Z]|$)/i);
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[1];
    const skillList = skillsText.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0);
    skillList.forEach(skill => skills.add(skill));
  }

  return Array.from(skills);
}

/**
 * Extract education information
 */
function extractEducation(text, lines) {
  const education = [];
  
  // Common education patterns
  const eduPatterns = [
    /(Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?A\.?|M\.?A\.?|B\.?Com|M\.?Com|B\.?Sc|M\.?Sc)/gi,
  ];

  eduPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      education.push(matches[0]);
    }
  });

  // Try to find educational institutions
  const institutionPatterns = [
    /(University|College|Institute|School|IIT|NIT|BITS)/gi,
  ];

  institutionPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      education.push(matches[0]);
    }
  });

  return education.length > 0 ? education.join(', ') : '';
}

/**
 * Extract work experience
 */
function extractExperience(text, lines) {
  const experience = [];
  
  // Look for experience section
  const expSectionMatch = text.match(/(experience|work history|employment)\s*[:\-]?[\s\S]*?(?=\n\s*(education|skills|projects)|$)/i);
  
  if (expSectionMatch) {
    return expSectionMatch[0];
  }

  // Try to find company names or job titles
  const expPatterns = [
    /\b(Software Engineer|Developer|Engineer|Manager|Lead|Architect|Analyst|Designer|Consultant|Intern)\b/gi,
  ];

  expPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      experience.push(...matches);
    }
  });

  return experience.length > 0 ? experience.join(', ') : '';
}

/**
 * Extract email address
 */
function extractEmail(text) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
}

/**
 * Extract phone number
 */
function extractPhone(text) {
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return phoneMatch ? phoneMatch[0] : '';
}

/**
 * Extract name (usually first line)
 */
function extractName(lines) {
  // Assume first non-empty line is the name
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && trimmed.length < 50) {
      return trimmed;
    }
  }
  return '';
}

/**
 * Extract summary/objective
 */
function extractSummary(text, lines) {
  const summaryMatch = text.match(/(summary|objective|about me)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*(experience|education|skills|projects)|$)/i);
  return summaryMatch ? summaryMatch[2].trim() : '';
}

/**
 * Extract keywords for job matching
 */
function extractKeywords(text) {
  const keywords = new Set();
  
  // Common keywords
  const keywordPatterns = [
    /\b(Full[- ]?Stack|Front[- ]?End|Back[- ]?End|DevOps|Full[- ]?Time|Part[- ]?Time|Remote|On[- ]?site|Hybrid)\b/gi,
    /\b(Senior|Junior|Mid[- ]?Level|Lead|Principal|Staff|Intern)\b/gi,
  ];

  keywordPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(keyword => keywords.add(keyword.trim()));
    }
  });

  return Array.from(keywords);
}
