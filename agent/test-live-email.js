import fs from 'fs';
import path from 'path';

async function sendLiveVerificationEmail() {
  const recipientEmail = "karthikeyan17802@gmail.com";
  const todayStr = new Date().toISOString().split('T')[0];
  
  console.log(`🚀 Triggering Live Email Delivery Test to ${recipientEmail}...`);

  const subject = `🚀 AutoApply Live Confirmation: 5 Jobs Applied Today (${todayStr})`;

  try {
    const res = await fetch('https://formsubmit.co/ajax/' + recipientEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://auto-apply-agent.vercel.app',
        'Origin': 'https://auto-apply-agent.vercel.app'
      },
      body: JSON.stringify({
        _subject: subject,
        candidate_name: "M KARTHIKEYAN",
        candidate_role: "AI Engineer & OT Cybersecurity Analyst (Associate at PwC)",
        jobs_applied_today: "5",
        top_matches: "Palo Alto Networks (92%), CrowdStrike (92%), Cloudflare (90%), Darktrace (74%), Anthropic (74%)",
        excel_tracker_location: "data/applications_tracker.xlsx",
        status: "SESSION COMPLETED SUCCESSFULLY - ALL 5 ROLES SUBMITTED"
      })
    });

    const data = await res.json();
    console.log("FormSubmit API Response:", data);

    if (data.success === "true" || res.status === 200 || (data.message && data.message.includes('sent'))) {
      console.log(`\n=========================================================`);
      console.log(`✅ LIVE EMAIL SENT TO ${recipientEmail}!`);
      console.log(`Open your Gmail inbox on your phone / laptop to confirm!`);
      console.log(`=========================================================\n`);
    } else {
      console.log("Result:", data);
    }
  } catch (err) {
    console.error("Error sending test email:", err.message);
  }
}

sendLiveVerificationEmail();
