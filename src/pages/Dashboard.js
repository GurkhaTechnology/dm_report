import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Line, Pie, Bar, Radar, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadarController,
  BarElement,
  Filler,
  RadialLinearScale,
  PolarAreaController,
  TimeScale,
} from 'chart.js';
import { CircleLoader } from 'react-spinners';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadarController,
  BarElement,
  Filler,
  RadialLinearScale,
  PolarAreaController,
  TimeScale
);

// Utility functions
const calculatePercentageChange = (data) => {
  if (data.length < 2) return 'Not enough data';
  const first = data[0];
  const last = data[data.length - 1];
  const change = ((last - first) / Math.abs(first)) * 100;
  return change.toFixed(2);
};

const calculateAverage = (data) => {
  if (data.length === 0) return 0;
  const sum = data.reduce((a, b) => a + b, 0);
  return (sum / data.length).toFixed(2);
};

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState('All');
  const [engagementFilter, setEngagementFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [showInsights, setShowInsights] = useState({
    engagementLine: false,
    areaChart: false,
    barChart: false,
    doughnutChart: false,
    radarChart: false,
    polarChart: false,
    stackedBar: false,
  });

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTTSyOvOYmKiGeKXUUzxGWjQ7z9QpoUv1rFM1kkz5g7_vgKNmbiOcZPBQnyQMQCLJcFTS_rJ03KVHD/pub?gid=0&single=true&output=csv',
      {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setData(result.data);
          setLoading(false);
        },
      }
    );
  }, []);

  const filteredData = data
    .filter(entry => companyFilter === 'All' || entry['Company Name'] === companyFilter)
    .filter(entry => engagementFilter === '' || entry['Engagement (%)'] >= engagementFilter)
    .filter(entry => {
      const entryDate = new Date(entry['Date']);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return (!dateRange.start || entryDate >= startDate) && (!dateRange.end || entryDate <= endDate);
    });

  const engagementData = filteredData.map(entry => entry['Engagement (%)']);
  const reachData = filteredData.map(entry => entry['Reach']);
  const impressionsData = filteredData.map(entry => entry['Impressions']);
  const followersData = filteredData.map(entry => entry['Followers Gained']);
  const dates = filteredData.map(entry => entry['Date']);
  const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'];

  const engagementByPlatform = platforms.map(platform => {
    const platformData = filteredData.filter(entry => entry['Platform'] === platform);
    const totalEngagement = platformData.reduce((sum, entry) => sum + entry['Engagement (%)'], 0);
    return (totalEngagement / platformData.length || 0).toFixed(2);
  });

  const followersByPlatform = platforms.map(platform => {
    const platformData = filteredData.filter(entry => entry['Platform'] === platform);
    return platformData.reduce((sum, entry) => sum + (entry['Followers Gained'] || 0), 0);
  });

  const updateToggle = (key) => {
    setShowInsights(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const companyList = ['All', ...new Set(data.map(entry => entry['Company Name']))];
  const engagementLevels = [0, 20, 40, 60, 80, 100];

  if (loading) {
    return (
      <div className="loading-container">
        <CircleLoader color="#00BFFF" size={80} />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="sidebar">
        <h3>Dashboard</h3>
        <button onClick={() => setDarkMode(!darkMode)} className="toggle-mode">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <select onChange={(e) => setCompanyFilter(e.target.value)} value={companyFilter}>
          {companyList.map((company, index) => (
            <option key={index} value={company}>{company}</option>
          ))}
        </select>

        <select onChange={(e) => setEngagementFilter(e.target.value)} value={engagementFilter}>
          <option value="">Select Engagement Filter</option>
          {engagementLevels.map((level) => (
            <option key={level} value={level}>{`> ${level}%`}</option>
          ))}
        </select>

        <div className="date-range-picker">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      <div className="main-content">
        <h2>Social Media Performance Dashboard</h2>

        <div className="chart-container">
          {/* Line Chart */}
          <div className="chart-card">
            <h3>Engagement Rate Over Time</h3>
            <Line data={{
              labels: dates,
              datasets: [{
                label: 'Engagement Rate (%)',
                data: engagementData,
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
                tension: 0.1,
              }]
            }} />
            <button onClick={() => updateToggle('engagementLine')}>Toggle Insight</button>
            {showInsights.engagementLine && (
              <div>
                <p>{engagementData.length >= 2 ? `Engagement changed by ${calculatePercentageChange(engagementData)}%` : 'Not enough data'}</p>
                <p><em>This is the % change from start to end of the time period.</em></p>
              </div>
            )}
          </div>

          {/* Area Chart */}
          <div className="chart-card">
            <h3>Area Chart - Engagement</h3>
            <Line data={{
              labels: dates,
              datasets: [{
                label: 'Engagement Rate (%)',
                data: engagementData,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                fill: true,
              }]
            }} />
            <button onClick={() => updateToggle('areaChart')}>Toggle Insight</button>
            {showInsights.areaChart && (
              <div>
                <p>Average Engagement Rate: {calculateAverage(engagementData)}%</p>
                <p><em>Average of engagement rate across selected dates.</em></p>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="chart-card">
            <h3>Daily Engagement Comparison</h3>
            <Bar data={{
              labels: dates,
              datasets: [{
                label: 'Engagement (%)',
                data: engagementData,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
              }]
            }} />
            <button onClick={() => updateToggle('barChart')}>Toggle Insight</button>
            {showInsights.barChart && (
              <div>
                <p>Avg Daily Engagement: {calculateAverage(engagementData)}%</p>
              </div>
            )}
          </div>

          {/* Doughnut Chart */}
          <div className="chart-card">
            <h3>Engagement by Platform</h3>
            <Doughnut data={{
              labels: platforms,
              datasets: [{
                data: engagementByPlatform,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              }]
            }} />
            <button onClick={() => updateToggle('doughnutChart')}>Toggle Insight</button>
            {showInsights.doughnutChart && (
              <div>
                <ul>
                  {platforms.map((p, i) => <li key={p}>{p}: {engagementByPlatform[i]}%</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Radar Chart */}
          <div className="chart-card">
            <h3>Overall Performance by Platform</h3>
            <Radar data={{
              labels: platforms,
              datasets: [{
                label: 'Followers Gained',
                data: followersByPlatform,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
              }]
            }} />
            <button onClick={() => updateToggle('radarChart')}>Toggle Insight</button>
            {showInsights.radarChart && (
              <div>
                <ul>
                  {platforms.map((p, i) => <li key={p}>{p}: {followersByPlatform[i]} followers</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Polar Area Chart */}
          <div className="chart-card">
            <h3>Engagement by Reach and Impressions</h3>
            <PolarArea data={{
              labels: ['Reach', 'Impressions'],
              datasets: [{
                data: [calculateAverage(reachData), calculateAverage(impressionsData)],
                backgroundColor: ['#FF6384', '#36A2EB'],
              }]
            }} />
            <button onClick={() => updateToggle('polarChart')}>Toggle Insight</button>
            {showInsights.polarChart && (
              <div>
                <p>Average Reach: {calculateAverage(reachData)}</p>
                <p>Average Impressions: {calculateAverage(impressionsData)}</p>
              </div>
            )}
          </div>

          {/* Stacked Bar Chart */}
          <div className="chart-card">
            <h3>Top Engagement</h3>
            <Bar data={{
              labels: dates,
              datasets: [{
                label: 'Engagement Rate (%)',
                data: engagementData,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              }]
            }} />
            <button onClick={() => updateToggle('stackedBar')}>Toggle Insight</button>
            {showInsights.stackedBar && (
              <div>
                <p>Total Engagement: {engagementData.reduce((a, b) => a + b, 0).toFixed(2)}%</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
