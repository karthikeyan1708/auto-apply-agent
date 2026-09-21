import React, { useState } from 'react';
import { LayoutDashboard, ListFilter, UserCheck, Cloud, Play, Rocket, RefreshCw, Bell, ShieldCheck } from 'lucide-react';
import MetricsOverview from './components/MetricsOverview';
import DailyTimelineChart from './components/DailyTimelineChart';
import ApplicationLogTable from './components/ApplicationLogTable';
import ProfileEditor from './components/ProfileEditor';
import CloudSchedulerGuide from './components/CloudSchedulerGuide';
import LiveAgentSimulator from './components/LiveAgentSimulator';

import initialProfile from '../config/profile.json';
import initialApplications from '../data/applications.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(initialProfile);
  const [applications, setApplications] = useState(initialApplications);

  const handleProfileSave = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleRunComplete = () => {
    // Refresh application state simulated
    const todayStr = new Date().toISOString().split('T')[0];
    const mockNewApps = [
      {
        id: `app_${Date.now()}_new1`,
        company: "Anthropic",
        title: "Full Stack AI Engineer",
        location: "Remote",
        platform: "Greenhouse",
        matchScore: 96,
        status: "Applied",
        appliedAt: new Date().toISOString(),
        dateStr: todayStr,
        jobUrl: "https://anthropic.com/careers/fullstack-ai-engineer",
        notes: "High match score! Auto-filled profile data.",
        responseStatus: "Under Review"
      },
      {
        id: `app_${Date.now()}_new2`,
        company: "Vercel",
        title: "Frontend Cloud Infrastructure",
        location: "Remote",
        platform: "Lever",
        matchScore: 92,
        status: "Applied",
        appliedAt: new Date().toISOString(),
        dateStr: todayStr,
        jobUrl: "https://vercel.com/careers/frontend-infrastructure",
        notes: "Matched skills: Next.js, React, TypeScript.",
        responseStatus: "Under Review"
      }
    ];

    setApplications(prev => [...mockNewApps, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}>
              <Rocket size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AutoApply AI
              </h1>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Cloud Job Agent & Daily Monitoring System
              </div>
            </div>
          </div>

          {/* Status & Live Scheduler Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="glass-panel" style={{
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              <div className="pulse-indicator"></div>
              <span style={{ color: 'var(--accent-emerald)' }}>Cloud Cron Active</span>
              <span style={{ color: 'var(--text-dim)' }}>| Daily 09:00 AM UTC</span>
            </div>

            <button
              onClick={() => setActiveTab('simulator')}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <Play size={14} /> Run Agent Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px', flex: 1 }}>
        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-glass)'
        }}>
          {[
            { id: 'dashboard', label: 'Daily Analytics Dashboard', icon: LayoutDashboard },
            { id: 'applications', label: 'Application History Log', icon: ListFilter },
            { id: 'profile', label: 'Candidate Profile & Rules', icon: UserCheck },
            { id: 'cloud', label: 'Cloud Scheduler & Webhooks', icon: Cloud },
            { id: 'simulator', label: 'Live Terminal Simulator', icon: Play }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? 'none' : '1px solid var(--border-glass)',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 16px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content Rendering */}
        {activeTab === 'dashboard' && (
          <div>
            <MetricsOverview applications={applications} />
            <DailyTimelineChart applications={applications} />
            <ApplicationLogTable applications={applications.slice(0, 5)} />
          </div>
        )}

        {activeTab === 'applications' && (
          <ApplicationLogTable applications={applications} />
        )}

        {activeTab === 'profile' && (
          <ProfileEditor profile={profile} onSave={handleProfileSave} />
        )}

        {activeTab === 'cloud' && (
          <CloudSchedulerGuide profile={profile} />
        )}

        {activeTab === 'simulator' && (
          <LiveAgentSimulator onRunComplete={handleRunComplete} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        AutoApply AI Cloud Agent System • Automated Daily Monitoring & Job Application Engine
      </footer>
    </div>
  );
}
