import React, { useState } from 'react';
import { User, Target, Save, Check, Code, DollarSign, Globe } from 'lucide-react';

export default function ProfileEditor({ profile, onSave }) {
  const [candidate, setCandidate] = useState(profile.candidate || {});
  const [preferences, setPreferences] = useState(profile.jobPreferences || {});
  const [qa, setQa] = useState(profile.qaAnswers || {});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      candidate,
      jobPreferences: preferences,
      qaAnswers: qa
    };
    onSave(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="glass-panel" style={{ padding: '28px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.15)',
            color: 'var(--accent-purple)'
          }}>
            <User size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Candidate Profile & Auto-Fill Rules</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Configure applicant profile data, job filters, and standard Q&A answers used by the cloud agent
            </p>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          {savedSuccess ? <Check size={16} /> : <Save size={16} />}
          {savedSuccess ? 'Saved!' : 'Save Rules'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Candidate Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} /> Contact & Experience
          </h4>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
            <input
              type="text"
              value={candidate.fullName || ''}
              onChange={(e) => setCandidate({ ...candidate, fullName: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              value={candidate.email || ''}
              onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Current Title</label>
            <input
              type="text"
              value={candidate.currentTitle || ''}
              onChange={(e) => setCandidate({ ...candidate, currentTitle: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Portfolio / GitHub URL</label>
            <input
              type="text"
              value={candidate.portfolio || ''}
              onChange={(e) => setCandidate({ ...candidate, portfolio: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Job Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} /> Job Filter & Match Thresholds
          </h4>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Target Job Titles (Comma-separated)</label>
            <input
              type="text"
              value={(preferences.targetTitles || []).join(', ')}
              onChange={(e) => setPreferences({ ...preferences, targetTitles: e.target.value.split(',').map(s => s.trim()) })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Min Match Score %</label>
              <input
                type="number"
                value={preferences.minMatchPercentage || 70}
                onChange={(e) => setPreferences({ ...preferences, minMatchPercentage: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Max Apply / Day Cap</label>
              <input
                type="number"
                value={preferences.maxApplicationsPerDay || 25}
                onChange={(e) => setPreferences({ ...preferences, maxApplicationsPerDay: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Work Authorization Default</label>
            <input
              type="text"
              value={qa.workAuthorization || ''}
              onChange={(e) => setQa({ ...qa, workAuthorization: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Notice Period / Availability</label>
            <input
              type="text"
              value={qa.noticePeriod || ''}
              onChange={(e) => setQa({ ...qa, noticePeriod: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
