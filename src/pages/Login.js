import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const users = [
    {
      email: 'client1@example.com',
      password: '123456',
      sheet: 'https://docs.google.com/spreadsheets/d/1A16kwTfWmGsO0Z7UmmsqQAnR2gtfJXTQk0OwTLS83sk/export?format=csv',
      clientName: 'Client One',
      logoURL: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
    },
    {
      email: 'client2@example.com',
      password: 'abcdef',
      sheet: 'https://docs.google.com/spreadsheets/d/YOUR_OTHER_SHEET_ID/export?format=csv',
      clientName: 'Client Two',
      logoURL: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Iconic_logo_sample.png'
    }
  ];

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') setDarkMode(true);
  }, []);

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('sheetLink', user.sheet);
      localStorage.setItem('clientName', user.clientName);
      localStorage.setItem('logoURL', user.logoURL);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  // Styles
  const isDark = darkMode;
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      padding: '20px',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? '#121212' : 'linear-gradient(to bottom right, #e0f7fa, #e1bee7)',
      color: isDark ? '#fff' : '#000',
      transition: 'all 0.3s',
      position: 'relative',
    },
    toggle: {
      position: 'absolute',
      top: 20,
      right: 20,
      cursor: 'pointer',
      fontSize: '14px',
      padding: '8px 14px',
      borderRadius: '20px',
      background: isDark ? '#333' : '#ddd',
      color: isDark ? '#fff' : '#000',
      border: 'none',
    },
    card: {
      background: isDark ? '#1e1e1e' : '#fff',
      borderRadius: '12px',
      padding: '30px 20px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: isDark ? '0 0 20px rgba(255,255,255,0.1)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    title: {
      margin: 0,
      textAlign: 'center',
      fontSize: '24px',
      color: isDark ? '#90caf9' : '#673ab7',
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: isDark ? '1px solid #555' : '1px solid #ccc',
      background: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#000',
      outline: 'none',
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      background: isDark ? '#90caf9' : '#673ab7',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '-8px',
      marginBottom: '-4px',
    },
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleDarkMode} style={styles.toggle}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
