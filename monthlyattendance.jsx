// MonthlyAttendance.jsx
// Place this file in: src/pages/MonthlyAttendance.jsx
// Add route in App.jsx: <Route path="/attendance/monthly" element={<MonthlyAttendance />} />

import { useState, useEffect } from "react";
import "./MonthlyAttendance.css";

// ─── Mock API ────────────────────────────────────────────────────────────────
// Replace these with your actual API calls e.g. fetch('/api/attendance/monthly?dept=AEC&month=4&year=2026')
const MOCK_DEPARTMENTS = ["Agricultural Economics", "Computer Science", "Commerce"];
const MOCK_TEACHERS    = ["Dr. Rajkumar", "Mrs. Priya", "Mr. Kumar", "Mrs. Latha"];

function getMockMonthData(year, month) {
  // Returns { "2026-04-01": { present: 22, absent: 3, holiday: false }, ... }
  const data = {};
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dow  = date.getDay();
    const key  = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (dow === 0) { data[key] = { holiday: true, label: "Sunday" }; continue; }
    if (d === 14)  { data[key] = { holiday: true, label: "Dr. Ambedkar Jayanti" }; continue; }
    const present = Math.floor(Math.random() * 6) + 20;
    data[key] = { present, absent: 25 - present, holiday: false };
  }
  return data;
}

function getMockStudentReport(year, month, dept) {
  const names = [
    ["AEC001","Fathima R"], ["AEC002","Ganesh M"], ["AEC003","Hema S"],
    ["AEC004","Indira P"],  ["AEC005","Jagan K"],  ["AEC006","Kamala V"],
    ["AEC007","Logesh R"],  ["AEC008","Malathi M"],["AEC009","Nithesh P"],
    ["AEC010","Oviya S"],
  ];
  const workingDays = 26;
  return names.map(([roll, name]) => {
    const present = Math.floor(Math.random() * 10) + 17;
    return { roll, name, present, absent: workingDays - present, workingDays };
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function MonthlyAttendance() {
  const today       = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [dept,  setDept]  = useState("All Departments");
  const [teacher,setTeacher] = useState("All Teachers");
  const [view,  setView]  = useState("calendar"); // "calendar" | "report"
  const [monthData,    setMonthData]    = useState({});
  const [studentData,  setStudentData]  = useState([]);
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [searchQuery,  setSearchQuery]  = useState("");

  useEffect(() => {
    // Replace with: fetch(`/api/attendance/monthly?year=${year}&month=${month}&dept=${dept}`)
    setMonthData(getMockMonthData(year, month));
    setStudentData(getMockStudentReport(year, month, dept));
  }, [year, month, dept, teacher]);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const daysInMonth  = new Date(year, month, 0).getDate();
  const startDayOfWeek = new Date(year, month - 1, 1).getDay();

  // Summary stats
  const workingDays = Object.values(monthData).filter(d => !d.holiday).length;
  const totalPresent = Object.values(monthData).filter(d => !d.holiday && d.present).reduce((s, d) => s + d.present, 0);
  const totalAbsent  = Object.values(monthData).filter(d => !d.holiday && d.absent).reduce((s, d) => s + d.absent, 0);
  const avgPct = workingDays ? Math.round((totalPresent / ((totalPresent + totalAbsent) || 1)) * 100) : 0;

  const filteredStudents = studentData.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ma-page">
      {/* ── Top bar ── */}
      <div className="ma-topbar">
        <div className="ma-topbar-left">
          <h1 className="ma-title">Attendance</h1>
          <div className="ma-tabs">
            <button className={`ma-tab ${view === "calendar" ? "active" : ""}`} onClick={() => setView("calendar")}>
              Monthly Calendar
            </button>
            <button className={`ma-tab ${view === "report" ? "active" : ""}`} onClick={() => setView("report")}>
              Student Report
            </button>
          </div>
        </div>

        <div className="ma-filters">
          <select value={dept} onChange={e => setDept(e.target.value)}>
            <option>All Departments</option>
            {MOCK_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={teacher} onChange={e => setTeacher(e.target.value)}>
            <option>All Teachers</option>
            {MOCK_TEACHERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="ma-summary">
        <div className="ma-card ma-card-blue">
          <span className="ma-card-label">Working Days</span>
          <span className="ma-card-value">{workingDays}</span>
        </div>
        <div className="ma-card ma-card-green">
          <span className="ma-card-label">Total Present</span>
          <span className="ma-card-value">{totalPresent}</span>
        </div>
        <div className="ma-card ma-card-red">
          <span className="ma-card-label">Total Absent</span>
          <span className="ma-card-value">{totalAbsent}</span>
        </div>
        <div className={`ma-card ${avgPct >= 75 ? "ma-card-green" : "ma-card-red"}`}>
          <span className="ma-card-label">Avg Attendance</span>
          <span className="ma-card-value">{avgPct}%</span>
        </div>
      </div>

      {view === "calendar" ? (
        <>
          {/* ── Calendar Nav ── */}
          <div className="ma-cal-nav">
            <button className="ma-nav-btn" onClick={prevMonth}>&#8592;</button>
            <span className="ma-month-label">{MONTHS[month - 1]} {year}</span>
            <button className="ma-nav-btn" onClick={nextMonth}>&#8594;</button>
          </div>

          {/* ── Legend ── */}
          <div className="ma-legend">
            <span className="leg-item leg-green">All Present</span>
            <span className="leg-item leg-yellow">Some Absent</span>
            <span className="leg-item leg-red">Many Absent</span>
            <span className="leg-item leg-gray">Holiday / Weekend</span>
          </div>

          {/* ── Calendar Grid ── */}
          <div className="ma-cal-grid">
            {DAY_LABELS.map(d => (
              <div key={d} className="ma-day-label">{d}</div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="ma-cell ma-cell-empty" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day  = i + 1;
              const key  = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const data = monthData[key];
              const isToday = day === today.getDate() && month === today.getMonth()+1 && year === today.getFullYear();
              const isSelected = selectedDay === day;

              let cellClass = "ma-cell";
              if (!data) cellClass += " ma-cell-empty";
              else if (data.holiday) cellClass += " ma-cell-holiday";
              else {
                const pct = data.present / (data.present + data.absent) * 100;
                if (pct >= 90)      cellClass += " ma-cell-green";
                else if (pct >= 75) cellClass += " ma-cell-yellow";
                else                cellClass += " ma-cell-red";
              }
              if (isToday)    cellClass += " ma-cell-today";
              if (isSelected) cellClass += " ma-cell-selected";

              return (
                <div
                  key={key}
                  className={cellClass}
                  onClick={() => data && !data.holiday && setSelectedDay(isSelected ? null : day)}
                >
                  <span className="ma-day-num">{day}</span>
                  {data && !data.holiday && (
                    <div className="ma-cell-stats">
                      <span className="ma-pill-p">✓ {data.present}</span>
                      <span className="ma-pill-a">✗ {data.absent}</span>
                    </div>
                  )}
                  {data && data.holiday && (
                    <span className="ma-holiday-lbl">{data.label || "Holiday"}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Day Detail Panel ── */}
          {selectedDay && (() => {
            const key  = `${year}-${String(month).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`;
            const data = monthData[key];
            if (!data || data.holiday) return null;
            const pct = Math.round(data.present / (data.present + data.absent) * 100);
            return (
              <div className="ma-day-detail">
                <div className="ma-detail-header">
                  <span className="ma-detail-title">
                    {MONTHS[month-1]} {selectedDay}, {year}
                  </span>
                  <button className="ma-detail-close" onClick={() => setSelectedDay(null)}>✕</button>
                </div>
                <div className="ma-detail-stats">
                  <div className="ma-ds-item">
                    <span className="ma-ds-num" style={{ color: "#059669" }}>{data.present}</span>
                    <span className="ma-ds-lbl">Present</span>
                  </div>
                  <div className="ma-ds-item">
                    <span className="ma-ds-num" style={{ color: "#dc2626" }}>{data.absent}</span>
                    <span className="ma-ds-lbl">Absent</span>
                  </div>
                  <div className="ma-ds-item">
                    <span className="ma-ds-num" style={{ color: pct >= 75 ? "#059669" : "#dc2626" }}>{pct}%</span>
                    <span className="ma-ds-lbl">Attendance</span>
                  </div>
                </div>
                <button
                  className="ma-view-day-btn"
                  onClick={() => window.location.href = `/attendance?date=${year}-${String(month).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`}
                >
                  View full day attendance →
                </button>
              </div>
            );
          })()}
        </>
      ) : (
        /* ── Student Report View ── */
        <div className="ma-report">
          <div className="ma-report-header">
            <input
              type="text"
              placeholder="Search student name or roll no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ma-search"
            />
            <span className="ma-report-meta">{MONTHS[month-1]} {year} · {workingDays} working days</span>
          </div>

          <div className="ma-report-table">
            <div className="ma-report-thead">
              <span>Roll No</span>
              <span>Name</span>
              <span className="hide-sm">Present</span>
              <span className="hide-sm">Absent</span>
              <span>Attendance</span>
            </div>
            {filteredStudents.map(s => {
              const pct = Math.round((s.present / s.workingDays) * 100);
              const color = pct >= 85 ? "#059669" : pct >= 75 ? "#d97706" : "#dc2626";
              return (
                <div key={s.roll} className="ma-report-row">
                  <span className="ma-roll">{s.roll}</span>
                  <span className="ma-sname">{s.name}</span>
                  <span className="hide-sm ma-stat-p">✓ {s.present}</span>
                  <span className="hide-sm ma-stat-a">✗ {s.absent}</span>
                  <div className="ma-pct-wrap">
                    <div className="ma-pct-bar">
                      <div className="ma-pct-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="ma-pct-txt" style={{ color }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
            {filteredStudents.length === 0 && (
              <div className="ma-empty">No students found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}