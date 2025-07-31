import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register the chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function StackedBarChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      // Extract unique dates
      const dates = [...new Set(data.map(item => item['Date']))];

      // Calculate impressions and reach data
      const impressionsData = dates.map(date => 
        data.filter(item => item['Date'] === date)
            .reduce((acc, curr) => acc + parseInt(curr['Impressions']), 0)
      );
      const reachData = dates.map(date => 
        data.filter(item => item['Date'] === date)
            .reduce((acc, curr) => acc + parseInt(curr['Reach']), 0)
      );

      // Set the chart data
      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Impressions',
            data: impressionsData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Reach',
            data: reachData,
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
          },
        ]
      });
    }
  }, [data]);

  return (
    <div className="chart-card">
      <h3>Impressions vs Reach (Stacked)</h3>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StackedBarChart;
