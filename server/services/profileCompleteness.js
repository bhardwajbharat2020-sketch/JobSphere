/**
 * Profile Completeness Calculator
 * Calculates how complete a user's profile is based on filled fields
 * Returns percentage and suggestions for improvement
 */

function calculateCandidateCompleteness(user) {
  const profile = user.profile || {};
  let score = 0;
  let totalWeight = 0;
  const suggestions = [];

  // Basic Info (30 points)
  totalWeight += 30;
  if (profile.avatar) score += 5;
  else suggestions.push('Add a profile photo');
  
  if (profile.headline) score += 10;
  else suggestions.push('Add a professional headline');
  
  if (profile.location) score += 5;
  else suggestions.push('Add your location');
  
  if (profile.bio && profile.bio.length > 50) score += 10;
  else suggestions.push('Write a bio (at least 50 characters)');

  // Skills (20 points)
  totalWeight += 20;
  if (profile.skills && profile.skills.length > 0) {
    score += Math.min(20, profile.skills.length * 4);
  } else {
    suggestions.push('Add your skills');
  }

  // Experience (25 points)
  totalWeight += 25;
  if (profile.experience && profile.experience.length > 0) {
    score += Math.min(25, profile.experience.length * 10);
  } else {
    suggestions.push('Add work experience');
  }

  // Education (15 points)
  totalWeight += 15;
  if (profile.education && profile.education.length > 0) {
    score += Math.min(15, profile.education.length * 7);
  } else {
    suggestions.push('Add your education');
  }

  // Projects (10 points)
  totalWeight += 10;
  if (profile.projects && profile.projects.length > 0) {
    score += Math.min(10, profile.projects.length * 5);
  } else {
    suggestions.push('Add projects you\'ve worked on');
  }

  // Social Links (5 points)
  totalWeight += 5;
  const socialLinks = [profile.linkedin, profile.github, profile.portfolio].filter(Boolean);
  if (socialLinks.length > 0) {
    score += Math.min(5, socialLinks.length * 2);
  } else {
    suggestions.push('Add social links (LinkedIn, GitHub, Portfolio)');
  }

  // Resume (10 points)
  totalWeight += 10;
  if (profile.resumeUrl) score += 10;
  else suggestions.push('Upload your resume');

  const completenessScore = Math.round((score / totalWeight) * 100);

  return {
    score: completenessScore,
    suggestions: suggestions.slice(0, 5), // Top 5 suggestions
    breakdown: {
      basicInfo: Math.round(((profile.avatar ? 5 : 0) + (profile.headline ? 10 : 0) + (profile.location ? 5 : 0) + (profile.bio && profile.bio.length > 50 ? 10 : 0)) / 30 * 100),
      skills: profile.skills && profile.skills.length > 0 ? Math.min(100, profile.skills.length * 20) : 0,
      experience: profile.experience && profile.experience.length > 0 ? Math.min(100, profile.experience.length * 50) : 0,
      education: profile.education && profile.education.length > 0 ? Math.min(100, profile.education.length * 50) : 0,
      projects: profile.projects && profile.projects.length > 0 ? Math.min(100, profile.projects.length * 50) : 0,
      social: Math.round((socialLinks.length / 3) * 100),
      resume: profile.resumeUrl ? 100 : 0,
    }
  };
}

function calculateRecruiterCompleteness(user) {
  const company = user.company || {};
  let score = 0;
  let totalWeight = 0;
  const suggestions = [];

  // Company Info (40 points)
  totalWeight += 40;
  if (company.name) score += 10;
  else suggestions.push('Add company name');
  
  if (company.logo) score += 10;
  else suggestions.push('Add company logo');
  
  if (company.industry) score += 10;
  else suggestions.push('Select company industry');
  
  if (company.size) score += 10;
  else suggestions.push('Add company size');

  // Contact Info (30 points)
  totalWeight += 30;
  if (company.website) score += 10;
  else suggestions.push('Add company website');
  
  if (company.location) score += 10;
  else suggestions.push('Add company location');
  
  if (user.contactInfo && user.contactInfo.phone) score += 10;
  else suggestions.push('Add contact phone number');

  // Company Description (30 points)
  totalWeight += 30;
  if (company.description && company.description.length > 100) score += 20;
  else suggestions.push('Write a company description (at least 100 characters)');
  
  if (company.founded) score += 10;
  else suggestions.push('Add year company was founded');

  const completenessScore = Math.round((score / totalWeight) * 100);

  return {
    score: completenessScore,
    suggestions: suggestions.slice(0, 5),
    breakdown: {
      companyInfo: Math.round(((company.name ? 10 : 0) + (company.logo ? 10 : 0) + (company.industry ? 10 : 0) + (company.size ? 10 : 0)) / 40 * 100),
      contactInfo: Math.round(((company.website ? 10 : 0) + (company.location ? 10 : 0) + (user.contactInfo && user.contactInfo.phone ? 10 : 0)) / 30 * 100),
      description: ((company.description && company.description.length > 100 ? 20 : 0) + (company.founded ? 10 : 0)) / 30 * 100,
    }
  };
}

module.exports = {
  calculateCandidateCompleteness,
  calculateRecruiterCompleteness,
};
