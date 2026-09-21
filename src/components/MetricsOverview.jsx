import React from 'react';
import { Send, CheckCircle2, AlertTriangle, Target, Briefcase, TrendingUp } from 'lucide-react';

export default function MetricsOverview({ applications }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = applications.filter(a => a.dateStr === todayStr);
  
  const totalApplied = applications.filter(a => a.status === 'Applied').length;
  const todayApplied = todayApps.filter(a => a.status === 'Applied').length;
  const reviewNeeded = applications.filter(a => a.status === 'Review Required').length;

  // Calculate average match score for applied roles
  const appliedRoles = applications.filter(a => a.status === 'Applied');
  const avgMatch = appliedRoles.length > 0
    ? Math.round(appliedRoles.reduce((sum, a) => sum + (a.matchScore || 0), 0) / appliedRoles.length)
    : 0;

  // Calculate interview/screening count
  const interviewsCount = applications.filter(a => 
    (a.responseStatus || '').toLowerCase().includes('interview') || 
    (a.responseStatus || '').toLowerCase().includes('screening') ||
    (a.responseStatus || '').toLowerCase().includes('offer')
  ).length;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplied,
      subtext: `Out of ${applications.length} total processed`,
      icon: Briefcase,
      color: "var(--accent-primary)",
      gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)"
    },
    {
      title: "Applied Today",
      value: todayApplied,
      subtext: `${todayApps.length} scanned today`,
      icon: Send,
      color: "var(--accent-emerald)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)"
    },
    {
      title: "Avg Skill Match",
      value: `${avgMatch}%`,
      subtext: "Above 70% minimum threshold",
      icon: Target,
      color: "var(--accent-cyan)",
      gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)"
    },
    {
      title: "Interviews / Screens",
      value: interviewsCount,
      subtext: `${totalApplied > 0 ? ((interviewsCount / totalApplied) * 100).toFixed(1) : 0}% conversion rate`,
      icon: TrendingUp,
      color: "var(--accent-purple)",
      gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)"
    },
    {
      title: "Review Required",
      value: reviewNeeded,
      subtext: "Needs manual video/QA answer",
      icon: AlertTriangle,
      color: "var(--accent-amber)",
      gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)"
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="glass-panel glass-panel-interactive" style={{
            padding: '20px',
            background: stat.gradient,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {stat.title}
              </span>
              <div style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} />
              </div>
            </div>
            
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginBottom: '6px'
            }}>
              {stat.value}
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              fontWeight: 500
            }}>
              {stat.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
