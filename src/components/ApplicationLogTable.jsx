import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Info, CheckCircle2, AlertTriangle, FastForward, FileSpreadsheet, Mail, Copy, Check, X } from 'lucide-react';
import { generateHROutreachEmail } from '../utils/hrOutreach.js';

export default function ApplicationLogTable({ applications }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [hrEmailJob, setHrEmailJob] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' ||
      app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportExcel = () => {
    // Triggers download or notification of Excel file location
    alert("📊 Excel Application Tracker is live at: data/applications_tracker.xlsx\n(Generated automatically on every run)");
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justify: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Application History Log & Tracker
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {filteredApps.length} of {applications.length} total applications
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Excel Export Button */}
          <button onClick={handleExportExcel} className="btn-secondary" style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <FileSpreadsheet size={16} /> Export Excel (.xlsx)
          </button>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)'
            }} />
            <input
              type="text"
              placeholder="Search company, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '8px 12px 8px 36px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-dim)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '8px 14px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL" style={{ background: '#0f172a' }}>All Statuses</option>
              <option value="Applied" style={{ background: '#0f172a' }}>Applied</option>
              <option value="Review Required" style={{ background: '#0f172a' }}>Review Required</option>
              <option value="Skipped" style={{ background: '#0f172a' }}>Skipped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem'
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-glass)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '12px 16px' }}>Company & Role</th>
              <th style={{ padding: '12px 16px' }}>Platform</th>
              <th style={{ padding: '12px 16px' }}>Match Score</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Response State</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No applications found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const isApplied = app.status === 'Applied';
                const isReview = app.status === 'Review Required';
                
                return (
                  <tr key={app.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{app.company}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.title} ({app.location})</div>
                    </td>

                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                      {app.platform}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className={`match-score ${
                        app.matchScore >= 90 ? 'match-high' : app.matchScore >= 75 ? 'match-med' : 'match-low'
                      }`}>
                        {app.matchScore}%
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${
                        isApplied ? 'badge-applied' : isReview ? 'badge-review' : 'badge-skipped'
                      }`}>
                        {isApplied ? <CheckCircle2 size={12} /> : isReview ? <AlertTriangle size={12} /> : <FastForward size={12} />}
                        {app.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>
                      <span style={{
                        color: (app.responseStatus || '').includes('Interview') || (app.responseStatus || '').includes('Offer') 
                          ? '#34d399' 
                          : 'var(--text-muted)'
                      }}>
                        {app.responseStatus || app.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {app.dateStr}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setHrEmailJob(app)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--accent-purple)' }}
                          title="Generate Recruiter HR Outreach Email"
                        >
                          <Mail size={13} /> Outreach HR
                        </button>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        >
                          <Info size={13} /> Details
                        </button>
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ padding: '6px 10px', color: 'var(--accent-cyan)' }}
                          title="Open Job Link"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* HR Outreach Modal */}
      {hrEmailJob && (() => {
        const outreach = generateHROutreachEmail(hrEmailJob);
        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            zIndex: 100,
            padding: '20px'
          }}>
            <div className="glass-panel" style={{
              width: '100%',
              maxWidth: '640px',
              padding: '28px',
              position: 'relative'
            }}>
              <button
                onClick={() => setHrEmailJob(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <Mail size={22} color="var(--accent-purple)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Recruiter / HR Cold Email Generator
                </h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Customized pitch for <strong>{hrEmailJob.company}</strong> ({hrEmailJob.title}) highlighting PwC OT Cybersecurity & ML background.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>EMAIL SUBJECT</label>
                <input
                  type="text"
                  readOnly
                  value={outreach.subject}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>EMAIL BODY</label>
                <textarea
                  readOnly
                  rows={10}
                  value={outreach.body}
                  style={{
                    width: '100%',
                    background: '#040711',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#e2e8f0',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.825rem',
                    lineHeight: 1.5,
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Subject: ${outreach.subject}\n\n${outreach.body}`);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2500);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                  {copiedEmail ? 'Copied to Clipboard!' : 'Copy HR Email Draft'}
                </button>
                <button onClick={() => setHrEmailJob(null)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Detail Modal Drawer */}
      {selectedApp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedApp(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>
              {selectedApp.company}
            </h3>
            <p style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
              {selectedApp.title}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}>
              <div><strong>Match Score:</strong> {selectedApp.matchScore}%</div>
              <div><strong>Platform:</strong> {selectedApp.platform}</div>
              <div><strong>Location:</strong> {selectedApp.location}</div>
              <div><strong>Status:</strong> {selectedApp.status}</div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Applied At:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Agent Execution Notes:</h4>
              <div className="code-box">{selectedApp.notes}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <a
                href={selectedApp.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                View Posting <ExternalLink size={14} />
              </a>
              <button onClick={() => setSelectedApp(null)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
