const ctx = document.getElementById("monitoringChart").getContext("2d");

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "22:00"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [13, 11, 19, 27, 26, 19, 21],
        borderColor: "#ff7300",
        borderWidth: 2,
        pointRadius: 0, // 🔹 remove dots
        tension: 0.4,   // smooth curve
      },
      {
        label: "Soil Moisture (%)",
        data: [45, 50, 60, 65, 70, 55, 50],
        borderColor: "#00c49f",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "Water Usage (L)",
        data: [10, 15, 30, 50, 60, 40, 20],
        borderColor: "#0088fe",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "Electricity (kWh)",
        data: [20, 25, 35, 55, 65, 45, 30],
        borderColor: "#ff0000",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index", // 🔹 show all datasets on hover
      intersect: false,
    },
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1f3b5c",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  },
  plugins: [
    {
      id: "verticalLine",
      afterDraw: (chart) => {
        if (chart.tooltip?._active?.length) {
          const ctx = chart.ctx;
          const activePoint = chart.tooltip._active[0].element;
          const x = activePoint.x;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.stroke();
          ctx.restore();
        }
      },
    },
  ],
});
