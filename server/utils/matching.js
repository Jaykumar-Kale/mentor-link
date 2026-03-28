/**
 * MentorLink - Automated Mentor-Mentee Matching Algorithm
 * Weighted Multi-Criteria Scoring System
 * Research Paper: "Automated Mentor-Mentee Matching Using Weighted
 * Multi-Criteria Scoring in Educational NGO Environments"
 * Author: Jaykumar Kale, PICT College Pune
 */
const User = require('../models/User');
const NeedAnalysis = require('../models/NeedAnalysis');

const AREA_MAP = {
  careerDevelopment:   'Career Development',
  interpersonalSkills: 'Interpersonal Skills',
  communicationSkills: 'Communication Skills',
  etiquette:           'Etiquette',
  problemSolving:      'Problem Solving and Decision Making',
  timeManagement:      'Time and Stress Management',
};

// Get mentee's weakest areas (score <= 3)
const getWeakAreas = (ratings = {}) =>
  Object.entries(ratings)
    .filter(([, v]) => v <= 3)
    .map(([k]) => AREA_MAP[k] || k);

/**
 * Calculate match score between one mentor and one mentee need-analysis
 * Max score = 100
 */
const calculateMatchScore = (mentor, needAnalysis) => {
  let score = 0;
  const details = {};

  // 1. Language compatibility — 30 points
  const menteeLanguages = (needAnalysis.preferredLanguage || []).map(l => l.toLowerCase());
  const mentorLanguages  = (mentor.languagesKnown || []).map(l => l.toLowerCase());
  const commonLangs = mentorLanguages.filter(l => menteeLanguages.includes(l));
  const langScore   = commonLangs.length > 0 ? 30 : 0;
  score += langScore;
  details.language = { score: langScore, common: commonLangs };

  // 2. Domain/expertise match — 40 points
  const weakAreas     = getWeakAreas(needAnalysis.ratings);
  const mentorExpertise = (mentor.expertise || []).map(e => e.toLowerCase());
  const matched = weakAreas.filter(area =>
    mentorExpertise.some(exp =>
      exp.includes(area.toLowerCase()) || area.toLowerCase().includes(exp)
    )
  );
  const domainScore = weakAreas.length > 0
    ? Math.round((matched.length / weakAreas.length) * 40)
    : 20;
  score += domainScore;
  details.domain = { score: domainScore, matched, weakAreas };

  // 3. Mentor workload — 20 points
  const load      = (mentor.assignedMentees || []).length;
  const loadScore = load === 0 ? 20 : load < 2 ? 15 : load < 3 ? 8 : 0;
  score += loadScore;
  details.workload = { score: loadScore, current: load };

  // 4. Experience — 10 points
  const exp      = Number(mentor.yearsOfExperience) || 0;
  const expScore = Math.min(exp * 2, 10);
  score += expScore;
  details.experience = { score: expScore, years: exp };

  return { total: Math.round(score), details };
};

/**
 * Auto-match ALL unmatched mentees (who completed need analysis)
 * with the best available mentor
 */
const autoMatchAll = async () => {
  const results = [];
  const unmatched = await User.find({ role: 'mentee', isMatched: false, needAnalysisCompleted: true });
  const mentors   = await User.find({ role: 'mentor', isActive: true });

  for (const mentee of unmatched) {
    const needAnalysis = await NeedAnalysis.findOne({ mentee: mentee._id });
    if (!needAnalysis) continue;

    let bestMentor = null, bestScore = -1;
    for (const mentor of mentors) {
      if ((mentor.assignedMentees || []).length >= 3) continue;
      const { total } = calculateMatchScore(mentor, needAnalysis);
      if (total > bestScore) { bestScore = total; bestMentor = mentor; }
    }

    if (bestMentor) {
      await User.findByIdAndUpdate(mentee._id, { assignedMentor: bestMentor._id, isMatched: true });
      await User.findByIdAndUpdate(bestMentor._id, { $addToSet: { assignedMentees: mentee._id } });
      results.push({
        mentee: { id: mentee._id, name: mentee.name },
        mentor: { id: bestMentor._id, name: bestMentor.name },
        score:  bestScore,
      });
    }
  }
  return results;
};

/**
 * Get top 5 mentor suggestions for a single mentee
 */
const getSuggestionsForMentee = async (menteeId) => {
  const needAnalysis = await NeedAnalysis.findOne({ mentee: menteeId });
  if (!needAnalysis) return [];
  const mentors = await User.find({ role: 'mentor', isActive: true });
  const scored  = mentors.map(mentor => {
    const { total, details } = calculateMatchScore(mentor, needAnalysis);
    return {
      mentor: {
        _id: mentor._id, name: mentor.name, email: mentor.email,
        organization: mentor.organization, languagesKnown: mentor.languagesKnown,
        expertise: mentor.expertise, yearsOfExperience: mentor.yearsOfExperience,
        currentMentees: (mentor.assignedMentees || []).length,
      },
      score: total,
      details,
    };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
};

module.exports = { autoMatchAll, getSuggestionsForMentee, calculateMatchScore, getWeakAreas };
