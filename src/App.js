import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; // Updated import to components folder

// Check if user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar component added here */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
