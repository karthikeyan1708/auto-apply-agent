import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHROutreachEmail } from '../src/utils/hrOutreach.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const profilePath = path.join(rootDir, 'config', 'profile.json');

function readJSON(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

if (process.argv[1] && process.argv[1].endsWith('hr-outreach.js')) {
  const profile = readJSON(profilePath, {});
  const sampleEmail = generateHROutreachEmail({
    company: "Palo Alto Networks",
    title: "OT Cybersecurity & Threat Detection Engineer"
  }, profile);

  console.log('---------------------------------------------------------');
  console.log('📧 HR / RECRUITER OUTREACH EMAIL TEMPLATE');
  console.log('---------------------------------------------------------');
  console.log(`SUBJECT: ${sampleEmail.subject}\n`);
  console.log(sampleEmail.body);
  console.log('---------------------------------------------------------');
}
