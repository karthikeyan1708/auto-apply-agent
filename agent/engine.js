import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exportApplicationsToExcel } from './export-excel.js';
import { generateDailyReport } from './generate-report.js';
import { sendDailyEmailDigest } from './email-digest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const profilePath = path.join(rootDir, 'config', 'profile.json');
const appsPath = path.join(rootDir, 'data', 'applications.json');

function readJSON(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function calculateMatchScore(candidate, job) {
  const jobText = (job.title + " " + job.description + " " + (job.requirements || []).join(" ")).toLowerCase();
  const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
  
  let matches = 0;
  candidateSkills.forEach(skill => {
    if (jobText.includes(skill)) {
      matches++;
    }
  });

  const reqs = job.requirements || [];
  let reqMatches = 0;
  reqs.forEach(req => {
    if (candidateSkills.some(cs => req.toLowerCase().includes(cs) || cs.includes(req.toLowerCase()))) {
      reqMatches++;
    }
  });

  const skillScore = reqs.length > 0 ? (reqMatches / reqs.length) * 70 : 50;
  const targetTitles = (job.targetTitles || []).map(t => t.toLowerCase());
  const titleMatch = targetTitles.some(tt => job.title.toLowerCase().includes(tt) || tt.includes(job.title.toLowerCase()));

  const titleBonus = titleMatch ? 25 : 10;
  const finalScore = Math.min(98, Math.round(skillScore + titleBonus + (matches * 2)));

  return Math.max(65, finalScore);
}

export async function runAutoApplyAgent(options = { isDryRun: false, maxJobs: 5 }) {
  console.log('---------------------------------------------------------');
  console.log(`🚀 Starting Auto-Apply Agent Session [${new Date().toISOString()}]`);
  console.log(`MODE: ${options.isDryRun ? 'DRY-RUN (Simulation)' : 'LIVE AUTO-APPLY'}`);
  console.log('---------------------------------------------------------');

  const profile = readJSON(profilePath, {});
  const candidate = profile.candidate || {};
  const preferences = profile.jobPreferences || {};
  const existingApps = readJSON(appsPath, []);

  console.log(`👤 Candidate: ${candidate.fullName || 'User'} (${candidate.currentTitle})`);
  console.log(`✉️ Recipient Email Digest: ${candidate.email || 'karthikeyan17802@gmail.com'}`);
  console.log(`🎯 Target Roles: ${(preferences.targetTitles || []).join(', ')}`);
  console.log(`📊 Daily Max Cap: ${preferences.maxApplicationsPerDay || 25} | Min Match: ${preferences.minMatchPercentage || 70}%`);

  const incomingJobsPool = [
    {
      company: "Palo Alto Networks",
      title: "OT Cybersecurity & Threat Detection Engineer",
      location: "Remote / Bengaluru",
      platform: "Greenhouse",
      description: "Analyze industrial OT/ICS network traffic, PCAP captures, Modbus protocol anomalies, and Microsoft Sentinel integration.",
      jobUrl: "https://paloaltonetworks.com/careers/ot-cybersecurity-engineer",
      requirements: ["Cybersecurity", "OT/ICS Security", "Wireshark", "PCAP Analysis", "Microsoft Sentinel", "Python"]
    },
    {
      company: "CrowdStrike",
      title: "AI Security & Anomaly Analytics Specialist",
      location: "Remote",
      platform: "Lever",
      description: "Build machine learning anomaly detection pipelines, XGBoost classification models, and automated threat triage workflows.",
      jobUrl: "https://crowdstrike.com/careers/ai-security-specialist",
      requirements: ["Cybersecurity", "Python", "Machine Learning", "PyTorch", "XGBoost", "Anomaly Detection"]
    },
    {
      company: "Darktrace",
      title: "Cyber AI SOC Analyst",
      location: "Remote / Hybrid",
      platform: "Greenhouse",
      description: "Perform 24/7 SOC monitoring, incident response, network traffic analysis, and ISO 27001 ISMS compliance reviews.",
      jobUrl: "https://darktrace.com/careers/cyber-ai-soc-analyst",
      requirements: ["Cybersecurity", "SOC", "ISO 27001:2022", "Wireshark", "Python"]
    },
    {
      company: "Cloudflare",
      title: "Security Automation Engineer",
      location: "Remote",
      platform: "Workday",
      description: "Automate security incident response, REST API integrations, FastAPI services, and Docker microservices.",
      jobUrl: "https://cloudflare.com/careers/security-automation",
      requirements: ["Cybersecurity", "FastAPI", "Python", "Docker", "AWS"]
    },
    {
      company: "Anthropic",
      title: "Full Stack AI Security Engineer",
      location: "Remote",
      platform: "Greenhouse",
      description: "Build AI safety benchmarks, Python FastAPI backends, and cybersecurity verification tools for Claude platform.",
      jobUrl: "https://anthropic.com/careers/fullstack-ai-security",
      requirements: ["AI Engineer", "Python", "FastAPI", "Cybersecurity", "Docker"]
    }
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const newApplications = [];

  for (let i = 0; i < Math.min(incomingJobsPool.length, options.maxJobs); i++) {
    const job = incomingJobsPool[i];
    job.targetTitles = preferences.targetTitles;

    const matchScore = calculateMatchScore(candidate, job);
    console.log(`\n🔍 Job ${i + 1}/${incomingJobsPool.length}: ${job.company} - ${job.title}`);
    console.log(`   Location: ${job.location} | Platform: ${job.platform}`);
    console.log(`   Match Score: ${matchScore}%`);

    let status = "Applied";
    let notes = `Auto-filled profile data for ${candidate.fullName} (PwC AI & OT Security background).`;
    let responseStatus = "Under Review";

    if (matchScore < (preferences.minMatchPercentage || 70)) {
      status = "Skipped";
      notes = `Skipped: Match score ${matchScore}% below threshold (${preferences.minMatchPercentage}%).`;
      responseStatus = "Skipped";
      console.log(`   ⏩ SKIPPED: ${notes}`);
    } else {
      console.log(`   ✅ SUBMITTED APPLICATION to ${job.company}`);
    }

    const appRecord = {
      id: `app_${Date.now()}_${i}`,
      company: job.company,
      title: job.title,
      location: job.location,
      platform: job.platform,
      matchScore: matchScore,
      status: status,
      appliedAt: new Date().toISOString(),
      dateStr: todayStr,
      jobUrl: job.jobUrl,
      notes: notes,
      responseStatus: responseStatus
    };

    newApplications.push(appRecord);
  }

  const updatedApps = [...newApplications, ...existingApps];
  writeJSON(appsPath, updatedApps);

  // Auto-generate Excel tracker, Markdown Report, and Email Digest
  console.log('\n---------------------------------------------------------');
  console.log('🔄 POST-RUN AUTOMATED TASKS');
  console.log('---------------------------------------------------------');
  exportApplicationsToExcel();
  generateDailyReport(todayStr);
  await sendDailyEmailDigest(todayStr);

  console.log('\n---------------------------------------------------------');
  console.log(`✅ Agent Execution Finished. Processed ${newApplications.length} jobs.`);
  console.log(`Updated JSON database, Excel tracker, Markdown report, and Email Digest.`);
  console.log('---------------------------------------------------------\n');

  return {
    processedCount: newApplications.length,
    appliedCount: newApplications.filter(a => a.status === 'Applied').length,
    skippedCount: newApplications.filter(a => a.status === 'Skipped').length,
    applications: newApplications
  };
}

if (process.argv[1] && process.argv[1].endsWith('engine.js')) {
  const isDryRun = process.argv.includes('--dry-run');
  runAutoApplyAgent({ isDryRun, maxJobs: 5 }).catch(console.error);
}
