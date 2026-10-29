const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Referral = require('./models/Referral');

const A = [
  ['Aarav Sharma', 'aarav', 'Software Engineer II', 'Microsoft', 2019, 'B.Tech CSE', 'Bengaluru, India', 'Software Engineering', 'MNCs', ['react', 'node', 'dsa', 'azure'], ['web development', 'cloud computing']],
  ['Nisha Verma', 'nisha', 'Data Scientist', 'Amazon', 2020, 'B.Tech IT', 'Hyderabad, India', 'Data Science', 'MNCs', ['python', 'machine learning', 'sql', 'aws'], ['ai', 'data science']],
  ['Rohit Meena', 'rohit', 'Research Associate', 'IISc', 2018, 'M.Tech AI', 'Bengaluru, India', 'Artificial Intelligence', 'Research', ['python', 'pytorch', 'research'], ['ai']],
  ['Fatima Khan', 'fatima', 'Product Analyst', 'Grab', 2021, 'BBA', 'Singapore', 'Product', 'International Placements', ['sql', 'python', 'product analytics'], ['product']],
  ['Siddharth Jain', 'siddharth', 'Founder', 'SkillBridge Labs', 2017, 'B.Tech CSE', 'Noida, India', 'Entrepreneurship', 'Startups', ['node', 'mongodb', 'react', 'aws'], ['fintech', 'cloud computing']],
  ['Prerna Singh', 'prerna', 'Assistant Commandant', 'Government of India', 2016, 'B.A. Political Science', 'New Delhi, India', 'Public Service', 'Government Jobs', ['leadership', 'public policy'], ['public service']],
  ['Kunal Bhatia', 'kunal', 'Senior Consultant', 'Accenture', 2019, 'B.Tech ECE', 'Pune, India', 'Consulting', 'MNCs', ['consulting', 'excel', 'sap'], ['consulting']],
  ['Megha Iyer', 'megha', 'Research Fellow', 'Max Planck Institute', 2015, 'M.Sc Physics', 'Munich, Germany', 'Physics Research', 'Research', ['python', 'matlab', 'physics'], ['research']],
  ['Aditya Rao', 'aditya', 'Co-Founder', 'HireNexus', 2018, 'BCA', 'Bengaluru, India', 'Entrepreneurship', 'Startups', ['react', 'node', 'aws', 'docker'], ['startups', 'cloud computing']],
];

// Inserts demo accounts and referral openings the first time the database is empty.
module.exports = async function seedIfEmpty() {
  if (process.env.SEED_DEMO === 'false' || (await User.countDocuments()) > 0) return;
  const hash = await bcrypt.hash('demo123', 10);
  const alumni = await User.insertMany(A.map(([name, id, designation, company, batch, course, location, domain, careerPath, skills, interests]) =>
    ({ name, email: `${id}@demo.com`, password: hash, role: 'alumni', designation, company, batch, course, location, domain, careerPath, skills, interests, branch: course })));
  await User.create({ name: 'Demo Student', email: 'student@demo.com', password: hash, role: 'student', company: 'Google', branch: 'CSE', skills: ['react', 'node', 'aws'], interests: ['web development', 'cloud computing'] });
  await User.create({ name: 'Placement Cell', email: 'admin@demo.com', password: await bcrypt.hash('admin123', 10), role: 'admin' });
  const by = n => alumni.find(a => a.name === n)._id;
  await Referral.insertMany([
    { alumni: by('Aarav Sharma'), title: 'SDE Intern', company: 'Adobe', location: 'Noida, India', type: 'Internship', description: 'Summer internship referral for strong DSA and web skills.', requiredSkills: ['dsa', 'react'] },
    { alumni: by('Kunal Bhatia'), title: 'Business Analyst', company: 'Deloitte', location: 'Gurugram, India', type: 'Full-time', description: 'Entry-level analyst role in the consulting practice.', requiredSkills: ['excel', 'sql'] },
    { alumni: by('Rohit Meena'), title: 'ML Research Intern', company: 'IIT Delhi Lab', location: 'New Delhi, India', type: 'Research internship', description: 'Research internship on applied machine learning.', requiredSkills: ['python', 'pytorch'] },
  ]);
  console.log('Demo data added. Logins: student@demo.com / demo123, aarav@demo.com / demo123 (alumni), admin@demo.com / admin123');
};
