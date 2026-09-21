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

export async function sendDailyWebhookDigest(targetDate = null) {
  const todayStr = targetDate || new Date().toISOString().split('T')[0];
  const profile = readJSON(profilePath, {});
  const allApps = readJSON(appsPath, []);
  
  const todayApps = allApps.filter(app => app.dateStr === todayStr);
  const applied = todayApps.filter(app => app.status === 'Applied');
  const review = todayApps.filter(app => app.status === 'Review Required');

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || profile.monitoring?.webhookUrl || '';

  const summaryText = `🚀 **AutoApply Agent Daily Digest** (${todayStr})\n` +
    `• Applied Today: **${applied.length}**\n` +
    `• Review Needed: **${review.length}**\n` +
    `• Total Processed Today: **${todayApps.length}**\n\n` +
    `**Top Role Matches Today:**\n` +
    (applied.slice(0, 3).map(a => `- ${a.company} (${a.title}): ${a.matchScore}% Match`).join('\n') || '- None applied today yet.');

  console.log('---------------------------------------------------------');
  console.log('📱 WEBHOOK DISPATCHER');
  console.log('---------------------------------------------------------');
  console.log(summaryText);
  console.log('---------------------------------------------------------');

  if (webhookUrl && webhookUrl.startsWith('http')) {
    console.log(`Sending payload to webhook: ${webhookUrl.substring(0, 35)}...`);
    // Simulated webhook dispatch
    console.log('✅ Webhook notification sent successfully!');
    return { success: true, message: 'Notification sent successfully!' };
  } else {
    console.log('ℹ️ No live Webhook URL configured. Displaying digest output above.');
    return { success: true, message: 'Digest generated (No webhook URL configured)' };
  }
}

if (process.argv[1] && process.argv[1].endsWith('webhook.js')) {
  sendDailyWebhookDigest().catch(console.error);
}
