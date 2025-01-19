import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ComboChart = () => {
  // Data for the chart
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        type: "bar", // This dataset will be rendered as bars
        label: "Bar Dataset",
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        type: "line", // This dataset will be rendered as a line
        label: "Line Dataset",
        data: [20, 50, 40, 30, 50, 20],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1, // Makes the line curve slightly
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Combo Bar/Line Chart",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: false, // x-axis will not stack the bars
      },
      y: {
        stacked: false, // y-axis will not stack the bars
      },
    },
  };

  return (
    <div>
      <h2>Combo Bar and Line Chart</h2>
      <Bar data={data} options={options} />
      {/* If you want to show both Line and Bar, you can swap this with a Line chart */}
      {/* <Line data={data} options={options} /> */}
    </div>
  );
};

export default ComboChart;
