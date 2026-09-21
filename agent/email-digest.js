import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export async function sendDailyEmailDigest(targetDate = null) {
  const todayStr = targetDate || new Date().toISOString().split('T')[0];
  const profile = readJSON(profilePath, {});
  const candidate = profile.candidate || {};
  const recipientEmail = candidate.email || 'karthikeyan17802@gmail.com';

  const allApps = readJSON(appsPath, []);
  const todayApps = allApps.filter(app => app.dateStr === todayStr);
  const applied = todayApps.filter(app => app.status === 'Applied');
  const review = todayApps.filter(app => app.status === 'Review Required');

  const emailSubject = `🚀 AutoApply Daily Digest (${todayStr}): ${applied.length} Applications Submitted`;

  const htmlBody = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }
      .container { max-width: 600px; background: #ffffff; border-radius: 12px; padding: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 0 auto; }
      .header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 20px; }
      .title { font-size: 20px; font-weight: bold; color: #1e1b4b; }
      .stat-grid { display: flex; gap: 12px; margin-bottom: 24px; }
      .stat-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
      .stat-val { font-size: 24px; font-weight: bold; color: #6366f1; }
      .stat-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; }
      .job-item { border-left: 4px solid #10b981; background: #f0fdf4; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 8px 8px 0; }
      .job-item-review { border-left-color: #f59e0b; background: #fffbeb; }
      .job-company { font-weight: bold; font-size: 15px; }
      .job-role { color: #475569; font-size: 13px; }
      .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
      .badge-applied { background: #d1fae5; color: #065f46; }
      .badge-review { background: #fef3c7; color: #92400e; }
      .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="title">🚀 AutoApply Daily Digest Summary</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Candidate: ${candidate.fullName || 'M Karthikeyan'} (${recipientEmail})</div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-val">${applied.length}</div>
          <div class="stat-lbl">Applied Today</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${review.length}</div>
          <div class="stat-lbl">Review Needed</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${todayApps.length}</div>
          <div class="stat-lbl">Total Scanned</div>
        </div>
      </div>

      <h3 style="font-size: 14px; color: #334155; margin-bottom: 12px;">Today's Job Submissions:</h3>

      ${todayApps.length === 0 ? '<p style="color: #64748b; font-style: italic;">No applications processed today.</p>' : todayApps.map(app => `
        <div class="job-item ${app.status === 'Review Required' ? 'job-item-review' : ''}">
          <div style="display: flex; justify-space-between; align-items: center;">
            <span class="job-company">${app.company}</span>
            <span class="badge ${app.status === 'Applied' ? 'badge-applied' : 'badge-review'}">${app.status} (${app.matchScore}% Match)</span>
          </div>
          <div class="job-role">${app.title} — ${app.location} (${app.platform})</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Notes: ${app.notes}</div>
          <div style="margin-top: 6px;"><a href="${app.jobUrl}" style="color: #6366f1; font-size: 12px; font-weight: bold; text-decoration: none;">View Job Posting &rarr;</a></div>
        </div>
      `).join('')}

      <div class="footer">
        Sent automatically by AutoApply AI Agent System to <strong>${recipientEmail}</strong>.<br/>
        Excel application log tracker updated at <code>data/applications_tracker.xlsx</code>.
      </div>
    </div>
  </body>
  </html>
  `;

  console.log('---------------------------------------------------------');
  console.log('📧 DAILY EMAIL DIGEST ENGINE');
  console.log('---------------------------------------------------------');
  console.log(`To: ${recipientEmail}`);
  console.log(`Subject: ${emailSubject}`);
  console.log(`Applied Today: ${applied.length} | Review Needed: ${review.length}`);
  console.log('---------------------------------------------------------');
  console.log('✅ Daily HTML email digest compiled & ready to send via SMTP / SendGrid / GitHub Actions Email Step.');

  return {
    recipient: recipientEmail,
    subject: emailSubject,
    html: htmlBody
  };
}

if (process.argv[1] && process.argv[1].endsWith('email-digest.js')) {
  sendDailyEmailDigest().catch(console.error);
}
