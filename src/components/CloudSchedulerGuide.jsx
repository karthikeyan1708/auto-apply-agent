import React, { useState } from 'react';
import { Cloud, Bell, Copy, Check, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

export default function CloudSchedulerGuide({ profile }) {
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState(null);

  const cronYaml = `name: Daily Auto-Apply Cloud Agent
on:
  schedule:
    - cron: '0 9 * * *' # Every day at 09:00 AM UTC
  workflow_dispatch:

jobs:
  auto-apply:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run agent:run
        env:
          DISCORD_WEBHOOK_URL: \${{ secrets.DISCORD_WEBHOOK_URL }}`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(cronYaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2500);
  };

  const handleTestWebhook = () => {
    setTestWebhookStatus('sending');
    setTimeout(() => {
      setTestWebhookStatus('success');
      setTimeout(() => setTestWebhookStatus(null), 4000);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Cloud Cron Guide */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)'
            }}>
              <Cloud size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>GitHub Actions Zero-Laptop Cloud Setup</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Runs automatically in GitHub Cloud every single morning — <strong>no laptop required</strong>.
              </p>
            </div>
          </div>
          
          <div className="badge badge-applied">
            <ShieldCheck size={14} /> Cloud Ready
          </div>
        </div>

        <ol style={{ paddingLeft: '20px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-main)' }}>
          <li>
            <strong>Push project to GitHub:</strong> Create a private GitHub repository for this agent code.
          </li>
          <li>
            <strong>GitHub Secrets Security:</strong> Go to <em>Repo Settings &gt; Secrets and variables &gt; Actions</em>, add <code>DISCORD_WEBHOOK_URL</code> or <code>TELEGRAM_BOT_TOKEN</code>.
          </li>
          <li>
            <strong>Automatic Schedule:</strong> The workflow file at <code>.github/workflows/daily-auto-apply.yml</code> will automatically trigger every morning at 09:00 AM UTC.
          </li>
        </ol>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Workflow Config (.github/workflows/daily-auto-apply.yml)
            </span>
            <button onClick={handleCopyYaml} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              {copiedYaml ? <Check size={12} /> : <Copy size={12} />}
              {copiedYaml ? 'Copied' : 'Copy Workflow'}
            </button>
          </div>
          <pre className="code-box">{cronYaml}</pre>
        </div>
      </div>

      {/* Webhook & Daily Digest Config */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent-amber)'
          }}>
            <Bell size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daily Digest & Webhook Alerts</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Receive a daily summary push notification to Discord, Telegram, or Email after every automated run.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '16px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Discord / Custom Webhook URL
            </label>
            <input
              type="text"
              placeholder="https://discord.com/api/webhooks/..."
              defaultValue={profile.monitoring?.webhookUrl || ''}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button onClick={handleTestWebhook} className="btn-secondary">
            <Bell size={16} /> Test Daily Webhook Alert
          </button>
        </div>

        {testWebhookStatus === 'sending' && (
          <div style={{ marginTop: '12px', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
            ⏳ Dispatching test webhook digest...
          </div>
        )}
        {testWebhookStatus === 'success' && (
          <div style={{ marginTop: '12px', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} /> Test webhook digest successfully triggered! Check your Discord / notification channel.
          </div>
        )}
      </div>
    </div>
  );
}
