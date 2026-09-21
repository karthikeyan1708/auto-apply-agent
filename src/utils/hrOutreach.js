export function generateHROutreachEmail(job = {}, profile = {}) {
  const candidate = profile.candidate || {
    fullName: "M KARTHIKEYAN",
    email: "karthikeyan17802@gmail.com",
    phone: "+91 9380699461",
    portfolio: "https://karthikeyan1708.github.io",
    github: "https://github.com/karthikeyan1708",
    linkedIn: "https://www.linkedin.com/in/karthikeyan-m-10a35a242/"
  };

  const company = job.company || 'Engineering Team';
  const roleTitle = job.title || 'Cybersecurity / AI Role';

  const subject = `Application & Outreach: ${roleTitle} — M Karthikeyan (AI & OT Cybersecurity Specialist)`;

  const body = `Dear Hiring Team / HR Manager at ${company},

I recently submitted my application for the ${roleTitle} position at ${company} and wanted to personally reach out to introduce myself.

I am an AI Engineer & OT Cybersecurity Analyst with ~2 years experience at PricewaterhouseCoopers (PwC). My technical background sits directly at the intersection of machine learning analytics and critical infrastructure security:

• AI & Security Analytics: Built production ML anomaly detection pipelines processing 500K+ daily OT sensor events (85% precision) and automated multi-terabyte PCAP feature extraction.
• Cybersecurity Engagements: Delivered 6+ security audits across aviation, energy, telecom, and manufacturing (firewall rule reviews, maturity assessments, 24/7 SOC Sentinel monitoring).
• Compliance & Credentials: ISO 27001:2022 Lead Implementer, published Springer researcher (disease outbreak prediction ML), B.Tech CSE (AI) with 8.5 CGPA.

Given ${company}'s focus in this domain, I am confident my experience in automated PCAP security analytics and ML engineering would add immediate value to your team.

You can inspect my interactive project portfolio and open-source work at:
🌐 Portfolio: ${candidate.portfolio || 'https://karthikeyan1708.github.io'}
🐙 GitHub: ${candidate.github || 'https://github.com/karthikeyan1708'}
💼 LinkedIn: ${candidate.linkedIn || 'https://www.linkedin.com/in/karthikeyan-m-10a35a242/'}

I would welcome the opportunity to discuss how my background aligns with your engineering roadmap. Thank you for your time and consideration!

Warm regards,

M KARTHIKEYAN
AI Engineer & OT Cybersecurity Analyst
Phone: ${candidate.phone || '+91 9380699461'}
Email: ${candidate.email || 'karthikeyan17802@gmail.com'}
`;

  return {
    subject,
    body,
    recipientPrompt: `recruiter@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
  };
}
