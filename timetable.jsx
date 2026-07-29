import { useState, useEffect } from "react";
import axios from "axios";

const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat"];
const PERIODS = ["9:00–10:00","10:00–11:00","11:15–12:15","12:15–1:15","2:00–3:00","3:00–4:00"];

export default function Timetable() {
  const [teachers, setTeachers]   = useState([]);
  const [teacher, setTeacher]     = useState("");
  const [grid, setGrid]           = useState({});
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({ subject:"", room:"", type:"Theory" });

  useEffect(() => {
    axios.get("http://localhost:8000/api/teachers/")
      .then(res => { setTeachers(res.data); if(res.data.length) setTeacher(res.data[0].id); });
  }, []);

  useEffect(() => {
    if (!teacher) return;
    axios.get(`http://localhost:8000/api/timetable/?teacher=${teacher}`)
      .then(res => setGrid(res.data));
  }, [teacher]);

  const saveSlot = () => {
    const { day, period } = editing;
    axios.post("http://localhost:8000/api/timetable/", { teacher, day, period, ...form })
      .then(() => {
        setGrid(g => ({ ...g, [`${day}_${period}`]: { ...form } }));
        setEditing(null);
      });
  };

  const cellStyle = (type) => ({
    Theory: { background:"#E6F1FB", color:"#0C447C" },
    Lab:    { background:"#EAF3DE", color:"#27500A" },
    Free:   { background:"#f5f5f3", color:"#999" },
  })[type] || { background:"#f5f5f3", color:"#999" };

  return (
    <div style={{ padding:24, fontFamily:"'Segoe UI', sans-serif" }}>
      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
        <h2 style={{ fontSize:20, fontWeight:600, margin:0 }}>Teacher Timetable</h2>
        <select value={teacher} onChange={e=>setTeacher(e.target.value)} style={sel}>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr>
              <th style={th}>Time</th>
              {DAYS.map(d => <th key={d} style={th}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, pi) => (
              <tr key={period}>
                {period === "11:15–12:15" && pi === 2 ? null : null}
                <td style={{ ...td2, fontSize:11, color:"#888", whiteSpace:"nowrap" }}>{period}</td>
                {DAYS.map(day => {
                  const key  = `${day}_${period}`;
                  const slot = grid[key];
                  return (
                    <td key={day} style={td2}>
                      <div onClick={() => { setEditing({ day, period }); setForm(slot || { subject:"", room:"", type:"Theory" }); }}
                        style={{ ...cellStyle(slot?.type || "Free"), borderRadius:6, padding:"6px 8px",
                          cursor:"pointer", minHeight:44, transition:"opacity 0.15s" }}>
                        {slot ? <>
                          <div style={{ fontWeight:500 }}>{slot.subject}</div>
                          <div style={{ fontSize:10, opacity:0.8 }}>{slot.room}</div>
                        </> : <div style={{ fontSize:11 }}>+ Add</div>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:999 }}>
          <div style={{ background:"#fff", borderRadius:12, padding:24, width:320 }}>
            <h3 style={{ margin:"0 0 16px", fontSize:16 }}>{editing.day} · {editing.period}</h3>
            {[["Subject","subject","text"],["Room","room","text"]].map(([label,key,type])=>
              <div key={key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:"#666", display:"block", marginBottom:4 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                  style={{ width:"100%", padding:"7px 10px", border:"0.5px solid #ccc", borderRadius:6, fontSize:13 }} />
              </div>
            )}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:"#666", display:"block", marginBottom:4 }}>Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                style={{ width:"100%", padding:"7px 10px", border:"0.5px solid #ccc", borderRadius:6, fontSize:13 }}>
                <option>Theory</option><option>Lab</option><option>Free</option>
              </select>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={()=>setEditing(null)} style={{ padding:"7px 14px", border:"0.5px solid #ccc", borderRadius:6, cursor:"pointer", background:"#f5f5f5" }}>Cancel</button>
              <button onClick={saveSlot} style={{ padding:"7px 14px", background:"#1a56db", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:500 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const sel  = { padding:"6px 10px", border:"0.5px solid #ccc", borderRadius:6, fontSize:13 };
const th   = { textAlign:"left", padding:"6px 10px", borderBottom:"0.5px solid #e5e5e5", fontSize:11, color:"#888", fontWeight:500 };
const td2  = { padding:4, borderBottom:"0.5px solid #f5f5f5" };