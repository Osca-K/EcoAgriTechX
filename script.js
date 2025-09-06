

// Register Chart.js annotation plugin (CDN global)
if (window['chartjs-plugin-annotation']) {
  Chart.register(window['chartjs-plugin-annotation']);
}

const ctx = document.getElementById("monitoringChart").getContext("2d");


new Chart(ctx, {
  type: "line",
  data: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "22:00"],
    datasets: [
      {
  label: "Average Temperature (°C)",
        data: [13, 11, 19, 27, 26, 19, 21],
        borderColor: "#ff7300",
        borderWidth: 2,
        pointRadius: 0, // 🔹 remove dots
        tension: 0.4,   // smooth curve
        fill: true,
        backgroundColor: "rgba(255, 115, 0, 0.15)",
      },
      {
        label: "Soil Moisture (%)",
        data: [45, 50, 60, 65, 70, 55, 50],
        borderColor: "#00c49f",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(0, 196, 159, 0.15)",
      },
      {
        label: "Water Usage (L)",
        data: [10, 15, 30, 50, 60, 40, 20],
        borderColor: "#0088fe",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(0, 136, 254, 0.15)",
      },
      {
        label: "Electricity (kWh)",
        data: [20, 25, 35, 55, 65, 45, 30],
        borderColor: "#ff0000",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(255, 0, 0, 0.15)",
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
        labels: {
          color: "#222",
          font: { size: 14 },
          generateLabels: function(chart) {
            return chart.data.datasets.map(function(dataset, i) {
              return {
                text: dataset.label,
                fillStyle: dataset.borderColor,
                strokeStyle: dataset.borderColor,
                lineWidth: 2,
                hidden: !chart.isDatasetVisible(i),
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1f3b5c",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      annotation: {
        annotations: {
          irrigationSegment: {
            type: 'box',
            xMin: '12:00',
            xMax: '16:00',
            yMin: 0,
            yMax: 15,
            backgroundColor: 'rgba(0, 200, 255, 0.18)',
            borderWidth: 0,
            label: {
              display: true,
              content: 'Irrigation',
              position: 'center',
              color: '#0088fe',
              font: { size: 13, weight: 'bold' }
            }
          }
        }
      },
    },
    scales: {
      x: {
        type: 'category',
        display: true,
        title: {
          display: false
        },
        ticks: {
          color: "#222",
          font: { size: 12 },
          callback: function(value, index, ticks) {
            // Ensure format HH:MM
            const label = this.getLabelForValue(value);
            if (/^\d{2}:\d{2}$/.test(label)) return label;
            // fallback: try to format
            if (typeof label === "string" && label.length === 4) {
              return label.slice(0,2) + ":" + label.slice(2);
            }
            return label;
          }
        },
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



const soilCtx = document.getElementById("soilChart").getContext("2d");

// Simulated soil data
const soilLabels = ["00:00","04:00","08:00","12:00","16:00","20:00","22:00"];
const soilData = [45, 50, 60, 65, 70, 55, 50]; // Replace with live data

let soilStart = 0;
let soilRange = 7;

function getSoilChartData() {
  return {
    labels: soilLabels.slice(soilStart, soilStart + soilRange),
    datasets: [{
      label: "Soil Moisture (%)",
      data: soilData.slice(soilStart, soilStart + soilRange),
      borderColor: "#00c49f",
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    }]
  };
}

const soilChart = new Chart(soilCtx, {
  type: "line",
  data: getSoilChartData(),
  options: {
    responsive: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { enabled: true, backgroundColor: "#1f3b5c", titleColor: "#fff", bodyColor: "#fff" },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
    }
  }
});


// Sidebar navigation tab switching
document.querySelectorAll('.nav li').forEach((tab, idx) => {
  tab.addEventListener('click', () => {
    // Tab IDs in order
    const tabIds = ['dashboard', 'growth', 'irrigation', 'energy', 'garden'];
    tabIds.forEach(id => {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById(tabIds[idx]).classList.add('active');
    // Optional: highlight active tab
    document.querySelectorAll('.nav li').forEach(li => li.classList.remove('active'));
    tab.classList.add('active');
  });
});





const energyCtx = document.getElementById("energyChart").getContext("2d");

// Simulated datasets
const energyLabels = ["00:00","04:00","08:00","12:00","16:00","20:00","22:00"];
const solarData = [10, 20, 50, 70, 90, 80, 60];
const windData  = [30, 40, 60, 80, 120, 100, 70];

let energyStart = 0;
let energyRange = 7;

function getEnergyChartData() {
  return {
    labels: energyLabels.slice(energyStart, energyStart + energyRange),
    datasets: [
      {
        label: "Solar Energy (kWh)",
        data: solarData.slice(energyStart, energyStart + energyRange),
        borderColor: "#ff7300",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
  label: "Average Wind Energy (kWh)",
        data: windData.slice(energyStart, energyStart + energyRange),
        borderColor: "#00c49f",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      }
    ]
  };
}

const energyChart = new Chart(energyCtx, {
  type: "line",
  data: getEnergyChartData(),
  options: {
    responsive: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { enabled: true, backgroundColor: "#1f3b5c", titleColor: "#fff", bodyColor: "#fff" },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
    }
  }
});

// Navigation buttons
document.getElementById("energyNextBtn").addEventListener("click", () => {
  if (energyStart + energyRange < energyLabels.length) {
    energyStart++;
    energyChart.data = getEnergyChartData();
    energyChart.update();
  }
});
document.getElementById("energyPrevBtn").addEventListener("click", () => {
  if (energyStart > 0) {
    energyStart--;
    energyChart.data = getEnergyChartData();
    energyChart.update();
  }
});



// Irrigation Chart (combined water + energy)
function initIrrigationChart() {
  const ctx = document.getElementById("irrigationChart").getContext("2d");

  // Example dataset
  const labels = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"];
  const waterData = [0, 50, 100, 100, 50, 0, 0, 0, 70, 0];
  const energyData = [0, 5, 10, 10, 5, 0, 0, 0, 8, 0];

  let start = 0;
  let range = 7;

  function getChartData() {
    return {
      labels: labels.slice(start, start + range),
      datasets: [
        {
          label: "Water Usage (L)",
          data: waterData.slice(start, start + range),
          borderColor: "#0088fe",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(0,136,254,0.2)"
        },
        {
          label: "Energy Usage (kWh)",
          data: energyData.slice(start, start + range),
          borderColor: "#ff7300",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(255,115,0,0.2)"
        }
      ]
    };
  }

  const irrigationChart = new Chart(ctx, {
    type: "line",
    data: getChartData(),
    options: {
      responsive: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#fff" } },
        tooltip: {
          enabled: true,
          backgroundColor: "#1f3b5c",
          titleColor: "#fff",
          bodyColor: "#fff"
        },
      },
      scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
        y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      }
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
    ]
  });

  // Navigation buttons
  document.getElementById("irrigNextBtn").addEventListener("click", () => {
    if (start + range < labels.length) {
      start++;
      irrigationChart.data = getChartData();
      irrigationChart.update();
    }
  });

  document.getElementById("irrigPrevBtn").addEventListener("click", () => {
    if (start > 0) {
      start--;
      irrigationChart.data = getChartData();
      irrigationChart.update();
    }
  });
}

// Call when DOM is ready
document.addEventListener("DOMContentLoaded", initIrrigationChart);



//Garden
function drawGarden() {
  const canvas = document.getElementById("gardenCanvas");
  const ctx = canvas.getContext("2d");

  const cols = ["A","B","C","D"];
  const rows = [1,2,3,4];
  const cellWidth = canvas.width / cols.length;
  const cellHeight = canvas.height / rows.length;

  // Example sensor statuses
  const activeSensors = ["A1","B2","C3","D4","A2","B3","C1","D2","C4","B4","A3","D1"];
  const inactiveSensors = ["B1","D3","C2"];

  // Draw grid
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  for (let i = 0; i <= cols.length; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellWidth, 0);
    ctx.lineTo(i * cellWidth, canvas.height);
    ctx.stroke();
  }
  for (let j = 0; j <= rows.length; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * cellHeight);
    ctx.lineTo(canvas.width, j * cellHeight);
    ctx.stroke();
  }

  // Draw sensors
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  rows.forEach((r, rowIndex) => {
    cols.forEach((c, colIndex) => {
      const sensor = `${c}${r}`;
      const x = colIndex * cellWidth + cellWidth / 2;
      const y = rowIndex * cellHeight + cellHeight / 2;

      let isActive = activeSensors.includes(sensor);
      let color = isActive ? "green" : "red";

      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.fillText(sensor, x, y);
    });
  });
}

document.addEventListener("DOMContentLoaded", drawGarden);
