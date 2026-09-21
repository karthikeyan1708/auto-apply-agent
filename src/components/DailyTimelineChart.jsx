import React from 'react';
import { Calendar, BarChart2, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DailyTimelineChart({ applications }) {
  // Group applications by dateStr
  const dateMap = {};
  applications.forEach(app => {
    const d = app.dateStr || '2026-09-21';
    if (!dateMap[d]) {
      dateMap[d] = { total: 0, applied: 0, review: 0, skipped: 0 };
    }
    dateMap[d].total++;
    if (app.status === 'Applied') dateMap[d].applied++;
    else if (app.status === 'Review Required') dateMap[d].review++;
    else if (app.status === 'Skipped') dateMap[d].skipped++;
  });

  const sortedDates = Object.keys(dateMap).sort();
  const maxVolume = Math.max(...sortedDates.map(d => dateMap[d].total), 1);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '8px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-primary)'
          }}>
            <BarChart2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Daily Application Volume & Funnel
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Day-by-day breakdown of automated submissions and reviews
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-emerald)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Applied</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-amber)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Review Needed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.2)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Skipped</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(sortedDates.length, 1)}, 1fr)`,
        gap: '12px',
        alignItems: 'end',
        height: '180px',
        paddingTop: '20px',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        {sortedDates.map((d, i) => {
          const stats = dateMap[d];
          const appliedPct = (stats.applied / maxVolume) * 100;
          const reviewPct = (stats.review / maxVolume) * 100;
          const skippedPct = (stats.skipped / maxVolume) * 100;

          return (
            <div key={d} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              justify: 'flex-end',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {stats.applied}
              </span>

              {/* Stacked bar */}
              <div style={{
                width: '100%',
                maxWidth: '40px',
                height: `${Math.max((stats.total / maxVolume) * 120, 16)}px`,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column-reverse',
                overflow: 'hidden',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{
                  height: `${(stats.applied / stats.total) * 100}%`,
                  background: 'var(--gradient-emerald)',
                  transition: 'height 0.3s ease'
                }} title={`Applied: ${stats.applied}`} />
                {stats.review > 0 && (
                  <div style={{
                    height: `${(stats.review / stats.total) * 100}%`,
                    background: 'var(--accent-amber)',
                    transition: 'height 0.3s ease'
                  }} title={`Review Required: ${stats.review}`} />
                )}
                {stats.skipped > 0 && (
                  <div style={{
                    height: `${(stats.skipped / stats.total) * 100}%`,
                    background: 'rgba(255, 255, 255, 0.15)',
                    transition: 'height 0.3s ease'
                  }} title={`Skipped: ${stats.skipped}`} />
                )}
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center'
              }}>
                {d.slice(5)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
