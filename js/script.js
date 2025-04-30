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

let flowChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Debit Air (L/jam)',
      data: [],
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  }
});

// Variabel untuk ketinggian air
let currentHeight = 700;  // Nilai ketinggian air awal (cm)
let isFlooding = true;  // Variabel untuk mengontrol arah simulasi banjir (naik/turun)

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

function updateChart() {
  const now = new Date().toLocaleTimeString();  
  const dummyFlow = Math.floor(Math.random() * 10 + 5); // Dummy data for flow (L/hour)
  flowChart.data.labels.push(now);
  flowChart.data.datasets[0].data.push(dummyFlow);
  if (flowChart.data.labels.length > 12) { // 12 labels for 12 hours
    flowChart.data.labels.shift();
    flowChart.data.datasets[0].data.shift();
  }
  flowChart.update();
}

// Fungsi untuk mengambil data cuaca dari OpenWeather
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
        const day = data.list[i * 8]; // data every 3 hours
        const icon = getWeatherEmoji(day.weather[0].main);
        forecast5.innerHTML += `<li>${icon} ${day.dt_txt.split(" ")[0]} - ${day.weather[0].description}</li>`;
      }
    });
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

// Fungsi untuk simulasi ketinggian air naik dengan cepat dan turun perlahan
function updateSimulatedFlood() {
  if (isFlooding) {
    currentHeight += Math.random() * 15 + 5; // Naik cepat antara 5-20 cm per iterasi
    if (currentHeight >= 1000) {
      isFlooding = false; // Setelah mencapai 1000 cm, mulai menurunkan ketinggian
    }
  } else {
    currentHeight -= Math.random() * 2 + 0.5; // Turun perlahan antara 0.5-2 cm per iterasi
    if (currentHeight <= 700) {
      isFlooding = true; // Setelah mencapai 700 cm, mulai menaikkan ketinggian
    }
  }

  // Update nilai ketinggian air di UI
  ultrasonic.textContent = `${Math.round(currentHeight)} cm`;
  updateStatus(currentHeight); // Update status berdasarkan ketinggian air (Aman, Waspada, Bahaya)
}

function updateDummyData() {
  temperature.textContent = `${Math.round(Math.random() * 30 + 25)}°C`;
  humidity.textContent = `${Math.round(Math.random() * 50 + 30)}%`;
  soil.textContent = `${Math.round(Math.random() * 30 + 40)}%`;

  updateSimulatedFlood(); // Simulasikan banjir (ketinggian naik dan turun)
  updateChart();
}

setInterval(() => {
  updateDummyData();
}, 5000); // Update data setiap 5 detik

setInterval(fetchWeather, 1800000); // Update cuaca setiap 30 menit
fetchWeather(); // Fetch cuaca awal saat halaman dimuat
