import React, { useState } from 'react';
import { Play, RotateCw, CheckCircle2, Terminal, Shield, Sparkles } from 'lucide-react';

export default function LiveAgentSimulator({ onRunComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [lastSummary, setLastSummary] = useState(null);

  const handleStartRun = (isDryRun = false) => {
    setIsRunning(true);
    setLogs([]);
    setLastSummary(null);

    const steps = [
      `[${new Date().toLocaleTimeString()}] 🚀 Launching Auto-Apply Agent Session (Mode: ${isDryRun ? 'Dry-Run Simulation' : 'Live Engine'})...`,
      `[${new Date().toLocaleTimeString()}] 👤 Loaded Candidate Profile: Karthikeyan R (Full Stack & AI Engineer)`,
      `[${new Date().toLocaleTimeString()}] 🎯 Active Target Titles: Full Stack Developer, Frontend Engineer, AI Engineer`,
      `[${new Date().toLocaleTimeString()}] 🌐 Fetching job feeds from Greenhouse, Lever, and Workday APIs...`,
      `[${new Date().toLocaleTimeString()}] 🔍 Job 1: Anthropic — Full Stack AI Engineer (Match: 96%)`,
      `[${new Date().toLocaleTimeString()}] ⚡ Filling form: Candidate fields, LinkedIn, GitHub, Salary expectations...`,
      `[${new Date().toLocaleTimeString()}] ✅ SUBMITTED application to Anthropic! Status: Applied`,
      `[${new Date().toLocaleTimeString()}] 🔍 Job 2: Vercel — Frontend Cloud Infrastructure (Match: 92%)`,
      `[${new Date().toLocaleTimeString()}] ✅ SUBMITTED application to Vercel! Status: Applied`,
      `[${new Date().toLocaleTimeString()}] 🔍 Job 3: Linear — Frontend Architect (Match: 76%)`,
      `[${new Date().toLocaleTimeString()}] ⚠️ Review Required: Custom video answer needed. Added to review queue.`,
      `[${new Date().toLocaleTimeString()}] 📑 Generating Daily Digest & Updating data/applications.json...`,
      `[${new Date().toLocaleTimeString()}] 📱 Dispatching Discord Webhook Digest notification...`,
      `[${new Date().toLocaleTimeString()}] 🎉 Session Completed successfully!`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        const summary = {
          processed: 3,
          applied: 2,
          review: 1,
          time: new Date().toLocaleTimeString()
        };
        setLastSummary(summary);
        if (onRunComplete) {
          onRunComplete();
        }
      }
    }, 600);
  };

  return (
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
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-emerald)'
          }}>
            <Play size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Live Agent Execution & Terminal Simulator</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Trigger an immediate apply session and observe real-time matching and form-filling logs
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleStartRun(true)}
            disabled={isRunning}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <Sparkles size={16} /> Dry-Run (Simulation)
          </button>
          <button
            onClick={() => handleStartRun(false)}
            disabled={isRunning}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            {isRunning ? <RotateCw size={16} className="spin" /> : <Play size={16} />}
            {isRunning ? 'Running Agent...' : 'Run Agent Now'}
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div style={{
        background: '#040711',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '16px',
        minHeight: '220px',
        maxHeight: '360px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '6px' }}>
          $ node agent/engine.js --interactive
        </div>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '20px 0', textAlign: 'center' }}>
            Click "Run Agent Now" or "Dry-Run" to launch an automated job application session.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{
              color: log.includes('✅') ? '#34d399' : log.includes('⚠️') ? '#fbbf24' : log.includes('🚀') ? '#818cf8' : '#cbd5e1'
            }}>
              {log}
            </div>
          ))
        )}
      </div>

      {lastSummary && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600 }}>
            <CheckCircle2 size={18} /> Session completed at {lastSummary.time}
          </div>
          <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>
            Applied: <strong>{lastSummary.applied}</strong> | Review Required: <strong>{lastSummary.review}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
