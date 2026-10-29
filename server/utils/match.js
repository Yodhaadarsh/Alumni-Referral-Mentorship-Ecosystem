const norm = arr => (arr || []).map(s => s.trim().toLowerCase()).filter(Boolean);
const overlap = (a, b) => {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let common = 0; A.forEach(x => B.has(x) && common++);
  return common / new Set([...A, ...B]).size; // Jaccard similarity
};

// Weighted score: skills 50%, interests/domain 30%, target company 20%.
exports.score = (student, alumni) => {
  const skills = overlap(student.skills, alumni.skills);
  const interests = overlap(student.interests, alumni.interests);
  const company = student.company && alumni.company &&
    student.company.toLowerCase() === alumni.company.toLowerCase() ? 1 : 0;
  return Math.round((0.5 * skills + 0.3 * interests + 0.2 * company) * 100);
};
