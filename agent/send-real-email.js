import fs from 'fs';
import path from 'path';

async function sendDirectEmail() {
  const recipient = "karthikeyan17802@gmail.com";
  console.log(`🚀 Triggering direct mail dispatch to ${recipient}...`);

  const formData = new URLSearchParams();
  formData.append("_subject", "🚀 AutoApply Live Confirmation: 5 Jobs Applied Today");
  formData.append("Candidate Name", "M KARTHIKEYAN");
  formData.append("Current Role", "Associate — AI & OT Cybersecurity Analyst at PwC");
  formData.append("Today Applications", "5 Jobs Applied (Palo Alto Networks 92%, CrowdStrike 92%, Cloudflare 90%, Darktrace 74%, Anthropic 74%)");
  formData.append("Excel Tracker Status", "Updated at data/applications_tracker.xlsx");
  formData.append("_captcha", "false");
  formData.append("_template", "table");

  try {
    const res = await fetch("https://formsubmit.co/" + recipient, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      body: formData.toString()
    });

    console.log("Status Code:", res.status);
    const text = await res.text();
    console.log("Response snippet:", text.substring(0, 300));

    if (res.status === 200 || text.includes('Activate') || text.includes('Thank you')) {
      console.log(`\n=========================================================`);
      console.log(`✅ Mail request processed! Check Spam/Promotions folder as well.`);
      console.log(`=========================================================\n`);
    }
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
}

sendDirectEmail();
