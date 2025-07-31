import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register the chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function TotalReachBarChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      // Extract unique company names
      const companies = [...new Set(data.map(item => item['Company Name']))];

      // Calculate total reach for each company
      const totalReachData = companies.map(company => 
        data.filter(item => item['Company Name'] === company)
            .reduce((acc, curr) => acc + parseInt(curr['Reach']), 0)
      );

      // Set the chart data
      setChartData({
        labels: companies,
        datasets: [{
          label: 'Total Reach per Company',
          data: totalReachData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }]
      });
    }
  }, [data]);

  return (
    <div className="chart-card">
      <h3>Total Reach per Company</h3>
      {chartData ? <Bar data={chartData} /> : <p>Loading...</p>}
    </div>
  );
}

export default TotalReachBarChart;
