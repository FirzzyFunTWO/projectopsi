const ultrasonic = document.getElementById("ultrasonic");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const soil = document.getElementById("soil");
const status = document.getElementById("status");
const forecast = document.getElementById("forecast");
const forecast5 = document.getElementById("forecast-5days");
const alarmAudio = document.getElementById("alarmAudio");
const dangerPopup = document.getElementById("dangerPopup");
const ctx = document.getElementById("flowChart").getContext("2d");
const timeRangeSelect = document.getElementById("timeRange");

const battery = document.getElementById("battery");
const connection = document.getElementById("connection");
const volt = document.getElementById("volt");

let flowChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Ketinggian Air (cm)',
        data: [],
        yAxisID: 'y1',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      },
      {
        label: 'Debit Air (L/jam)',
        data: [],
        yAxisID: 'y2',
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    stacked: false,
    scales: {
      x: {
        display: true
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Ketinggian Air (cm)'
        },
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 99, 132, 1)'
        }
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Debit Air (L/jam)'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: 'rgba(54, 162, 235, 1)'
        }
      }
    }
  }
});

// Simpan semua data mentah di sini
let fullData = [];

// Fungsi untuk update chart sesuai range
function updateChartByRange(rangeHours) {
  const now = Date.now();
  const rangeMs = rangeHours * 60 * 60 * 1000;

  // Filter data sesuai time range
  const filtered = fullData.filter(item => now - item.timestamp <= rangeMs);

  flowChart.data.labels = filtered.map(d => d.label);
  flowChart.data.datasets[0].data = filtered.map(d => d.ultrasonik);
  flowChart.data.datasets[1].data = filtered.map(d => d.debit);
  flowChart.update();
}

// Listener dropdown
timeRangeSelect.addEventListener("change", (e) => {
  const selected = parseInt(e.target.value);
  updateChartByRange(selected);
});


// Update status flood
function updateStatus(cm) {
  if (cm > 1000) {
    status.textContent = "🚨 BAHAYA";
    status.className = "text-red-500 font-bold text-lg";
    alarmAudio.play();
    showPopup();
  } else if (cm >= 800) {
    status.textContent = "⚠️ WASPADA";
    status.className = "text-yellow-400 font-bold text-lg";
  } else {
    status.textContent = "✅ AMAN";
    status.className = "text-green-400 font-bold text-lg";
  }
}

function showPopup() {
  dangerPopup.classList.remove('hidden');
}

function closePopup() {
  dangerPopup.classList.add('hidden');
}

// Fetch sensor data
function fetchSensorData() {
  fetch("getdata.php")
    .then(res => res.json())
    .then(data => {
      temperature.textContent = `${data.suhu}°C`;
      humidity.textContent = `${data.kelembapan}%`;
      soil.textContent = `${data.soil}%`;
      ultrasonic.textContent = `${data.ultrasonik} cm`;

      updateStatus(data.ultrasonik);

      const timestamp = Date.now();
      const label = new Date().toLocaleTimeString();
      
      // Simpan ke fullData
      fullData.push({
        timestamp,
        label,
        ultrasonik: data.ultrasonik,
        debit: data.debit
      });
      
      // Hapus data lama lebih dari 12 jam
      const maxDuration = 12 * 60 * 60 * 1000;
      fullData = fullData.filter(item => timestamp - item.timestamp <= maxDuration);
      
      // Render ulang sesuai dropdown
      const selectedRange = parseInt(timeRangeSelect.value) || 3;
      updateChartByRange(selectedRange);
      
    })
    .catch(error => console.error("Gagal fetch sensor:", error));
}

// Fetch weather data
function fetchWeather() {
  const apiKey = "9d3abcd072eda89b1f3136bfdc67af25";
  const city = "Semarang";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const today = data.list[0];
      const weather = today.weather[0];
      const emoji = getWeatherEmoji(weather.main);
      forecast.textContent = `${emoji} ${weather.description}`;

      forecast5.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        const day = data.list[i * 8];
        const icon = getWeatherEmoji(day.weather[0].main);
        forecast5.innerHTML += `<li>${icon} ${day.dt_txt.split(" ")[0]} - ${day.weather[0].description}</li>`;
      }
    })
    .catch(error => console.error("Gagal fetch cuaca:", error));
}

function getWeatherEmoji(main) {
  switch (main) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "❄️";
    default: return "🌈";
  }
}

// Fetch and update random volt and battery data
function getRandomVolt() {
  return (Math.random() * (5.5 - 4.5) + 4.5).toFixed(2);  // Random volt between 4.5V and 5.5V
}

function getRandomBattery() {
  return Math.floor(Math.random() * (100 - 60) + 60);  // Random battery level between 60% and 100%
}

// Update battery and volt data
setInterval(() => {
  volt.textContent = `${getRandomVolt()} V`;
  battery.textContent = `${getRandomBattery()}%`;
}, 10000);  // Update every 10 seconds

// Function to ping ESP and check connection status
function pingESP() {
  fetch("ping.php")  // Endpoint for pinging ESP32
    .then(response => {
      if (response.ok) {
        connection.textContent = "Online - Signal: " + Math.floor(Math.random() * (-50 - -90) + -90) + " dBm"; // Random dBm between -50 to -90
      } else {
        connection.textContent = "Offline";
      }
    })
    .catch(() => {
      connection.textContent = "Offline";
    });
}

// Ping ESP every 6 seconds
setInterval(pingESP, 6000);

// Initial fetch for connection status
pingESP();

// Run functions periodically
setInterval(fetchSensorData, 5000);  // Update sensor every 5 seconds
setInterval(fetchWeather, 1800000);  // Update weather every 30 minutes

// Fetch on page load
fetchSensorData();
fetchWeather();
