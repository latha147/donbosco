import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000/api";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

export default function Attendance() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { "studentId_date": "Present"/"Absent" }
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("mark"); // "mark" or "summary"

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Fetch students
  useEffect(() => {
    fetch(`${API}/students/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]));
  }, []);

  // Fetch attendance for selected month
  useEffect(() => {
    const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    fetch(`${API}/attendance/?month=${monthStr}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        (Array.isArray(data) ? data : []).forEach((rec) => {
          map[`${rec.student_id}_${rec.date}`] = rec.status;
        });
        setAttendance(map);
      })
      .catch(() => {});
  }, [selectedMonth, selectedYear]);

  const getDateStr = (day) =>
    `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const toggleAttendance = (studentId, day) => {
    const dateStr = getDateStr(day);
    const key = `${studentId}_${dateStr}`;
    setAttendance((prev) => ({
      ...prev,
      [key]: prev[key] === "Present" ? "Absent" : prev[key] === "Absent" ? undefined : "Present",
    }));
  };

  const getStatus = (studentId, day) => {
    const key = `${studentId}_${getDateStr(day)}`;
    return attendance[key];
  };

  const saveAttendance = async () => {
    setSaving(true);
    setMessage("");
    try {
      const records = [];
      students.forEach((s) => {
        days.forEach((day) => {
          const status = getStatus(s.id, day);
          if (status) {
            records.push({ student_id: s.id, date: getDateStr(day), status });
          }
        });
      });
      await fetch(`${API}/attendance/bulk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(records),
      });
      setMessage("✅ Attendance saved successfully!");
    } catch {
      setMessage("❌ Error saving attendance. Try again.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  // Summary calculation
  const getSummary = (studentId) => {
    let present = 0, absent = 0, total = 0;
    days.forEach((day) => {
      const status = getStatus(studentId, day);
      if (status === "Present") { present++; total++; }
      else if (status === "Absent") { absent++; total++; }
    });
    const pct = total > 0 ? Math.round((present / total) * 100) : null;
    return { present, absent, total, pct };
  };

  const years = [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", padding: "24px", background: "#f0f4ff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a237e", margin: 0 }}>
          📋 Attendance Management
        </h1>
        <p style={{ color: "#555", margin: "4px 0 0" }}>Mark and track student attendance month by month</p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={selectStyle}
        >
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={selectStyle}
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button
            onClick={() => setActiveTab("mark")}
            style={{ ...tabBtn, background: activeTab === "mark" ? "#1a237e" : "#fff", color: activeTab === "mark" ? "#fff" : "#1a237e" }}
          >
            ✏️ Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            style={{ ...tabBtn, background: activeTab === "summary" ? "#1a237e" : "#fff", color: activeTab === "summary" ? "#fff" : "#1a237e" }}
          >
            📊 Monthly Summary
          </button>
        </div>
      </div>

      {/* Legend */}
      {activeTab === "mark" && (
        <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 13 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...dot, background: "#4caf50" }} /> Present
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...dot, background: "#f44336" }} /> Absent
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...dot, background: "#e0e0e0" }} /> Not Marked
          </span>
          <span style={{ color: "#888", marginLeft: 8 }}>← Click a cell to toggle</span>
        </div>
      )}

      {/* Mark Attendance Tab */}
      {activeTab === "mark" && (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "100%", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1a237e", color: "#fff" }}>
                <th style={{ ...th, position: "sticky", left: 0, background: "#1a237e", zIndex: 2, minWidth: 140 }}>
                  Student
                </th>
                {days.map((d) => (
                  <th key={d} style={{ ...th, minWidth: 36, fontSize: 11 }}>
                    {d}
                    <div style={{ fontSize: 9, opacity: 0.7 }}>
                      {["Su","Mo","Tu","We","Th","Fr","Sa"][new Date(selectedYear, selectedMonth, d).getDay()]}
                    </div>
                  </th>
                ))}
                <th style={{ ...th, minWidth: 80 }}>Present</th>
                <th style={{ ...th, minWidth: 80 }}>Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={daysInMonth + 3} style={{ textAlign: "center", padding: 32, color: "#999" }}>Loading students...</td></tr>
              ) : (
                students.map((s, idx) => {
                  const { present, absent } = getSummary(s.id);
                  return (
                    <tr key={s.id} style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                      <td style={{ ...td, position: "sticky", left: 0, background: idx % 2 === 0 ? "#f9f9f9" : "#fff", fontWeight: 600, zIndex: 1 }}>
                        {s.name}
                        <div style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>{s.roll_number}</div>
                      </td>
                      {days.map((day) => {
                        const status = getStatus(s.id, day);
                        const isWeekend = [0, 6].includes(new Date(selectedYear, selectedMonth, day).getDay());
                        return (
                          <td
                            key={day}
                            onClick={() => !isWeekend && toggleAttendance(s.id, day)}
                            style={{
                              ...td,
                              textAlign: "center",
                              cursor: isWeekend ? "default" : "pointer",
                              background: isWeekend
                                ? "#f5f5f5"
                                : status === "Present"
                                ? "#c8e6c9"
                                : status === "Absent"
                                ? "#ffcdd2"
                                : "#fff",
                              color: isWeekend ? "#bbb" : status === "Present" ? "#2e7d32" : status === "Absent" ? "#c62828" : "#ccc",
                              fontWeight: 700,
                              fontSize: 15,
                              transition: "background 0.15s",
                            }}
                            title={isWeekend ? "Weekend" : status || "Click to mark"}
                          >
                            {isWeekend ? "—" : status === "Present" ? "P" : status === "Absent" ? "A" : "·"}
                          </td>
                        );
                      })}
                      <td style={{ ...td, textAlign: "center", color: "#2e7d32", fontWeight: 700 }}>{present}</td>
                      <td style={{ ...td, textAlign: "center", color: "#c62828", fontWeight: 700 }}>{absent}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly Summary Tab */}
      {activeTab === "summary" && (
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1a237e", color: "#fff" }}>
                <th style={th}>Student</th>
                <th style={th}>Roll No</th>
                <th style={th}>Present Days</th>
                <th style={th}>Absent Days</th>
                <th style={th}>Total Marked</th>
                <th style={th}>Attendance %</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const { present, absent, total, pct } = getSummary(s.id);
                const status = pct === null ? "—" : pct >= 75 ? "✅ Good" : pct >= 50 ? "⚠️ Low" : "❌ Critical";
                const statusColor = pct === null ? "#999" : pct >= 75 ? "#2e7d32" : pct >= 50 ? "#f57c00" : "#c62828";
                return (
                  <tr key={s.id} style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                    <td style={{ ...td, fontWeight: 600 }}>{s.name}</td>
                    <td style={{ ...td, color: "#666" }}>{s.roll_number}</td>
                    <td style={{ ...td, textAlign: "center", color: "#2e7d32", fontWeight: 700 }}>{present}</td>
                    <td style={{ ...td, textAlign: "center", color: "#c62828", fontWeight: 700 }}>{absent}</td>
                    <td style={{ ...td, textAlign: "center" }}>{total}</td>
                    <td style={{ ...td, textAlign: "center" }}>
                      {pct !== null ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: pct >= 75 ? "#4caf50" : pct >= 50 ? "#ff9800" : "#f44336", borderRadius: 4 }} />
                          </div>
                          <span style={{ fontWeight: 700, minWidth: 40 }}>{pct}%</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td style={{ ...td, color: statusColor, fontWeight: 600 }}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      {activeTab === "mark" && (
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={saveAttendance}
            disabled={saving}
            style={{
              padding: "12px 32px",
              background: saving ? "#90caf9" : "#1a237e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(26,35,126,0.3)",
            }}
          >
            {saving ? "Saving..." : "💾 Save Attendance"}
          </button>
          {message && <span style={{ fontWeight: 600, fontSize: 14 }}>{message}</span>}
        </div>
      )}
    </div>
  );
}

// Styles
const selectStyle = {
  padding: "8px 16px", borderRadius: 8, border: "1.5px solid #c5cae9",
  fontSize: 14, background: "#fff", color: "#1a237e", fontWeight: 600, cursor: "pointer",
};
const tabBtn = {
  padding: "8px 18px", borderRadius: 8, border: "1.5px solid #1a237e",
  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
};
const th = { padding: "10px 8px", textAlign: "left", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" };
const td = { padding: "8px", borderBottom: "1px solid #f0f0f0" };
const dot = { display: "inline-block", width: 12, height: 12, borderRadius: "50%" };