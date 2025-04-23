// Dummy data awal
let dataRiwayat = [80, 85, 90, 100, 120, 125, 130];
let ctx = document.getElementById('waterChart').getContext('2d');
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['-6m', '-5m', '-4m', '-3m', '-2m', '-1m', 'Sekarang'],
    datasets: [{
      label: 'Ketinggian Air (cm)',
      data: dataRiwayat,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#1D4ED8'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 200
      }
    }
  }
});

function updateStatus(level) {
  const box = document.getElementById("statusBox");
  const text = document.getElementById("statusText");
  const value = document.getElementById("waterLevel");

  value.innerText = level;

  if (level < 100) {
    box.className = "fade-in p-6 rounded-2xl bg-green-200 shadow-md mb-6";
    text.innerText = "Normal";
  } else if (level < 120) {
    box.className = "fade-in p-6 rounded-2xl bg-yellow-200 shadow-md mb-6";
    text.innerText = "Waspada";
  } else {
    box.className = "fade-in p-6 rounded-2xl bg-red-300 shadow-md mb-6";
    text.innerText = "Bahaya";
  }

  chart.data.datasets[0].data.push(level);
  chart.data.datasets[0].data.shift();
  chart.update();
}

function updateFlowRate(value) {
  document.getElementById("flowRate").innerText = value;
  const status = document.getElementById("flowStatus");
  if (value < 10) {
    status.innerText = "Status: Aman";
  } else if (value < 20) {
    status.innerText = "Status: Sedang";
  } else {
    status.innerText = "Status: Bahaya";
  }
}

function updateSoilMoisture(value) {
  document.getElementById("soilMoisture").innerText = value;
  const status = document.getElementById("soilStatus");
  if (value < 50) {
    status.innerText = "Trigger: Aman";
  } else {
    status.innerText = "Trigger: Sedang";
  }
}

setInterval(() => {
  const level = Math.floor(Math.random() * 70 + 80); // 80 - 150 cm
  updateStatus(level);
  updateFlowRate(Math.floor(Math.random() * 30));
  updateSoilMoisture(Math.floor(Math.random() * 100));
}, 3000);

const apiKey = "9d3abcd072eda89b1f3136bfdc67af25";
const city = "Semarang";

fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`)
  .then(res => res.json())
  .then(data => {
    const cuacaList = document.getElementById("cuacaList");
    cuacaList.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
      const item = data.list[i];
      const date = new Date(item.dt * 1000);
      const icon = item.weather[0].icon;
      const desc = item.weather[0].description;

      cuacaList.innerHTML += `
        <div class="text-center bg-blue-50 p-2 rounded-lg shadow-sm">
          <p class="font-bold">${date.toLocaleDateString("id-ID", { weekday: "short" })}</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="mx-auto" alt="cuaca">
          <p class="capitalize">${desc}</p>
          <p class="text-sm">${item.main.temp.toFixed(1)}°C</p>
        </div>
      `;
    }
  });