import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const appsPath = path.join(rootDir, 'data', 'applications.json');
const reportDir = path.join(rootDir, 'reports');

function readJSON(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

export function generateDailyReport(targetDate = null) {
  const todayStr = targetDate || new Date().toISOString().split('T')[0];
  const allApps = readJSON(appsPath, []);
  
  const todayApps = allApps.filter(app => app.dateStr === todayStr);
  const appliedCount = todayApps.filter(app => app.status === 'Applied').length;
  const reviewCount = todayApps.filter(app => app.status === 'Review Required').length;
  const skippedCount = todayApps.filter(app => app.status === 'Skipped').length;
  
  const totalLifetime = allApps.length;
  const totalAppliedLifetime = allApps.filter(app => app.status === 'Applied').length;
  const totalInterviews = allApps.filter(app => (app.responseStatus || '').toLowerCase().includes('interview') || (app.responseStatus || '').toLowerCase().includes('screening')).length;

  const markdown = `# 🚀 AutoApply Agent - Daily Report (${todayStr})

## 📊 Summary Metrics (Today)
- **Total Scanned & Processed:** ${todayApps.length}
- **Successfully Applied:** ${appliedCount}
- **Requires Manual Review:** ${reviewCount}
- **Skipped (Low Match Score):** ${skippedCount}

---

## 📈 Overall Pipeline Stats
- **Total Lifetime Applications:** ${totalAppliedLifetime} / ${totalLifetime}
- **Active Interviews / Screenings:** ${totalInterviews}
- **Interview Conversion Rate:** ${totalAppliedLifetime > 0 ? ((totalInterviews / totalAppliedLifetime) * 100).toFixed(1) : 0}%

---

## 📑 Today's Application Log

${todayApps.length === 0 ? '_No applications processed today yet._' : todayApps.map(app => `
### ${app.status === 'Applied' ? '✅' : app.status === 'Review Required' ? '⚠️' : '⏩'} ${app.company} — ${app.title}
- **Location:** ${app.location} | **Platform:** ${app.platform}
- **Match Score:** ${app.matchScore}%
- **Status:** \`${app.status}\` (${app.responseStatus})
- **Notes:** ${app.notes}
- **Link:** [View Job Posting](${app.jobUrl})
`).join('\n')}

---
_Generated automatically by AutoApply AI Cloud Agent at ${new Date().toISOString()}_
`;

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFilePath = path.join(reportDir, `report-${todayStr}.md`);
  fs.writeFileSync(reportFilePath, markdown, 'utf8');
  console.log(`📄 Daily Report successfully generated at: ${reportFilePath}`);
  return markdown;
}

if (process.argv[1] && process.argv[1].endsWith('generate-report.js')) {
  generateDailyReport();
}
