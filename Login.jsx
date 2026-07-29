import { useState } from 'react'
import axios from 'axios'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username, password
      })
      if (response.data.success) {
        localStorage.setItem('role', response.data.role)
        localStorage.setItem('name', response.data.name)
        onLogin(response.data.role)
      } else {
        setError('Invalid Username or Password!')
      }
    } catch (err) {
      setError('Invalid Username or Password!')
    }
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '40px',
        borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        width: '350px', textAlign: 'center'
      }}>
        <h2 style={{ color: '#1a73e8' }}>Don Bosco College</h2>
        <h3>Attendance Management System</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0',
            borderRadius: '5px', border: '1px solid #ccc',
            fontSize: '16px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0',
            borderRadius: '5px', border: '1px solid #ccc',
            fontSize: '16px', boxSizing: 'border-box' }} />
        <button onClick={handleLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1a73e8',
            color: 'white', border: 'none', borderRadius: '5px',
            fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Login