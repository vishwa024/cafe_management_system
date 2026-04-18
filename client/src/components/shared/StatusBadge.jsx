// components/shared/StatusBadge.jsx
import React, { useEffect } from 'react';

// ─── Inject Bootstrap-like utility CSS once ───────────────────────────────────
const GLOBAL_CSS = `
  .rc-form-control {
    display: block; width: 100%; padding: 8px 12px;
    font-size: 14px; line-height: 1.5; color: #111827;
    background: #fff; border: 1px solid #d1d5db;
    border-radius: 8px; outline: none; transition: border-color .15s, box-shadow .15s;
    box-sizing: border-box;
  }
  .rc-form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
  .rc-form-control::placeholder { color: #9ca3af; }
  .rc-form-select {
    display: block; width: 100%; padding: 8px 12px;
    font-size: 14px; color: #111827; background: #fff;
    border: 1px solid #d1d5db; border-radius: 8px;
    outline: none; appearance: none; cursor: pointer;
    box-sizing: border-box;
  }
  .rc-form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
  .rc-form-label {
    display: block; margin-bottom: 5px;
    font-size: 12px; font-weight: 600; color: #374151;
  }
  .rc-form-group { margin-bottom: 16px; }
  .rc-form-text { font-size: 11px; color: #6b7280; margin-top: 4px; display: block; }
  .rc-row { display: flex; flex-wrap: wrap; margin: -6px; }
  .rc-col { padding: 6px; box-sizing: border-box; }
  .rc-col-12 { width: 100%; }
  .rc-col-6  { width: 50%; }
  .rc-col-4  { width: 33.333%; }
  .rc-col-3  { width: 25%; }
  .rc-col-8  { width: 66.666%; }
  @media (max-width: 480px) {
    .rc-col-6, .rc-col-4, .rc-col-3, .rc-col-8 { width: 100%; }
  }
  /* Buttons */
  .rc-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 8px 18px; font-size: 14px; font-weight: 500;
    border-radius: 8px; border: none; cursor: pointer;
    transition: opacity .15s, transform .1s; line-height: 1.4;
  }
  .rc-btn:active { transform: scale(0.97); }
  .rc-btn:disabled { opacity: .55; cursor: not-allowed; }
  .rc-btn-primary   { background: #3b82f6; color: #fff; }
  .rc-btn-primary:hover:not(:disabled) { background: #2563eb; }
  .rc-btn-secondary { background: #e5e7eb; color: #374151; }
  .rc-btn-secondary:hover:not(:disabled) { background: #d1d5db; }
  .rc-btn-success   { background: #10b981; color: #fff; }
  .rc-btn-success:hover:not(:disabled) { background: #059669; }
  .rc-btn-danger    { background: #ef4444; color: #fff; }
  .rc-btn-danger:hover:not(:disabled) { background: #dc2626; }
  .rc-btn-warning   { background: #f59e0b; color: #fff; }
  .rc-btn-warning:hover:not(:disabled) { background: #d97706; }
  .rc-btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 6px; }
  .rc-btn-xs { padding: 3px 9px; font-size: 11px; border-radius: 5px; }
  .rc-btn-outline-primary   { background: transparent; color: #3b82f6; border: 1px solid #3b82f6; }
  .rc-btn-outline-primary:hover:not(:disabled) { background: #eff6ff; }
  .rc-btn-outline-success   { background: transparent; color: #10b981; border: 1px solid #10b981; }
  .rc-btn-outline-success:hover:not(:disabled) { background: #f0fdf4; }
  .rc-btn-outline-warning   { background: transparent; color: #f59e0b; border: 1px solid #f59e0b; }
  .rc-btn-outline-warning:hover:not(:disabled) { background: #fffbeb; }
  .rc-btn-outline-danger    { background: transparent; color: #ef4444; border: 1px solid #ef4444; }
  .rc-btn-outline-danger:hover:not(:disabled) { background: #fef2f2; }
  /* Table */
  .rc-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .rc-table th {
    text-align: left; padding: 10px 14px;
    background: #f9fafb; color: #6b7280;
    font-size: 12px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .4px; border-bottom: 1px solid #e5e7eb;
  }
  .rc-table td { padding: 11px 14px; border-bottom: 1px solid #f3f4f6; color: #111827; vertical-align: middle; }
  .rc-table tr:last-child td { border-bottom: none; }
  .rc-table tr:hover td { background: #f9fafb; }
  .rc-table-danger td { background: #fff1f2 !important; }
  /* Misc */
  .rc-badge {
    display: inline-block; padding: 3px 10px; border-radius: 999px;
    font-size: 11px; font-weight: 600; letter-spacing: .3px;
  }
  .rc-alert {
    padding: 12px 16px; border-radius: 10px;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; font-size: 13px;
  }
  .rc-alert-warning { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
  .rc-alert-danger  { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
  .rc-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.08); overflow: hidden; }
`;

function GlobalStyles() {
    useEffect(() => {
        const id = 'rc-global-styles';
        if (!document.getElementById(id)) {
            const tag = document.createElement('style');
            tag.id = id;
            tag.textContent = GLOBAL_CSS;
            document.head.appendChild(tag);
        }
    }, []);
    return null;
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const statusColors = {
    Pending:   { bg: '#fff3cd', color: '#856404' },
    Preparing: { bg: '#cfe2ff', color: '#0a3f8c' },
    Ready:     { bg: '#ede9fe', color: '#5b21b6' },
    Completed: { bg: '#d1e7dd', color: '#0a3622' },
    Cancelled: { bg: '#f8d7da', color: '#842029' },
    active:    { bg: '#d1e7dd', color: '#0a3622' },
    inactive:  { bg: '#e2e3e5', color: '#41464b' },
};

export function StatusBadge({ status }) {
    const c = statusColors[status] || { bg: '#e2e3e5', color: '#41464b' };
    return (
        <span className="rc-badge" style={{ background: c.bg, color: c.color }}>{status}</span>
    );
}

// ─── KPICard ──────────────────────────────────────────────────────────────────
export function KPICard({ label, value, icon, color = 'primary', subtitle }) {
    const colorMap = {
        primary: { bg: '#e7f0ff', text: '#1a56db' },
        success: { bg: '#d1fae5', text: '#065f46' },
        warning: { bg: '#fef3c7', text: '#92400e' },
        danger:  { bg: '#fee2e2', text: '#991b1b' },
        info:    { bg: '#e0f2fe', text: '#0369a1' },
        purple:  { bg: '#ede9fe', text: '#5b21b6' },
    };
    const c = colorMap[color] || colorMap.primary;
    return (
        <>
            <GlobalStyles />
            <div style={{ background:'#fff', borderRadius:'14px', boxShadow:'0 2px 12px rgba(0,0,0,.08)', padding:'20px', display:'flex', alignItems:'center', gap:'16px', height:'100%' }}>
                <div style={{ borderRadius:'12px', padding:'12px', background:c.bg, fontSize:'28px', flexShrink:0 }}>{icon}</div>
                <div>
                    <div style={{ fontSize:'26px', fontWeight:700, color:c.text, lineHeight:1 }}>{value}</div>
                    <div style={{ color:'#6b7280', fontSize:'13px', marginTop:'4px' }}>{label}</div>
                    {subtitle && <div style={{ color:'#9ca3af', fontSize:'11px', marginTop:'2px' }}>{subtitle}</div>}
                </div>
            </div>
        </>
    );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
    return (
        <>
            <GlobalStyles />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'8px' }}>
                <div>
                    <h4 style={{ fontWeight:700, margin:0, fontSize:'20px', color:'#111827' }}>{title}</h4>
                    {subtitle && <p style={{ color:'#6b7280', fontSize:'13px', margin:'4px 0 0' }}>{subtitle}</p>}
                </div>
                <div style={{ display:'flex', gap:'8px' }}>{children}</div>
            </div>
        </>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ show, title, onClose, children, size = '' }) {
    if (!show) return null;
    const maxWidth = size === 'lg' ? '860px' : size === 'xl' ? '1100px' : '540px';
    return (
        <>
            <GlobalStyles />
            <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1040 }} onClick={onClose} />
            <div style={{ position:'fixed', inset:0, zIndex:1050, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
                <div style={{ background:'#fff', borderRadius:'16px', boxShadow:'0 8px 40px rgba(0,0,0,.18)', width:'100%', maxWidth, maxHeight:'90vh', overflowY:'auto' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid #f0f0f0' }}>
                        <h5 style={{ margin:0, fontWeight:600, fontSize:'16px' }}>{title}</h5>
                        <button style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#999', lineHeight:1, padding:'0 4px' }} onClick={onClose}>✕</button>
                    </div>
                    <div style={{ padding:'20px 24px' }}>{children}</div>
                </div>
            </div>
        </>
    );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', message = 'No data found' }) {
    return (
        <div style={{ textAlign:'center', padding:'48px 24px', color:'#9ca3af' }}>
            <div style={{ fontSize:'52px', marginBottom:'12px' }}>{icon}</div>
            <p style={{ margin:0, fontSize:'14px' }}>{message}</p>
        </div>
    );
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
export function LoadingSpinner() {
    return (
        <>
            <GlobalStyles />
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'48px' }}>
                <div style={{ width:'36px', height:'36px', border:'3px solid #e5e7eb', borderTop:'3px solid #3b82f6', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </>
    );
}

// ─── AlertBox ─────────────────────────────────────────────────────────────────
export function AlertBox({ type = 'info', children, onClose }) {
    const colorMap = {
        info:    { bg:'#e0f2fe', border:'#bae6fd', color:'#0369a1' },
        success: { bg:'#d1fae5', border:'#6ee7b7', color:'#065f46' },
        warning: { bg:'#fef3c7', border:'#fcd34d', color:'#92400e' },
        danger:  { bg:'#fee2e2', border:'#fca5a5', color:'#991b1b' },
    };
    const c = colorMap[type] || colorMap.info;
    return (
        <div style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.color, borderRadius:'10px', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
            <div>{children}</div>
            {onClose && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:c.color, fontSize:'16px', padding:'0 0 0 12px' }}>✕</button>}
        </div>
    );
}