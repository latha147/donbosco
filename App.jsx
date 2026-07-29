import { useState, useEffect, useCallback } from "react";

const API = "";

async function api(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    return res.json();
  } catch(e) {
    console.error("API Error:", e);
    return {};
  }
}

const Icon = {
  Home: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>),
  Students: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>),
  Teachers: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>),
  Attendance: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>),
  Departments: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M1 11v10h6v-5h2v5h6V11L8 6l-7 5zm12 8h-2v-5H7v5H5v-7l3-2.18L11 12v7h2v-1zm6-14V3h-2v2h-3v6h8V5h-3zm1 4h-4V7h4v2z"/></svg>),
  Logout: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>),
  Search: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>),
  Send: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>),
  Check: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>),
  Close: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>),
  ChevronDown: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>),
  Report: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>),
  // ── NEW ICONS ──
  Calendar: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/><path d="M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>),
  Timetable: () => (<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/></svg>),
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; background: #f0f4f8; }
  .sidebar { width: 240px; min-height: 100vh; background: linear-gradient(180deg, #1565c0, #0d47a1); display: flex; flex-direction: column; position: fixed; left: 0; top: 0; z-index: 100; box-shadow: 4px 0 15px rgba(0,0,0,0.2); }
  .sidebar-logo { padding: 24px 16px 16px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.15); }
  .sidebar-logo h2 { color: #fff; font-size: 16px; font-weight: 700; line-height: 1.3; }
  .sidebar-logo p { color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 4px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 13px 20px; color: rgba(255,255,255,0.8); cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; font-size: 14px; font-weight: 500; }
  .nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .nav-item.active { background: rgba(255,255,255,0.18); color: #fff; border-left-color: #ffd600; }
  .logout-btn { margin-top: auto; margin: auto 16px 16px; padding: 12px; background: #f44336; color: #fff; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; font-size: 14px; font-weight: 600; transition: background 0.2s; }
  .logout-btn:hover { background: #d32f2f; }
  .main { margin-left: 240px; padding: 24px; min-height: 100vh; }
  .page-header { background: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; }
  .page-header h1 { font-size: 22px; font-weight: 700; color: #1a237e; }
  .page-header p { color: #666; font-size: 13px; margin-top: 2px; }
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid; display: flex; flex-direction: column; gap: 6px; }
  .stat-card .label { font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
  .stat-card .value { font-size: 32px; font-weight: 700; color: #1a237e; }
  .stat-card .sub { font-size: 12px; color: #666; }
  .table-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; }
  .table-toolbar { padding: 16px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #eee; flex-wrap: wrap; }
  .search-box { display: flex; align-items: center; gap: 8px; background: #f5f7fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px 14px; flex: 1; max-width: 320px; }
  .search-box input { border: none; background: none; outline: none; font-family: inherit; font-size: 14px; width: 100%; }
  select.filter-select { padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f5f7fa; font-family: inherit; font-size: 14px; outline: none; cursor: pointer; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f5f7fa; padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: .5px; }
  td { padding: 12px 16px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafbff; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-present { background: #e8f5e9; color: #2e7d32; }
  .badge-absent { background: #ffebee; color: #c62828; }
  .badge-informed { background: #e3f2fd; color: #1565c0; }
  .badge-uninformed { background: #fff3e0; color: #e65100; }
  .badge-year { background: #ede7f6; color: #4527a0; }
  .badge-theory { background: #e3f2fd; color: #1565c0; }
  .badge-practical { background: #e8f5e9; color: #2e7d32; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  .btn-primary { background: #1565c0; color: #fff; } .btn-primary:hover { background: #0d47a1; }
  .btn-success { background: #2e7d32; color: #fff; } .btn-success:hover { background: #1b5e20; }
  .btn-warning { background: #f57c00; color: #fff; } .btn-warning:hover { background: #e65100; }
  .att-toggle { display: flex; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; }
  .att-toggle button { flex: 1; padding: 6px 14px; border: none; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; transition: all 0.15s; }
  .att-toggle .t-present { background: #e8f5e9; color: #2e7d32; } .att-toggle .t-present.active { background: #2e7d32; color: #fff; }
  .att-toggle .t-absent { background: #ffebee; color: #c62828; } .att-toggle .t-absent.active { background: #c62828; color: #fff; }
  .informed-sel { padding: 5px 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px; font-family: inherit; background: #f9f9f9; }
  .staff-section { margin-top: 16px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
  .staff-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #1565c0; color: #fff; cursor: pointer; font-weight: 600; font-size: 14px; user-select: none; }
  .staff-header .arrow { transition: transform 0.3s; } .staff-header .arrow.open { transform: rotate(180deg); }
  .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 12px; padding: 16px; background: #fff; }
  .staff-card { border: 1px solid #e8eaf6; border-radius: 10px; padding: 14px; background: linear-gradient(135deg, #e8eaf6, #fff); }
  .staff-card .s-name { font-weight: 700; font-size: 13px; color: #1a237e; }
  .staff-card .s-subject { font-size: 11px; color: #666; margin-top: 2px; }
  .staff-card .s-dept { font-size: 11px; color: #1565c0; font-weight: 600; margin-top: 4px; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a237e 0%, #1565c0 50%, #0288d1 100%); }
  .login-card { background: #fff; border-radius: 20px; padding: 40px; width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .login-card h1 { font-size: 26px; font-weight: 800; color: #1a237e; text-align: center; }
  .login-card p { color: #888; text-align: center; font-size: 13px; margin: 6px 0 28px; }
  .form-group { margin-bottom: 18px; }
  .form-group label { display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 6px; text-transform: uppercase; }
  .form-group input { width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-family: inherit; font-size: 14px; outline: none; transition: border 0.2s; }
  .form-group input:focus { border-color: #1565c0; }
  .login-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #1565c0, #0d47a1); color: #fff; border: none; border-radius: 10px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
  .login-btn:hover { opacity: 0.9; }
  .login-error { background: #ffebee; color: #c62828; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; text-align: center; }
  .toast { position: fixed; top: 24px; right: 24px; background: #212121; color: #fff; padding: 14px 20px; border-radius: 10px; font-size: 14px; z-index: 9999; box-shadow: 0 8px 20px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease; }
  .toast.success { background: #1b5e20; } .toast.error { background: #b71c1c; }
  @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  input[type="date"] { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; font-size: 14px; background: #f5f7fa; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
  .modal { background: #fff; border-radius: 16px; padding: 28px; max-width: 560px; width: 90%; max-height: 80vh; overflow-y: auto; }
  .modal h3 { font-size: 18px; font-weight: 700; color: #1a237e; margin-bottom: 16px; }
  .msg-row { padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 10px; font-size: 13px; }
  .msg-row .m-name { font-weight: 700; color: #1a237e; } .msg-row .m-msg { color: #555; margin-top: 4px; font-size: 12px; }
  .pagination { display: flex; align-items: center; gap: 8px; padding: 16px 20px; justify-content: flex-end; border-top: 1px solid #eee; }
  .page-btn { padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background: #fff; font-size: 13px; }
  .page-btn.active { background: #1565c0; color: #fff; border-color: #1565c0; }
  .page-btn:hover:not(.active) { background: #f5f7fa; }

  /* ══════════════════════════════════════════════
     MONTHLY ATTENDANCE STYLES
  ══════════════════════════════════════════════ */
  .ma-tabs { display: flex; gap: 0; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px; }
  .ma-tab { padding: 10px 22px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; color: #888; border-bottom: 3px solid transparent; margin-bottom: -2px; font-family: inherit; transition: all 0.2s; }
  .ma-tab.active { color: #1565c0; border-bottom-color: #1565c0; }

  .ma-summary-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 20px; }
  .ma-sum-card { background: #fff; border-radius: 12px; padding: 16px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid; }
  .ma-sum-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .5px; }
  .ma-sum-value { font-size: 28px; font-weight: 700; margin-top: 4px; }

  .ma-cal-nav { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
  .ma-month-label { font-size: 17px; font-weight: 700; color: #1a237e; min-width: 180px; text-align: center; }
  .ma-nav-btn { padding: 7px 16px; font-size: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fff; cursor: pointer; color: #333; font-family: inherit; }
  .ma-nav-btn:hover { background: #f0f4f8; }

  .ma-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
  .ma-leg { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
  .ma-leg-green  { background: #e8f5e9; color: #2e7d32; }
  .ma-leg-yellow { background: #fff8e1; color: #f57c00; }
  .ma-leg-red    { background: #ffebee; color: #c62828; }
  .ma-leg-gray   { background: #f5f5f5; color: #757575; }
  .ma-leg-blue   { background: #e3f2fd; color: #1565c0; }

  .ma-cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 6px; margin-bottom: 20px; }
  .ma-day-lbl { text-align: center; font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: .5px; padding: 6px 0; }
  .ma-cell { border: 1.5px solid #e8eaf0; border-radius: 10px; padding: 8px; min-height: 74px; background: #fff; cursor: pointer; transition: all 0.15s; display: flex; flex-direction: column; gap: 3px; }
  .ma-cell:hover { border-color: #90a4ae; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .ma-cell-empty { background: #f8fafc; border-color: transparent; cursor: default; }
  .ma-cell-empty:hover { border-color: transparent; box-shadow: none; }
  .ma-cell-holiday { background: #fffde7; border-color: #fff176; cursor: default; }
  .ma-cell-holiday:hover { border-color: #fff176; box-shadow: none; }
  .ma-cell-green  { background: #f1f8e9; border-color: #c5e1a5; }
  .ma-cell-yellow { background: #fff8e1; border-color: #ffe082; }
  .ma-cell-red    { background: #fce4ec; border-color: #f48fb1; }
  .ma-cell-today  { border-color: #1565c0 !important; border-width: 2px; }
  .ma-cell-selected { box-shadow: 0 0 0 3px rgba(21,101,192,0.3) !important; }
  .ma-day-num { font-size: 13px; font-weight: 700; color: #333; }
  .ma-cell-today .ma-day-num { color: #1565c0; }
  .ma-pill-p { font-size: 10px; font-weight: 600; color: #2e7d32; }
  .ma-pill-a { font-size: 10px; font-weight: 600; color: #c62828; }
  .ma-holiday-txt { font-size: 9px; color: #f57c00; font-weight: 600; line-height: 1.3; }

  .ma-detail-box { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); padding: 20px 24px; margin-bottom: 20px; border-left: 4px solid #1565c0; }
  .ma-detail-title { font-size: 16px; font-weight: 700; color: #1a237e; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
  .ma-detail-close { background: none; border: none; font-size: 18px; color: #aaa; cursor: pointer; }
  .ma-detail-stats { display: flex; gap: 28px; flex-wrap: wrap; margin-bottom: 14px; }
  .ma-ds { display: flex; flex-direction: column; }
  .ma-ds-num { font-size: 26px; font-weight: 700; }
  .ma-ds-lbl { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; }
  .ma-goto-btn { padding: 9px 18px; background: #1565c0; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; }
  .ma-goto-btn:hover { background: #0d47a1; }

  .ma-report-bar { display: flex; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
  .ma-search { padding: 9px 14px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; font-size: 14px; background: #f5f7fa; outline: none; width: 260px; }
  .ma-search:focus { border-color: #1565c0; }
  .ma-report-meta { font-size: 13px; color: #888; display: flex; align-items: center; }

  .ma-rep-head { display: grid; grid-template-columns: 90px 1fr 80px 80px 150px; gap: 8px; padding: 10px 16px; background: #f5f7fa; font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: .5px; border-radius: 8px 8px 0 0; }
  .ma-rep-row  { display: grid; grid-template-columns: 90px 1fr 80px 80px 150px; gap: 8px; padding: 12px 16px; align-items: center; border-bottom: 1px solid #f0f0f0; font-size: 13px; transition: background 0.1s; }
  .ma-rep-row:hover { background: #fafbff; }
  .ma-rep-row:last-child { border-bottom: none; }
  .ma-pct-wrap { display: flex; align-items: center; gap: 8px; }
  .ma-pct-bar  { flex: 1; height: 7px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
  .ma-pct-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
  .ma-pct-txt  { font-size: 12px; font-weight: 700; min-width: 38px; text-align: right; }

  /* ══════════════════════════════════════════════
     TIMETABLE STYLES
  ══════════════════════════════════════════════ */
  .tt-load-bar { display: flex; gap: 10px; flex-wrap: wrap; padding: 12px 18px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px; }
  .tt-load-item { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 14px; background: #f0f4f8; border-radius: 8px; }
  .tt-load-name { font-size: 11px; font-weight: 700; color: #555; }
  .tt-load-num  { font-size: 14px; font-weight: 700; color: #1a237e; }

  .tt-wrap { overflow-x: auto; }
  .tt-grid { display: grid; grid-template-columns: 110px repeat(6,1fr); border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; min-width: 800px; }
  .tt-th { padding: 10px 6px; background: #f5f7fa; font-size: 11px; font-weight: 700; color: #666; text-align: center; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
  .tt-th:last-child { border-right: none; }
  .tt-th-today { background: #e3f2fd; color: #1565c0; }
  .tt-break { grid-column: 1 / -1; display: flex; align-items: center; gap: 16px; padding: 6px 14px; background: #fffde7; border-top: 1px solid #fff176; border-bottom: 1px solid #fff176; }
  .tt-break-time { font-size: 11px; color: #f57c00; font-weight: 600; min-width: 110px; }
  .tt-break-lbl  { font-size: 12px; color: #f57c00; font-weight: 700; }
  .tt-time-cell  { padding: 6px 10px; font-size: 11px; color: #888; display: flex; align-items: center; border-right: 1px solid #e0e0e0; border-top: 1px solid #f0f0f0; background: #fafbff; line-height: 1.4; font-weight: 600; }
  .tt-cell { border-right: 1px solid #eeeeee; border-top: 1px solid #f0f0f0; padding: 5px; min-height: 68px; display: flex; align-items: stretch; }
  .tt-cell:last-child { border-right: none; }
  .tt-slot { border-radius: 8px; padding: 7px 9px; width: 100%; display: flex; flex-direction: column; gap: 2px; }
  .tt-slot-sub  { font-size: 11px; font-weight: 700; line-height: 1.3; }
  .tt-slot-tea  { font-size: 10px; opacity: 0.8; }
  .tt-slot-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 3px; }
  .tt-slot-type { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; opacity: 0.75; }
  .tt-slot-acts { display: flex; gap: 3px; opacity: 0; transition: opacity 0.15s; }
  .tt-slot:hover .tt-slot-acts { opacity: 1; }
  .tt-act-btn { padding: 1px 5px; font-size: 11px; border-radius: 4px; border: none; cursor: pointer; background: rgba(255,255,255,0.6); }
  .tt-empty-btn { width: 100%; height: 100%; min-height: 56px; background: none; border: 2px dashed #e0e0e0; border-radius: 8px; color: #ccc; font-size: 20px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
  .tt-empty-btn:hover { border-color: #1565c0; color: #1565c0; background: #e3f2fd; }

  .slot-blue   { background: #e3f2fd; color: #1565c0; }
  .slot-green  { background: #e8f5e9; color: #2e7d32; }
  .slot-purple { background: #ede7f6; color: #6a1b9a; }
  .slot-amber  { background: #fff8e1; color: #f57c00; }
  .slot-teal   { background: #e0f2f1; color: #00695c; }

  .tt-leg { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .tt-leg-item { font-size: 11px; font-weight: 600; padding: 3px 12px; border-radius: 20px; }

  .tt-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .tt-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 430px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
  .tt-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f0f0f0; }
  .tt-modal-title { font-size: 16px; font-weight: 700; color: #1a237e; }
  .tt-modal-close { background: none; border: none; font-size: 18px; color: #aaa; cursor: pointer; }
  .tt-modal-body  { padding: 18px 22px; display: flex; flex-direction: column; gap: 14px; }
  .tt-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .5px; margin-bottom: -8px; }
  .tt-input { padding: 10px 12px; font-size: 14px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333; width: 100%; font-family: inherit; outline: none; background: #f9f9f9; }
  .tt-input:focus { border-color: #1565c0; background: #fff; }
  .tt-type-row { display: flex; gap: 8px; }
  .tt-type-btn { flex: 1; padding: 8px; font-size: 13px; font-weight: 600; border: 1.5px solid #e0e0e0; border-radius: 8px; background: #fff; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .tt-type-btn.sel { border-color: #1565c0; background: #e3f2fd; color: #1565c0; }
  .tt-modal-foot { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 22px; border-top: 1px solid #f0f0f0; }
  .tt-btn-cancel { padding: 9px 18px; font-size: 13px; font-weight: 600; border: 1px solid #ddd; border-radius: 8px; background: #fff; color: #555; cursor: pointer; font-family: inherit; }
  .tt-btn-save   { padding: 9px 20px; font-size: 13px; font-weight: 600; border: none; border-radius: 8px; background: #1565c0; color: #fff; cursor: pointer; font-family: inherit; }
  .tt-btn-save:hover { background: #0d47a1; }
  .tt-btn-del    { padding: 9px 20px; font-size: 13px; font-weight: 600; border: none; border-radius: 8px; background: #c62828; color: #fff; cursor: pointer; font-family: inherit; }
  .tt-btn-del:hover { background: #b71c1c; }
`;

// ═══════════════════════════════════════════
// CONSTANTS (shared by Monthly & Timetable)
// ═══════════════════════════════════════════
const MONTHS_LIST = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_FULL   = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT  = ["Mon","Tue","Wed","Thu","Fri","Sat"];

const TIME_SLOTS = [
  { id:"t1", label:"8:00 – 9:00",   type:"class" },
  { id:"t2", label:"9:00 – 10:00",  type:"class" },
  { id:"t3", label:"10:00 – 10:15", type:"break", lbl:"Short Break" },
  { id:"t4", label:"10:15 – 11:15", type:"class" },
  { id:"t5", label:"11:15 – 12:15", type:"class" },
  { id:"t6", label:"12:15 – 1:00",  type:"break", lbl:"Lunch Break" },
  { id:"t7", label:"1:00 – 2:00",   type:"class" },
  { id:"t8", label:"2:00 – 3:00",   type:"class" },
];

const SUBJECT_COLORS = {
  "Agricultural Economics": "slot-blue",
  "Soil Science":           "slot-green",
  "Farm Management":        "slot-purple",
  "Statistics":             "slot-amber",
  "Lab":                    "slot-teal",
};

const INIT_TT_SLOTS = {
  "t1_0":{ subject:"Agricultural Economics", teacher:"Dr. Rajkumar", type:"Theory" },
  "t1_1":{ subject:"Soil Science",           teacher:"Mrs. Priya",   type:"Practical" },
  "t1_2":{ subject:"Farm Management",        teacher:"Mr. Kumar",    type:"Theory" },
  "t1_3":{ subject:"Agricultural Economics", teacher:"Dr. Rajkumar", type:"Theory" },
  "t1_4":{ subject:"Statistics",             teacher:"Mrs. Latha",   type:"Theory" },
  "t2_0":{ subject:"Farm Management",        teacher:"Mr. Kumar",    type:"Theory" },
  "t2_1":{ subject:"Agricultural Economics", teacher:"Dr. Rajkumar", type:"Theory" },
  "t2_2":{ subject:"Soil Science",           teacher:"Mrs. Priya",   type:"Practical" },
  "t2_3":{ subject:"Statistics",             teacher:"Mrs. Latha",   type:"Theory" },
  "t2_4":{ subject:"Farm Management",        teacher:"Mr. Kumar",    type:"Theory" },
  "t2_5":{ subject:"Soil Science",           teacher:"Mrs. Priya",   type:"Lab" },
  "t4_0":{ subject:"Statistics",             teacher:"Mrs. Latha",   type:"Theory" },
  "t4_1":{ subject:"Farm Management",        teacher:"Mr. Kumar",    type:"Practical" },
  "t4_2":{ subject:"Agricultural Economics", teacher:"Dr. Rajkumar", type:"Theory" },
  "t4_3":{ subject:"Soil Science",           teacher:"Mrs. Priya",   type:"Theory" },
  "t4_4":{ subject:"Agricultural Economics", teacher:"Dr. Rajkumar", type:"Theory" },
  "t4_5":{ subject:"Statistics",             teacher:"Mrs. Latha",   type:"Theory" },
  "t5_0":{ subject:"Soil Science",           teacher:"Mrs. Priya",   type:"Theory" },
  "t5_1":{ subject:"Statistics",             teacher:"Mrs. Latha",   type:"Theory" },
  "t5_2":{ subject:"Farm Management",        teacher:"Mr. Kumar",    type:"Theory" },
  "t5_3":{ subject:"Agricultural Economics", teacher:"Dr. Rajkumar", type:"Practical" },
  "t5_4":{ subject:"Soil Science",           teacher:"Mrs. Priya",   type:"Practical" },
  "t7_0":{ subject:"Lab",                    teacher:"Mrs. Priya",   type:"Lab" },
  "t7_2":{ subject:"Lab",                    teacher:"Mrs. Latha",   type:"Lab" },
  "t7_4":{ subject:"Lab",                    teacher:"Mr. Kumar",    type:"Lab" },
  "t8_0":{ subject:"Lab",                    teacher:"Mrs. Priya",   type:"Lab" },
  "t8_2":{ subject:"Lab",                    teacher:"Mrs. Latha",   type:"Lab" },
  "t8_4":{ subject:"Lab",                    teacher:"Mr. Kumar",    type:"Lab" },
};

// ═══════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  if (!msg) return null;
  return <div className={`toast ${type}`}>{type === "success" ? <Icon.Check /> : <Icon.Close />}{msg}</div>;
}

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await api("/api/login/", { method: "POST", body: JSON.stringify(form) });
    setLoading(false);
    if (res.success) onLogin(res);
    else setError(res.message || "Invalid credentials");
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>🏫 Don Bosco College</h1>
        <p>Attendance Management System — Sign In</p>
        {error && <div className="login-error">⚠️ {error}</div>}
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} placeholder="Enter your username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Enter your password" required />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In →"}</button>
        </form>
        <p style={{textAlign:"center",marginTop:"20px",fontSize:"12px",color:"#aaa"}}>Admin: admin / admin123 &nbsp;|&nbsp; Teacher: john.smith / teacher123</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SIDEBAR — added Monthly & Timetable links
// ═══════════════════════════════════════════
function Sidebar({ page, setPage, user, onLogout }) {
  const items = [
    { id: "home",       label: "Home",             Icon: Icon.Home },
    { id: "students",   label: "Students",          Icon: Icon.Students },
    { id: "teachers",   label: "Teachers",          Icon: Icon.Teachers },
    { id: "attendance", label: "Attendance",        Icon: Icon.Attendance },
    { id: "monthly",    label: "Monthly Report",    Icon: Icon.Calendar },   // ← NEW
    { id: "timetable",  label: "Timetable",         Icon: Icon.Timetable },  // ← NEW
    { id: "departments",label: "Departments",       Icon: Icon.Departments },
    { id: "report",     label: "Report",            Icon: Icon.Report },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>🏫 Don Bosco College</h2>
        <p>{user?.name || "Welcome"}</p>
      </div>
      {items.map(({ id, label, Icon: I }) => (
        <div key={id} className={`nav-item${page === id ? " active" : ""}`} onClick={() => setPage(id)}>
          <I /> {label}
        </div>
      ))}
      <button className="logout-btn" onClick={onLogout}><Icon.Logout /> Logout</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// HOME PAGE (unchanged)
// ═══════════════════════════════════════════
function HomePage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api("/api/dashboard/").then(setStats); }, []);
  if (!stats) return <div style={{padding:40,textAlign:"center",color:"#888"}}>Loading dashboard…</div>;
  const cards = [
    { label: "Total Students",    value: stats.total_students,      color: "#1565c0", sub: "All departments" },
    { label: "Total Teachers",    value: stats.total_teachers,      color: "#2e7d32", sub: "All subjects" },
    { label: "Departments",       value: stats.total_departments,   color: "#f57c00", sub: "Active" },
    { label: "Present Today",     value: stats.present_today,       color: "#00897b", sub: stats.date },
    { label: "Absent Today",      value: stats.absent_today,        color: "#c62828", sub: "Today" },
    { label: "Uninformed Absent", value: stats.uninformed_absences, color: "#ad1457", sub: "Need message" },
  ];
  return (
    <>
      <div className="page-header"><div><h1>Dashboard</h1><p>Welcome back! Here's today's overview — {stats.date}</p></div></div>
      <div className="cards-grid">
        {cards.map((c) => (
          <div className="stat-card" style={{borderColor:c.color}} key={c.label}>
            <div className="label">{c.label}</div>
            <div className="value" style={{color:c.color}}>{c.value}</div>
            <div className="sub">{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="table-card" style={{padding:24}}>
        <h3 style={{color:"#1a237e",marginBottom:8}}>📋 Quick Guide</h3>
        <ul style={{paddingLeft:20,color:"#555",fontSize:14,lineHeight:2}}>
          <li><b>Students</b> — Filter by Department, Year, Theory/Practical</li>
          <li><b>Teachers</b> — View all staff members</li>
          <li><b>Attendance</b> — Mark daily attendance</li>
          <li><b>Monthly Report</b> — Calendar view + student-wise % for any month</li>
          <li><b>Timetable</b> — Weekly class schedule, add/edit/delete slots</li>
          <li><b>Departments</b> — View all 6 departments</li>
          <li><b>Report</b> — Monthly attendance percentage</li>
        </ul>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// STUDENTS PAGE (unchanged)
// ═══════════════════════════════════════════
function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [depts, setDepts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;
  const load = useCallback(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (filterDept) q.set("department_id", String(filterDept));
    if (filterYear) q.set("year", String(filterYear));
    if (filterClass) q.set("class_type", filterClass);
    api(`/api/students/?${q}`).then((r) => { setStudents(r.students || []); setPage(1); });
  }, [search, filterDept, filterYear, filterClass]);
  useEffect(() => { api("/api/departments/").then((r) => setDepts(r.departments || [])); }, []);
  useEffect(() => { load(); }, [load]);
  const paginated = students.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(students.length / PER_PAGE);
  return (
    <>
      <div className="page-header"><div><h1>👨‍🎓 Students</h1><p>{students.length} students found</p></div></div>
      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box"><Icon.Search /><input placeholder="Search by name or roll no…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <select className="filter-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="filter-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All Years</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
          </select>
          <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All Classes</option><option value="Theory">📚 Theory</option><option value="Practical">🔬 Practical</option>
          </select>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Year</th><th>Class</th><th>Course</th><th>Department</th><th>DOB</th><th>Email</th><th>Address</th><th>Parent Contact</th><th>Student Contact</th></tr></thead>
            <tbody>
              {paginated.map((s,i) => (
                <tr key={s.id}>
                  <td style={{color:"#888"}}>{(page-1)*PER_PAGE+i+1}</td>
                  <td><b>{s.roll_no}</b></td><td>{s.name}</td>
                  <td><span className="badge badge-year">Year {s.year}</span></td>
                  <td><span className={`badge ${s.class_type==='Theory'?'badge-theory':'badge-practical'}`}>{s.class_type}</span></td>
                  <td style={{fontSize:12}}>{s.course}</td>
                  <td style={{fontSize:12,color:"#1565c0"}}>{s.department_name}</td>
                  <td style={{fontSize:12}}>{s.dob}</td>
                  <td style={{fontSize:11,color:"#555"}}>{s.email}</td>
                  <td style={{fontSize:11,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.address}</td>
                  <td><a href={`tel:${s.parent_contact}`} style={{color:"#1565c0",textDecoration:"none"}}>{s.parent_contact}</a></td>
                  <td><a href={`tel:${s.student_contact}`} style={{color:"#2e7d32",textDecoration:"none"}}>{s.student_contact}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} className={`page-btn${page===p?" active":""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
          </div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// TEACHERS PAGE (unchanged)
// ═══════════════════════════════════════════
function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [staffOpen, setStaffOpen] = useState(true);
  useEffect(() => { api("/api/teachers/").then((r) => setTeachers(r.teachers || [])); }, []);
  return (
    <>
      <div className="page-header"><div><h1>👩‍🏫 Teachers</h1><p>{teachers.length} staff members</p></div></div>
      <div className="table-card">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Department</th><th>Subject</th><th>Phone</th></tr></thead>
            <tbody>
              {teachers.map((t,i) => (
                <tr key={t.id}>
                  <td style={{color:"#888"}}>{i+1}</td><td><b>{t.name}</b></td>
                  <td style={{fontSize:12,color:"#555"}}>{t.email}</td>
                  <td style={{color:"#1565c0",fontSize:12}}>{t.department_name}</td>
                  <td style={{fontSize:12}}>{t.subject}</td>
                  <td><a href={`tel:${t.phone}`} style={{color:"#2e7d32",textDecoration:"none"}}>{t.phone}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="staff-section" style={{marginTop:24}}>
        <div className="staff-header" onClick={() => setStaffOpen(!staffOpen)}>
          <span>👥 Staff Directory (Card View)</span>
          <span className={`arrow${staffOpen?" open":""}`}><Icon.ChevronDown /></span>
        </div>
        {staffOpen && (
          <div className="staff-grid">
            {teachers.map((t) => (
              <div className="staff-card" key={t.id}>
                <div className="s-name">{t.name}</div>
                <div className="s-subject">📚 {t.subject}</div>
                <div className="s-dept">🏛️ {t.department_name}</div>
                <div style={{fontSize:11,color:"#888",marginTop:4}}>📞 {t.phone}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// ATTENDANCE PAGE (unchanged)
// ═══════════════════════════════════════════
function AttendancePage({ toast }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [records, setRecords] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [depts, setDepts] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [msgModal, setMsgModal] = useState(false);
  const [msgResult, setMsgResult] = useState(null);
  const [staffOpen, setStaffOpen] = useState(false);

  useEffect(() => { api("/api/departments/").then((r) => setDepts(r.departments || [])); }, []);
  const loadAttendance = useCallback(() => {
    const q = new URLSearchParams({ date });
    if (filterDept) q.set("department_id", filterDept);
    if (filterYear) q.set("year", filterYear);
    if (filterClass) q.set("class_type", filterClass);
    api(`/api/attendance/?${q}`).then((r) => {
      setRecords(r.attendance || []); setTeachers(r.teachers || []);
      const att = {};
      (r.attendance||[]).forEach((row) => { att[row.id] = { status: row.status||"present", is_informed: row.is_informed||false }; });
      setAttendance(att);
    });
  }, [date, filterDept, filterYear, filterClass]);
  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const toggle = (studentId, field, value) => setAttendance(prev => ({...prev,[studentId]:{...prev[studentId],[field]:value}}));
  const getAtt = (id) => attendance[id] || { status:"present", is_informed:false };

  const saveAll = async () => {
    if (!selectedTeacher) { toast("Please select a teacher first","error"); return; }
    setSaving(true);
    const recs = records.map(r => ({ student_id:r.id, status:getAtt(r.id).status, is_informed:getAtt(r.id).is_informed }));
    const res = await api("/api/attendance/save/", { method:"POST", body:JSON.stringify({ date, teacher_id:selectedTeacher, records:recs }) });
    setSaving(false);
    if (res.success) toast(`Saved ${res.saved} attendance records!`,"success");
    else toast("Failed to save","error");
  };

  const sendMessages = async () => {
    const res = await api("/api/attendance/send-messages/", { method:"POST", body:JSON.stringify({ date }) });
    setMsgResult(res); setMsgModal(true);
  };

  const absentCount    = records.filter(r => getAtt(r.id).status==="absent").length;
  const presentCount   = records.filter(r => getAtt(r.id).status==="present").length;
  const uninformedCount= records.filter(r => getAtt(r.id).status==="absent" && !getAtt(r.id).is_informed).length;

  return (
    <>
      <div className="page-header">
        <div><h1>📅 Attendance</h1><p>{records.length} students | Present: {presentCount} | Absent: {absentCount} | Uninformed: {uninformedCount}</p></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button className="btn btn-success" onClick={saveAll} disabled={saving}><Icon.Check /> {saving?"Saving…":"Save Attendance"}</button>
          <button className="btn btn-warning" onClick={sendMessages}><Icon.Send /> Send Parent Messages</button>
        </div>
      </div>
      <div className="table-card" style={{padding:"14px 20px",marginBottom:16,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <label style={{fontSize:13,fontWeight:600,color:"#555"}}>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label style={{fontSize:13,fontWeight:600,color:"#555"}}>Teacher:</label>
        <select className="filter-select" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="">-- Select Teacher --</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
        </select>
        <select className="filter-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="filter-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">All Years</option><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
        </select>
        <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">All Classes</option><option value="Theory">📚 Theory</option><option value="Practical">🔬 Practical</option>
        </select>
      </div>
      <div className="table-card">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Class</th><th>Department</th><th>Present / Absent</th><th>Informed?</th><th>Parent Contact</th></tr></thead>
            <tbody>
              {records.map((r,i) => {
                const att = getAtt(r.id);
                return (
                  <tr key={r.id} style={{background:att.status==="absent"?"#fff8f8":"#f9fff9"}}>
                    <td style={{color:"#888"}}>{i+1}</td>
                    <td><b>{r.roll_no}</b></td><td>{r.name}</td>
                    <td><span className={`badge ${r.class_type==='Theory'?'badge-theory':'badge-practical'}`}>{r.class_type}</span></td>
                    <td style={{fontSize:12,color:"#1565c0"}}>{r.department_name}</td>
                    <td>
                      <div className="att-toggle">
                        <button className={`t-present${att.status==="present"?" active":""}`} onClick={() => toggle(r.id,"status","present")}>✓ Present</button>
                        <button className={`t-absent${att.status==="absent"?" active":""}`} onClick={() => toggle(r.id,"status","absent")}>✗ Absent</button>
                      </div>
                    </td>
                    <td>
                      {att.status==="absent"
                        ? <select className="informed-sel" value={att.is_informed?"1":"0"} onChange={(e) => toggle(r.id,"is_informed",e.target.value==="1")}><option value="0">⚠️ Uninformed</option><option value="1">✅ Informed</option></select>
                        : <span style={{color:"#aaa",fontSize:12}}>—</span>}
                    </td>
                    <td><a href={`tel:${r.parent_contact}`} style={{color:"#1565c0",fontSize:12,textDecoration:"none"}}>📞 {r.parent_contact}</a></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="staff-section" style={{marginTop:24}}>
        <div className="staff-header" onClick={() => setStaffOpen(!staffOpen)}>
          <span>👩‍🏫 Staff Members</span>
          <span className={`arrow${staffOpen?" open":""}`}><Icon.ChevronDown /></span>
        </div>
        {staffOpen && (
          <div className="staff-grid">
            {teachers.map(t => (
              <div className="staff-card" key={t.id} style={{cursor:"pointer",border:selectedTeacher==t.id?"2px solid #1565c0":undefined}} onClick={() => setSelectedTeacher(String(t.id))}>
                <div className="s-name">{t.name}</div>
                <div className="s-subject">📚 {t.subject}</div>
                {selectedTeacher==t.id && <div style={{fontSize:11,color:"#1565c0",fontWeight:700,marginTop:4}}>✅ Selected</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {msgModal && msgResult && (
        <div className="modal-overlay" onClick={() => setMsgModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>📨 Parent Messages Sent — {msgResult.messages_sent} messages</h3>
            {msgResult.details?.length===0 && <p style={{color:"#888"}}>No uninformed absent students to message today.</p>}
            {msgResult.details?.map((d,i) => (
              <div className="msg-row" key={i}>
                <div className="m-name">{d.student} ({d.roll_no}) → 📞 {d.parent}&nbsp;<span className={`badge ${d.informed?"badge-informed":"badge-uninformed"}`}>{d.informed?"Informed":"Uninformed"}</span></div>
                <div className="m-msg">Message sent to parent successfully (simulated).</div>
              </div>
            ))}
            <button className="btn btn-primary" style={{marginTop:16}} onClick={() => setMsgModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ★ NEW: MONTHLY ATTENDANCE PAGE
// ═══════════════════════════════════════════════════════
function MonthlyPage({ setPage: setAppPage, setAttendanceDate }) {
  const today = new Date();
  const [year,      setYear]      = useState(today.getFullYear());
  const [month,     setMonth]     = useState(today.getMonth() + 1);
  const [view,      setView]      = useState("calendar");  // "calendar" | "report"
  const [monthData, setMonthData] = useState({});
  const [students,  setStudents]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState(null);
  const [depts,     setDepts]     = useState([]);
  const [filterDept,setFilterDept]= useState("");

  useEffect(() => { api("/api/departments/").then(r => setDepts(r.departments||[])); }, []);

  // Load monthly data from backend
  // Replace the mock below with: api(`/api/attendance/monthly/?year=${year}&month=${month}&dept=${filterDept}`)
  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const data = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month-1, d).getDay();
      const key = `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      if (dow === 0) { data[key] = { holiday:true, label:"Sunday" }; continue; }
      if (d === 14 && month === 4) { data[key] = { holiday:true, label:"Dr. Ambedkar Jayanti" }; continue; }
      const present = Math.floor(Math.random()*6)+20;
      data[key] = { present, absent:25-present };
    }
    setMonthData(data);
  }, [year, month, filterDept]);

  // Load student-wise report from backend
  // Replace mock with: api(`/api/attendance/student-report/?year=${year}&month=${month}&dept=${filterDept}`)
  useEffect(() => {
    const names = [
      ["AEC001","Fathima R"],["AEC002","Ganesh M"],["AEC003","Hema S"],
      ["AEC004","Indira P"],["AEC005","Jagan K"],["AEC006","Kamala V"],
      ["AEC007","Logesh R"],["AEC008","Malathi M"],["AEC009","Nithesh P"],["AEC010","Oviya S"],
    ];
    setStudents(names.map(([roll,name]) => {
      const p = Math.floor(Math.random()*10)+17;
      return { roll, name, present:p, absent:26-p, total:26 };
    }));
  }, [year, month, filterDept]);

  function prevMonth() { if (month===1){setYear(y=>y-1);setMonth(12);}else setMonth(m=>m-1); }
  function nextMonth() { if (month===12){setYear(y=>y+1);setMonth(1);}else setMonth(m=>m+1); }

  const daysInMonth    = new Date(year, month, 0).getDate();
  const startDayOfWeek = new Date(year, month-1, 1).getDay();
  const workingDays    = Object.values(monthData).filter(d=>!d.holiday).length;
  const totalPresent   = Object.values(monthData).reduce((s,d)=>s+(d.present||0),0);
  const totalAbsent    = Object.values(monthData).reduce((s,d)=>s+(d.absent||0),0);
  const avgPct         = (totalPresent+totalAbsent)>0 ? Math.round(totalPresent/(totalPresent+totalAbsent)*100) : 0;

  const filteredStu = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div><h1>📊 Monthly Attendance</h1><p>{MONTHS_LIST[month-1]} {year} — {workingDays} working days</p></div>
        <select className="filter-select" value={filterDept} onChange={e=>setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="ma-summary-grid">
        <div className="ma-sum-card" style={{borderColor:"#1565c0"}}><div className="ma-sum-label">Working Days</div><div className="ma-sum-value" style={{color:"#1565c0"}}>{workingDays}</div></div>
        <div className="ma-sum-card" style={{borderColor:"#2e7d32"}}><div className="ma-sum-label">Total Present</div><div className="ma-sum-value" style={{color:"#2e7d32"}}>{totalPresent}</div></div>
        <div className="ma-sum-card" style={{borderColor:"#c62828"}}><div className="ma-sum-label">Total Absent</div><div className="ma-sum-value" style={{color:"#c62828"}}>{totalAbsent}</div></div>
        <div className="ma-sum-card" style={{borderColor:avgPct>=75?"#2e7d32":"#c62828"}}>
          <div className="ma-sum-label">Avg Attendance</div>
          <div className="ma-sum-value" style={{color:avgPct>=75?"#2e7d32":"#c62828"}}>{avgPct}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ma-tabs">
        <button className={`ma-tab${view==="calendar"?" active":""}`} onClick={()=>setView("calendar")}>📅 Calendar View</button>
        <button className={`ma-tab${view==="report"?" active":""}`}   onClick={()=>setView("report")}>👨‍🎓 Student Report</button>
      </div>

      {view === "calendar" ? (
        <>
          <div className="ma-cal-nav">
            <button className="ma-nav-btn" onClick={prevMonth}>← Prev</button>
            <span className="ma-month-label">{MONTHS_LIST[month-1]} {year}</span>
            <button className="ma-nav-btn" onClick={nextMonth}>Next →</button>
          </div>

          <div className="ma-legend">
            <span className="ma-leg ma-leg-green">✓ High Attendance (≥90%)</span>
            <span className="ma-leg ma-leg-yellow">⚠ Medium (75–89%)</span>
            <span className="ma-leg ma-leg-red">✗ Low (&lt;75%)</span>
            <span className="ma-leg ma-leg-gray">Holiday / Weekend</span>
            <span className="ma-leg ma-leg-blue">Today</span>
          </div>

          <div className="ma-cal-grid">
            {DAY_LABELS.map(d => <div key={d} className="ma-day-lbl">{d}</div>)}
            {Array.from({length:startDayOfWeek}).map((_,i) => <div key={`e${i}`} className="ma-cell ma-cell-empty" />)}
            {Array.from({length:daysInMonth}).map((_,i) => {
              const day = i+1;
              const key = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const data = monthData[key];
              const isToday = day===today.getDate() && month===today.getMonth()+1 && year===today.getFullYear();
              const isSel   = selected===day;
              let cls = "ma-cell";
              if (!data) cls += " ma-cell-empty";
              else if (data.holiday) cls += " ma-cell-holiday";
              else {
                const pct = data.present/(data.present+data.absent)*100;
                cls += pct>=90?" ma-cell-green":pct>=75?" ma-cell-yellow":" ma-cell-red";
              }
              if (isToday) cls += " ma-cell-today";
              if (isSel)   cls += " ma-cell-selected";
              return (
                <div key={key} className={cls} onClick={()=>data&&!data.holiday&&setSelected(isSel?null:day)}>
                  <span className="ma-day-num">{day}</span>
                  {data && !data.holiday && <>
                    <span className="ma-pill-p">✓ {data.present} present</span>
                    <span className="ma-pill-a">✗ {data.absent} absent</span>
                  </>}
                  {data && data.holiday && <span className="ma-holiday-txt">{data.label}</span>}
                </div>
              );
            })}
          </div>

          {/* Day detail panel */}
          {selected && (() => {
            const key  = `${year}-${String(month).padStart(2,"0")}-${String(selected).padStart(2,"0")}`;
            const data = monthData[key];
            if (!data || data.holiday) return null;
            const pct = Math.round(data.present/(data.present+data.absent)*100);
            return (
              <div className="ma-detail-box">
                <div className="ma-detail-title">
                  {MONTHS_LIST[month-1]} {selected}, {year}
                  <button className="ma-detail-close" onClick={()=>setSelected(null)}>✕</button>
                </div>
                <div className="ma-detail-stats">
                  <div className="ma-ds"><span className="ma-ds-num" style={{color:"#2e7d32"}}>{data.present}</span><span className="ma-ds-lbl">Present</span></div>
                  <div className="ma-ds"><span className="ma-ds-num" style={{color:"#c62828"}}>{data.absent}</span><span className="ma-ds-lbl">Absent</span></div>
                  <div className="ma-ds"><span className="ma-ds-num" style={{color:pct>=75?"#2e7d32":"#c62828"}}>{pct}%</span><span className="ma-ds-lbl">Attendance</span></div>
                </div>
                {/* This button goes to the daily Attendance page for that date */}
                <button className="ma-goto-btn" onClick={()=>{ setAttendanceDate(`${year}-${String(month).padStart(2,"0")}-${String(selected).padStart(2,"0")}`); setAppPage("attendance"); }}>
                  📋 View Full Day Attendance →
                </button>
              </div>
            );
          })()}
        </>
      ) : (
        /* Student report tab */
        <div className="table-card">
          <div className="table-toolbar">
            <div className="search-box"><Icon.Search /><input placeholder="Search student name or roll no…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
            <span className="ma-report-meta">{MONTHS_LIST[month-1]} {year} · {workingDays} working days</span>
          </div>
          <div className="ma-rep-head"><span>Roll No</span><span>Name</span><span>Present</span><span>Absent</span><span>Attendance %</span></div>
          {filteredStu.map(s => {
            const pct = Math.round(s.present/s.total*100);
            const col = pct>=85?"#2e7d32":pct>=75?"#f57c00":"#c62828";
            return (
              <div key={s.roll} className="ma-rep-row">
                <span style={{color:"#888",fontSize:12}}>{s.roll}</span>
                <span style={{fontWeight:600,color:"#1a237e"}}>{s.name}</span>
                <span style={{color:"#2e7d32",fontWeight:600}}>✓ {s.present}</span>
                <span style={{color:"#c62828",fontWeight:600}}>✗ {s.absent}</span>
                <div className="ma-pct-wrap">
                  <div className="ma-pct-bar"><div className="ma-pct-fill" style={{width:`${pct}%`,background:col}} /></div>
                  <span className="ma-pct-txt" style={{color:col}}>{pct}%</span>
                </div>
              </div>
            );
          })}
          {filteredStu.length===0 && <div style={{padding:32,textAlign:"center",color:"#aaa"}}>No students found.</div>}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ★ NEW: TIMETABLE PAGE
// ═══════════════════════════════════════════════════════
const SUBJECTS  = ["Agricultural Economics","Soil Science","Farm Management","Statistics","Lab"];
const CLASS_TYPES = ["Theory","Practical","Lab"];
const EMPTY_FORM  = { subject:"", teacher:"", type:"Theory", timeId:"", dayIndex:"" };

function TimetablePage() {
  const [depts,    setDepts]    = useState([]);
  const [dept,     setDept]     = useState("");
  const [yearSel,  setYearSel]  = useState("Year 1");
  const [teachers, setTeachers] = useState([]);
  const [slots,    setSlots]    = useState(INIT_TT_SLOTS);
  const [modal,    setModal]    = useState(null);
  const [delKey,   setDelKey]   = useState(null);

  useEffect(() => { api("/api/departments/").then(r => setDepts(r.departments||[])); }, []);
  useEffect(() => { api("/api/teachers/").then(r => setTeachers(r.teachers||[])); }, []);

  // Load timetable from backend
  // Replace with: api(`/api/timetable/?dept=${dept}&year=${yearSel}`).then(r => setSlots(r.slots||{}))
  useEffect(() => { setSlots(INIT_TT_SLOTS); }, [dept, yearSel]);

  const today    = new Date().getDay(); // 1=Mon…6=Sat
  const teacherNames = teachers.length ? teachers.map(t=>t.name) : ["Dr. Rajkumar","Mrs. Priya","Mr. Kumar","Mrs. Latha","Mr. Senthil"];

  const teacherLoad = {};
  Object.values(slots).forEach(s => { if(s.teacher) teacherLoad[s.teacher]=(teacherLoad[s.teacher]||0)+1; });

  function openAdd(timeId, dayIndex) {
    setModal({ mode:"add", key:`${timeId}_${dayIndex}`, form:{...EMPTY_FORM, timeId, dayIndex:String(dayIndex)} });
  }
  function openEdit(key) {
    const [tId, dIdx] = key.split("_");
    setModal({ mode:"edit", key, form:{...slots[key], timeId:tId, dayIndex:dIdx} });
  }
  function saveSlot() {
    const { form, key } = modal;
    if (!form.subject || !form.teacher) { alert("Please fill subject and teacher."); return; }
    // Real API: api('/api/timetable/', { method:'POST', body:JSON.stringify({key, dept, year:yearSel, ...form}) })
    const realKey = modal.mode==="add" ? `${form.timeId}_${form.dayIndex}` : key;
    setSlots(prev => ({...prev, [realKey]:{ subject:form.subject, teacher:form.teacher, type:form.type }}));
    setModal(null);
  }
  function deleteSlot() {
    // Real API: api(`/api/timetable/${delKey}/`, { method:'DELETE' })
    setSlots(prev => { const n={...prev}; delete n[delKey]; return n; });
    setDelKey(null);
  }
  function upd(field, value) { setModal(m=>({...m, form:{...m.form,[field]:value}})); }

  return (
    <>
      <div className="page-header">
        <div><h1>🗓️ Timetable</h1><p>Weekly class schedule</p></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <select className="filter-select" value={dept} onChange={e=>setDept(e.target.value)}>
            <option value="">All Departments</option>
            {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="filter-select" value={yearSel} onChange={e=>setYearSel(e.target.value)}>
            <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option>
          </select>
          <button className="btn btn-primary" onClick={()=>setModal({mode:"add",key:"",form:{...EMPTY_FORM}})}>+ Add Slot</button>
        </div>
      </div>

      {/* Teacher load summary */}
      <div className="tt-load-bar">
        {teacherNames.map(t=>(
          <div className="tt-load-item" key={t}>
            <span className="tt-load-name">{t.split(" ").pop()}</span>
            <span className="tt-load-num">{teacherLoad[t]||0} slots</span>
          </div>
        ))}
      </div>

      {/* Timetable grid */}
      <div className="tt-wrap">
        <div className="tt-grid">
          {/* Header */}
          <div className="tt-th" style={{textAlign:"left",paddingLeft:10}}>Time</div>
          {DAYS_SHORT.map((d,i)=>(
            <div key={d} className={`tt-th${i===today-1?" tt-th-today":""}`}>{d}</div>
          ))}

          {/* Rows */}
          {TIME_SLOTS.map(ts => {
            if (ts.type==="break") return (
              <div key={ts.id} className="tt-break" style={{gridColumn:"1/-1"}}>
                <span className="tt-break-time">{ts.label}</span>
                <span className="tt-break-lbl">☕ {ts.lbl}</span>
              </div>
            );
            return (
              <div key={ts.id} style={{display:"contents"}}>
                <div className="tt-time-cell">{ts.label}</div>
                {DAYS_FULL.map((day,di)=>{
                  const key  = `${ts.id}_${di}`;
                  const slot = slots[key];
                  const clr  = slot ? (SUBJECT_COLORS[slot.subject]||"slot-blue") : "";
                  return (
                    <div key={key} className="tt-cell">
                      {slot ? (
                        <div className={`tt-slot ${clr}`}>
                          <span className="tt-slot-sub">{slot.subject}</span>
                          <span className="tt-slot-tea">{slot.teacher}</span>
                          <div className="tt-slot-foot">
                            <span className="tt-slot-type">{slot.type}</span>
                            <div className="tt-slot-acts">
                              <button className="tt-act-btn" style={{color:"#1565c0"}} onClick={()=>openEdit(key)} title="Edit">✎</button>
                              <button className="tt-act-btn" style={{color:"#c62828"}} onClick={()=>setDelKey(key)} title="Delete">✕</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button className="tt-empty-btn" onClick={()=>openAdd(ts.id,di)} title={`Add class for ${day}`}>+</button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Color legend */}
      <div className="tt-leg">
        {Object.entries(SUBJECT_COLORS).map(([sub,cls])=>(
          <span key={sub} className={`tt-leg-item ${cls}`}>{sub}</span>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="tt-modal-bg" onClick={()=>setModal(null)}>
          <div className="tt-modal" onClick={e=>e.stopPropagation()}>
            <div className="tt-modal-head">
              <span className="tt-modal-title">{modal.mode==="add"?"Add New Slot":"Edit Slot"}</span>
              <button className="tt-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="tt-modal-body">
              {modal.mode==="add" && <>
                <span className="tt-label">Time Slot</span>
                <select className="tt-input" value={modal.form.timeId} onChange={e=>upd("timeId",e.target.value)}>
                  <option value="">-- Select time --</option>
                  {TIME_SLOTS.filter(t=>t.type==="class").map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <span className="tt-label">Day</span>
                <select className="tt-input" value={modal.form.dayIndex} onChange={e=>upd("dayIndex",e.target.value)}>
                  <option value="">-- Select day --</option>
                  {DAYS_FULL.map((d,i)=><option key={d} value={i}>{d}</option>)}
                </select>
              </>}
              <span className="tt-label">Subject</span>
              <select className="tt-input" value={modal.form.subject} onChange={e=>upd("subject",e.target.value)}>
                <option value="">-- Select subject --</option>
                {SUBJECTS.map(s=><option key={s}>{s}</option>)}
              </select>
              <span className="tt-label">Teacher</span>
              <select className="tt-input" value={modal.form.teacher} onChange={e=>upd("teacher",e.target.value)}>
                <option value="">-- Select teacher --</option>
                {teacherNames.map(t=><option key={t}>{t}</option>)}
              </select>
              <span className="tt-label">Class Type</span>
              <div className="tt-type-row">
                {CLASS_TYPES.map(ct=>(
                  <button key={ct} className={`tt-type-btn${modal.form.type===ct?" sel":""}`} onClick={()=>upd("type",ct)}>{ct}</button>
                ))}
              </div>
            </div>
            <div className="tt-modal-foot">
              <button className="tt-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="tt-btn-save" onClick={saveSlot}>{modal.mode==="add"?"Add Slot":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delKey && (
        <div className="tt-modal-bg" onClick={()=>setDelKey(null)}>
          <div className="tt-modal" style={{maxWidth:360}} onClick={e=>e.stopPropagation()}>
            <div className="tt-modal-head"><span className="tt-modal-title">Delete Slot?</span></div>
            <div className="tt-modal-body">
              <p style={{fontSize:14,color:"#555"}}>
                Remove <b>{slots[delKey]?.subject}</b> on <b>{DAYS_FULL[delKey.split("_")[1]]}</b> at <b>{TIME_SLOTS.find(t=>t.id===delKey.split("_")[0])?.label}</b>?
              </p>
            </div>
            <div className="tt-modal-foot">
              <button className="tt-btn-cancel" onClick={()=>setDelKey(null)}>Cancel</button>
              <button className="tt-btn-del" onClick={deleteSlot}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════
// DEPARTMENTS PAGE (unchanged)
// ═══════════════════════════════════════════
function DepartmentsPage() {
  const [depts, setDepts] = useState([]);
  useEffect(() => { api("/api/departments/").then(r => setDepts(r.departments||[])); }, []);
  const colors = ["#1565c0","#2e7d32","#f57c00","#6a1b9a","#ad1457","#00695c"];
  return (
    <>
      <div className="page-header"><h1>🏛️ Departments</h1></div>
      <div className="cards-grid" style={{gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))"}}>
        {depts.map((d,i)=>(
          <div className="stat-card" key={d.id} style={{borderColor:colors[i%colors.length],padding:24}}>
            <div className="value" style={{fontSize:20,color:colors[i%colors.length]}}>{d.name}</div>
            <div className="label" style={{marginTop:8}}>HOD</div>
            <div style={{fontWeight:700,color:"#333",fontSize:14}}>{d.head}</div>
          </div>
        ))}
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>ID</th><th>Department Name</th><th>Head of Department</th></tr></thead>
          <tbody>{depts.map(d=><tr key={d.id}><td>{d.id}</td><td><b>{d.name}</b></td><td>{d.head}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// REPORT PAGE (unchanged)
// ═══════════════════════════════════════════
function ReportPage() {
  const [report, setReport] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [depts, setDepts] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  useEffect(() => { api("/api/departments/").then(r => setDepts(r.departments||[])); }, []);
  useEffect(() => {
    const q = new URLSearchParams({ month });
    if (filterDept) q.set("department_id", filterDept);
    api(`/api/attendance/report/?${q}`).then(r => setReport(r.report||[]));
  }, [month, filterDept]);
  const pctColor = (p) => p>=75?"#2e7d32":p>=50?"#f57c00":"#c62828";
  return (
    <>
      <div className="page-header"><div><h1>📊 Attendance Report</h1><p>{report.length} students</p></div></div>
      <div className="table-card" style={{padding:"14px 20px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
        <label style={{fontSize:13,fontWeight:600,color:"#555"}}>Month:</label>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{padding:"8px 12px",border:"1px solid #ddd",borderRadius:8,fontFamily:"inherit"}} />
        <select className="filter-select" value={filterDept} onChange={e=>setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div className="table-card">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>#</th><th>Roll No</th><th>Name</th><th>Department</th><th>Present</th><th>Absent</th><th>Informed</th><th>Uninformed</th><th>Total</th><th>Percentage</th></tr></thead>
            <tbody>
              {report.map((r,i)=>(
                <tr key={r.roll_no}>
                  <td style={{color:"#888"}}>{i+1}</td>
                  <td><b>{r.roll_no}</b></td><td>{r.name}</td>
                  <td style={{fontSize:12,color:"#1565c0"}}>{r.dept}</td>
                  <td><span className="badge badge-present">{r.present_days}</span></td>
                  <td><span className="badge badge-absent">{r.absent_days}</span></td>
                  <td><span className="badge badge-informed">{r.informed_absent}</span></td>
                  <td><span className="badge badge-uninformed">{r.uninformed_absent}</span></td>
                  <td>{r.total_days}</td>
                  <td>
                    <b style={{color:pctColor(r.percentage)}}>{r.percentage}%</b>
                    <div style={{marginTop:4,background:"#eee",borderRadius:4,height:4,width:80}}>
                      <div style={{background:pctColor(r.percentage),width:`${r.percentage}%`,height:4,borderRadius:4}} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════
export default function App() {
  const [user,      setUser]      = useState(null);
  const [page,      setPage]      = useState("home");
  const [toastMsg,  setToastMsg]  = useState(null);
  const [toastType, setToastType] = useState("success");
  // Shared state: clicking "View full day attendance" from Monthly sets this date
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0,10));

  const showToast = (msg, type="success") => { setToastMsg(msg); setToastType(type); };
  const handleLogin  = (res) => { setUser(res); setPage("home"); };
  const handleLogout = async () => { await api("/api/logout/", { method:"POST" }); setUser(null); };

  if (!user) return (<><style>{styles}</style><LoginPage onLogin={handleLogin} /></>);

  return (
    <>
      <style>{styles}</style>
      {toastMsg && <Toast msg={toastMsg} type={toastType} onClose={()=>setToastMsg(null)} />}
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <div className="main">
        {page==="home"        && <HomePage />}
        {page==="students"    && <StudentsPage />}
        {page==="teachers"    && <TeachersPage />}
        {page==="attendance"  && <AttendancePage toast={showToast} />}
        {page==="monthly"     && <MonthlyPage setPage={setPage} setAttendanceDate={setAttendanceDate} />}
        {page==="timetable"   && <TimetablePage />}
        {page==="departments" && <DepartmentsPage />}
        {page==="report"      && <ReportPage />}
      </div>
    </>
  );
}