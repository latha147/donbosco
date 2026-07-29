import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('home')
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if (activePage === 'students')
      axios.get('http://127.0.0.1:8000/api/students/').then(res => setStudents(res.data)).catch(() => {})
    if (activePage === 'teachers')
      axios.get('http://127.0.0.1:8000/api/teachers/').then(res => setTeachers(res.data)).catch(() => {})
    if (activePage === 'attendance')
      axios.get('http://127.0.0.1:8000/api/attendance/').then(res => setAttendance(res.data)).catch(() => {})
    if (activePage === 'departments')
      axios.get('http://127.0.0.1:8000/api/departments/').then(res => setDepartments(res.data)).catch(() => {})
  }, [activePage])

  const menuItems = [
    { key: 'home', label: '🏠 Home' },
    { key: 'students', label: '👨‍🎓 Students' },
    { key: 'teachers', label: '👨‍🏫 Teachers' },
    { key: 'attendance', label: '📋 Attendance' },
    { key: 'departments', label: '🏢 Departments' },
  ]

  const tableStyle = { width: '100%', backgroundColor: 'white', borderRadius: '10px', borderCollapse: 'collapse' }
  const thStyle = (color) => ({ padding: '10px', backgroundColor: color, color: 'white' })
  const tdStyle = { padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial' }}>
      <div style={{ width: '220px', backgroundColor: '#1a73e8', color: 'white',
        padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ textAlign: 'center' }}>Don Bosco College</h3>
        <hr />
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          {menuItems.map(item => (
            <li key={item.key} onClick={() => setActivePage(item.key)}
              style={{ padding: '12px', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px',
                backgroundColor: activePage === item.key ? 'rgba(255,255,255,0.3)' : 'transparent' }}>
              {item.label}
            </li>
          ))}
        </ul>
        <button onClick={onLogout}
          style={{ padding: '10px', backgroundColor: '#ea4335', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          🚪 Logout
        </button>
      </div>

      <div style={{ flex: 1, padding: '30px', backgroundColor: '#f0f2f5', overflowY: 'auto' }}>

        {activePage === 'home' && (
          <div>
            <h2>Welcome to Attendance Management System</h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              {[
                { label: '👨‍🎓 Students', value: 150, color: '#1a73e8' },
                { label: '👨‍🏫 Teachers', value: 20, color: '#34a853' },
                { label: '📋 Attendance Today', value: 120, color: '#ea4335' },
                { label: '🏢 Departments', value: 5, color: '#fbbc04' },
              ].map((card, i) => (
                <div key={i} style={{ backgroundColor: 'white', padding: '20px',
                  borderRadius: '10px', flex: '1', minWidth: '150px',
                  textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <h3>{card.label}</h3>
                  <h1 style={{ color: card.color }}>{card.value}</h1>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'students' && (
          <div>
            <h2>👨‍🎓 Student List</h2>
            <table style={tableStyle}>
              <thead><tr>
                {['ID','Name','Roll No','Department','Email'].map(h => (
                  <th key={h} style={thStyle('#1a73e8')}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {students.length > 0 ? students.map((s, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{s.id}</td>
                    <td style={tdStyle}>{s.name}</td>
                    <td style={tdStyle}>{s.roll_number}</td>
                    <td style={tdStyle}>{s.department}</td>
                    <td style={tdStyle}>{s.email}</td>
                  </tr>
                )) : <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No students found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activePage === 'teachers' && (
          <div>
            <h2>👨‍🏫 Teacher List</h2>
            <table style={tableStyle}>
              <thead><tr>
                {['ID','Name','Subject','Department','Email'].map(h => (
                  <th key={h} style={thStyle('#34a853')}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {teachers.length > 0 ? teachers.map((t, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{t.id}</td>
                    <td style={tdStyle}>{t.name}</td>
                    <td style={tdStyle}>{t.subject}</td>
                    <td style={tdStyle}>{t.department}</td>
                    <td style={tdStyle}>{t.email}</td>
                  </tr>
                )) : <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No teachers found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activePage === 'attendance' && (
          <div>
            <h2>📋 Attendance Records</h2>
            <table style={tableStyle}>
              <thead><tr>
                {['ID','Student','Date','Status'].map(h => (
                  <th key={h} style={thStyle('#ea4335')}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {attendance.length > 0 ? attendance.map((a, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{a.id}</td>
                    <td style={tdStyle}>{a.student}</td>
                    <td style={tdStyle}>{a.date}</td>
                    <td style={{ ...tdStyle, color: a.status === 'Present' ? 'green' : 'red', fontWeight: 'bold' }}>{a.status}</td>
                  </tr>
                )) : <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No records found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activePage === 'departments' && (
          <div>
            <h2>🏢 Department List</h2>
            <table style={tableStyle}>
              <thead><tr>
                {['ID','Department Name','Head'].map(h => (
                  <th key={h} style={thStyle('#fbbc04')}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {departments.length > 0 ? departments.map((d, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{d.id}</td>
                    <td style={tdStyle}>{d.name}</td>
                    <td style={tdStyle}>{d.head}</td>
                  </tr>
                )) : <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No departments found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
