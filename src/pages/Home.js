import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Insight Dashboard</h1>
        <p>Visualize your social media performance with live charts.</p>
        <button onClick={goToDashboard}>Go to Dashboard</button>
      </div>
    </div>
  );
}

export default Home;
