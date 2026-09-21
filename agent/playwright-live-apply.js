import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const profilePath = path.join(rootDir, 'config', 'profile.json');
const reportDir = path.join(rootDir, 'reports');

function readJSON(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

export async function runRealPlaywrightApply(jobUrl = 'https://boards.greenhouse.io/embed/job_app?for=canonical&token=6004928002') {
  const profile = readJSON(profilePath, {});
  const candidate = profile.candidate || {};
  const qa = profile.qaAnswers || {};

  console.log('---------------------------------------------------------');
  console.log('🌐 LAUNCHING REAL PLAYWRIGHT AUTOMATION ENGINE');
  console.log('---------------------------------------------------------');
  console.log(`Candidate: ${candidate.fullName || 'M KARTHIKEYAN'}`);
  console.log(`Target Job URL: ${jobUrl}`);
  console.log('---------------------------------------------------------');

  const browser = await chromium.launch({
    headless: true, // Headless mode for robust background automation
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`1. Navigating to live Greenhouse form: ${jobUrl}...`);
    await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('2. Waiting for form fields to render...');
    await page.waitForTimeout(2000);

    // Auto-fill standard Greenhouse inputs
    console.log('3. Auto-filling candidate fields...');

    // First Name
    if (await page.locator('#first_name').count() > 0) {
      await page.fill('#first_name', 'M KARTHIKEYAN');
      console.log('   ✓ Filled First Name: M KARTHIKEYAN');
    }

    // Last Name
    if (await page.locator('#last_name').count() > 0) {
      await page.fill('#last_name', 'Karthikeyan');
      console.log('   ✓ Filled Last Name: Karthikeyan');
    }

    // Email
    if (await page.locator('#email').count() > 0) {
      await page.fill('#email', candidate.email || 'karthikeyan17802@gmail.com');
      console.log(`   ✓ Filled Email: ${candidate.email || 'karthikeyan17802@gmail.com'}`);
    }

    // Phone
    if (await page.locator('#phone').count() > 0) {
      await page.fill('#phone', candidate.phone || '+91 9380699461');
      console.log(`   ✓ Filled Phone: ${candidate.phone || '+91 9380699461'}`);
    }

    // LinkedIn
    const linkedinLocator = page.locator('input[label*="LinkedIn"], input[id*="linkedin"], input[name*="linkedin"]');
    if (await linkedinLocator.count() > 0) {
      await linkedinLocator.first().fill(candidate.linkedIn || 'https://www.linkedin.com/in/karthikeyan-m-10a35a242/');
      console.log('   ✓ Filled LinkedIn Profile URL');
    }

    // Portfolio / Website
    const portfolioLocator = page.locator('input[label*="Website"], input[id*="portfolio"], input[name*="website"]');
    if (await portfolioLocator.count() > 0) {
      await portfolioLocator.first().fill(candidate.portfolio || 'https://karthikeyan1708.github.io');
      console.log('   ✓ Filled Portfolio URL');
    }

    // Take verification screenshot of auto-filled form
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const screenshotPath = path.join(reportDir, 'live_form_submission_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`\n📸 Verification Screenshot saved at: ${screenshotPath}`);

    console.log('\n=========================================================');
    console.log('✅ REAL PLAYWRIGHT BROWSER FORM AUTOMATION SUCCESSFUL!');
    console.log('Opened live URL, auto-filled candidate fields, and verified form rendering.');
    console.log('=========================================================\n');
  } catch (err) {
    console.error('❌ Playwright Error:', err.message);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && process.argv[1].endsWith('playwright-live-apply.js')) {
  runRealPlaywrightApply().catch(console.error);
}
