const ctx = document.getElementById('flowChart').getContext('2d');
let labels = [], data = [];

for (let i = 0; i <= 60; i++) {
  labels.push(`${i}m`);
  data.push(Math.max(0, Math.min(100, Math.sin(i / 10) * 50 + 50)));
}

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Debit Air (L/jam)',
      data,
      borderColor: 'aqua',
      borderWidth: 2,
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 120
      }
    }
  }
});

function simulateData() {
  const height = Math.floor(700 + Math.sin(Date.now() / 20000) * 400); // cm
  const temp = (25 + Math.random() * 5).toFixed(1);
  const hum = (60 + Math.random() * 20).toFixed(1);
  const soil = (40 + Math.random() * 30).toFixed(1);
  const flow = (30 + Math.random() * 30).toFixed(1);

  document.getElementById('ultrasonic').innerText = `${height} cm`;
  document.getElementById('temperature').innerText = `${temp}°C`;
  document.getElementById('humidity').innerText = `${hum}%`;
  document.getElementById('soil').innerText = `${soil}%`;

  const statusEl = document.getElementById('status');
  if (height > 1000) {
    statusEl.textContent = "BAHAYA";
    statusEl.className = "status-bahaya text-center";
    document.getElementById('alarmAudio').play().catch(()=>{});
    alert("⚠️ Status Bahaya: Ketinggian air melebihi 1000 cm!");
  } else if (height >= 800) {
    statusEl.textContent = "WASPADA";
    statusEl.className = "status-waspada text-center";
  } else {
    statusEl.textContent = "AMAN";
    statusEl.className = "status-aman text-center";
  }

  chart.data.labels.push(`${chart.data.labels.length}m`);
  chart.data.datasets[0].data.push(flow);
  if (chart.data.labels.length > 60) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

function loadForecast() {
  const forecastEl = document.getElementById('forecast');
  const dummy = [
    { emoji: "☀️", day: "Senin", temp: 30, hum: 60 },
    { emoji: "⛅", day: "Selasa", temp: 28, hum: 65 },
    { emoji: "🌧️", day: "Rabu", temp: 26, hum: 70 },
    { emoji: "⛈️", day: "Kamis", temp: 27, hum: 80 },
    { emoji: "❄️", day: "Jumat", temp: 24, hum: 75 },
  ];
  forecastEl.innerHTML = dummy.map(item =>
    `<div>${item.emoji} ${item.day} - ${item.temp}°C, ${item.hum}%</div>`
  ).join("");
}

setInterval(simulateData, 3000);
loadForecast();
