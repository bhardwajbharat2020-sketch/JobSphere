/**
 * Advanced Job Recommendation System
 * Uses multiple factors: skills, experience, location, job level, recency
 */

// Calculate Jaccard similarity between two sets
function jaccardSimilarity(set1, set2) {
  if (!set1.length || !set2.length) return 0;

  const setA = new Set(set1.map(s => s.toLowerCase()));
  const setB = new Set(set2.map(s => s.toLowerCase()));

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

// Calculate keyword overlap score
function keywordOverlap(candidateKeywords, jobKeywords) {
  if (!candidateKeywords.length || !jobKeywords.length) return 0;

  const candidateSet = new Set(candidateKeywords.map(k => k.toLowerCase()));
  const jobSet = new Set(jobKeywords.map(k => k.toLowerCase()));

  let overlapCount = 0;
  candidateSet.forEach(keyword => {
    if (jobSet.has(keyword)) {
      overlapCount++;
    }
  });

  return overlapCount / Math.max(candidateSet.size, jobSet.size);
}

// Calculate skill match percentage with detailed breakdown
function calculateSkillMatch(candidateSkills, jobSkills) {
  if (!candidateSkills.length || !jobSkills.length) {
    return { percentage: 0, matched: [], missing: jobSkills || [] };
  }

  const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
  const jobSet = new Set(jobSkills.map(s => s.toLowerCase()));

  const matched = [];
  const missing = [];

  jobSkills.forEach(skill => {
    if (candidateSet.has(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const percentage = Math.round((matched.length / jobSkills.length) * 100);

  return { percentage, matched, missing };
}

// Match experience level
function matchExperienceLevel(candidate, job) {
  if (!job.jobLevel) return 0.5; // Neutral if not specified

  const levelMap = {
    'entry': 1,
    'mid': 2,
    'senior': 3,
    'lead': 4,
    'manager': 5,
  };

  const jobLevel = levelMap[job.jobLevel] || 2;
  
  // Calculate candidate experience level based on years
  let candidateLevel = 1;
  if (candidate.profile?.experience?.length > 0) {
    const totalYears = candidate.profile.experience.reduce((sum, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate || start);
      return sum + (end - start) / (1000 * 60 * 60 * 24 * 365);
    }, 0);

    if (totalYears >= 10) candidateLevel = 5;
    else if (totalYears >= 7) candidateLevel = 4;
    else if (totalYears >= 4) candidateLevel = 3;
    else if (totalYears >= 2) candidateLevel = 2;
  }

  // Score based on level match (closer is better)
  const diff = Math.abs(jobLevel - candidateLevel);
  return Math.max(0, 1 - (diff * 0.25));
}

// Match location preference
function matchLocation(candidate, job) {
  if (!job.location || !candidate.profile?.location) return 0.5;

  const candidateLocation = candidate.profile.location.toLowerCase();
  const jobLocation = job.location.toLowerCase();

  if (jobLocation.includes(candidateLocation) || candidateLocation.includes(jobLocation)) {
    return 1;
  }

  // Check for remote preference
  if (job.remote) return 0.8; // Remote jobs are good for everyone

  return 0.3; // Different locations
}

// Calculate recency score (newer jobs get slight boost)
function recencyScore(job) {
  const daysSincePosted = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSincePosted <= 1) return 1;
  if (daysSincePosted <= 7) return 0.8;
  if (daysSincePosted <= 30) return 0.6;
  return 0.4;
}

// Recommend jobs for a candidate with detailed matching
function recommendJobs(candidate, jobs, limit = 10) {
  if (!candidate || !candidate.profile) return [];

  const candidateSkills = [
    ...(candidate.profile.parsedSkills || []),
    ...(candidate.profile.skills || []),
  ];

  if (!candidateSkills.length) return [];

  // Score each job
  const scoredJobs = jobs
    .filter(job => job.isActive)
    .map(job => {
      const jobSkills = job.skills || [];

      // 1. Skill match (40% weight) - Most important
      const skillMatch = jaccardSimilarity(candidateSkills, jobSkills);
      const skillDetails = calculateSkillMatch(candidateSkills, jobSkills);

      // 2. Keyword overlap (20% weight)
      const keywordOverlapScore = keywordOverlap(candidateSkills, jobSkills);

      // 3. Experience level match (15% weight)
      const experienceMatch = matchExperienceLevel(candidate, job);

      // 4. Location match (15% weight)
      const locationMatch = matchLocation(candidate, job);

      // 5. Recency (10% weight) - Newer jobs preferred
      const recency = recencyScore(job);

      // Combined weighted score
      const matchScore = (
        (skillMatch * 0.40) +
        (keywordOverlapScore * 0.20) +
        (experienceMatch * 0.15) +
        (locationMatch * 0.15) +
        (recency * 0.10)
      );

      return {
        ...job.toObject(),
        matchScore: Math.round(matchScore * 100), // Convert to percentage
        skillMatch: skillDetails,
        matchBreakdown: {
          skills: Math.round(skillMatch * 100),
          keywords: Math.round(keywordOverlapScore * 100),
          experience: Math.round(experienceMatch * 100),
          location: Math.round(locationMatch * 100),
          recency: Math.round(recency * 100),
        },
      };
    })
    .filter(job => job.matchScore > 15) // Only jobs with meaningful match
    .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score descending
    .slice(0, limit); // Return top N

  return scoredJobs;
}

// Get recommended jobs with categories
function getCategorizedRecommendations(candidate, jobs) {
  const recommendations = recommendJobs(candidate, jobs, 50);

  return {
    topMatches: recommendations.slice(0, 10), // 80-100% match
    recommended: recommendations.filter(j => j.matchScore >= 50 && j.matchScore < 80).slice(0, 10),
    mayInterest: recommendations.filter(j => j.matchScore >= 30 && j.matchScore < 50).slice(0, 10),
  };
}

module.exports = {
  recommendJobs,
  getCategorizedRecommendations,
  jaccardSimilarity,
  keywordOverlap,
  calculateSkillMatch,
};
