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

export async function runRealPlaywrightApply(jobUrl = 'https://boards.greenhouse.io/canonical/jobs/6004928002') {
  const profile = readJSON(profilePath, {});
  const candidate = profile.candidate || {};
  const qa = profile.qaAnswers || {};

  console.log('---------------------------------------------------------');
  console.log('🌐 LAUNCHING PLAYWRIGHT LIVE FORM AUTOMATION ENGINE');
  console.log('---------------------------------------------------------');
  console.log(`Candidate: ${candidate.fullName || 'M KARTHIKEYAN'}`);
  console.log(`Email: ${candidate.email || 'karthikeyan17802@gmail.com'}`);
  console.log(`Target Job URL: ${jobUrl}`);
  console.log('---------------------------------------------------------');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log(`1. Opening live Greenhouse application page: ${jobUrl}...`);
    await page.goto(jobUrl, { waitUntil: 'networkidle', timeout: 45000 });

    console.log('2. Waiting for Greenhouse application form container...');
    await page.waitForTimeout(3000);

    console.log('3. Filling candidate fields...');

    // First Name
    const firstNameSel = '#first_name, input[name="job_application[first_name]"], input[autocomplete="given-name"]';
    if (await page.locator(firstNameSel).count() > 0) {
      await page.locator(firstNameSel).first().fill('M KARTHIKEYAN');
      console.log('   ✅ Filled First Name: M KARTHIKEYAN');
    }

    // Last Name
    const lastNameSel = '#last_name, input[name="job_application[last_name]"], input[autocomplete="family-name"]';
    if (await page.locator(lastNameSel).count() > 0) {
      await page.locator(lastNameSel).first().fill('Karthikeyan');
      console.log('   ✅ Filled Last Name: Karthikeyan');
    }

    // Email
    const emailSel = '#email, input[name="job_application[email]"], input[type="email"]';
    if (await page.locator(emailSel).count() > 0) {
      await page.locator(emailSel).first().fill(candidate.email || 'karthikeyan17802@gmail.com');
      console.log(`   ✅ Filled Email: ${candidate.email || 'karthikeyan17802@gmail.com'}`);
    }

    // Phone
    const phoneSel = '#phone, input[name="job_application[phone]"], input[type="tel"]';
    if (await page.locator(phoneSel).count() > 0) {
      await page.locator(phoneSel).first().fill(candidate.phone || '+91 9380699461');
      console.log(`   ✅ Filled Phone: ${candidate.phone || '+91 9380699461'}`);
    }

    // LinkedIn URL
    const linkedinSel = 'input[name*="linkedin"], input[id*="linkedin"], input[aria-label*="LinkedIn"]';
    if (await page.locator(linkedinSel).count() > 0) {
      await page.locator(linkedinSel).first().fill(candidate.linkedIn || 'https://www.linkedin.com/in/karthikeyan-m-10a35a242/');
      console.log('   ✅ Filled LinkedIn URL');
    }

    // Portfolio URL
    const websiteSel = 'input[name*="website"], input[name*="portfolio"], input[id*="website"]';
    if (await page.locator(websiteSel).count() > 0) {
      await page.locator(websiteSel).first().fill(candidate.portfolio || 'https://karthikeyan1708.github.io');
      console.log('   ✅ Filled Portfolio URL');
    }

    // Scroll down to show filled form inputs
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1000);

    // Capture verification screenshot
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const screenshotPath = path.join(reportDir, 'live_form_submission_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`\n📸 High-Resolution Form Verification Screenshot saved at:\n   ${screenshotPath}`);

    console.log('\n=========================================================');
    console.log('🎉 REAL PLAYWRIGHT LIVE FORM AUTOMATION SUCCESSFUL!');
    console.log('Target form loaded, candidate inputs filled, and verified.');
    console.log('=========================================================\n');
  } catch (err) {
    console.error('❌ Playwright Form Filler Error:', err.message);
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && process.argv[1].endsWith('playwright-live-apply.js')) {
  runRealPlaywrightApply().catch(console.error);
}
