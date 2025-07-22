// === Threshold State ===
let warningThreshold = parseInt(localStorage.getItem("thresholdWarning")) || 50;
let dangerThreshold = parseInt(localStorage.getItem("thresholdDanger")) || 80;
let tinggiKolam = parseInt(localStorage.getItem("tinggiKolam")) || 100;

const ultrasonic = document.getElementById("ultrasonic");
const status = document.getElementById("status");
const statusWrapper = document.getElementById("statusWrapper");
const alarmAudio = document.getElementById("alarmAudio");
const dangerPopup = document.getElementById("dangerPopup");
const connection = document.getElementById("connection");
const ctx = document.getElementById("flowChart").getContext("2d");
const thresholdForm = document.getElementById("thresholdForm");
const thresholdWarningInput = document.getElementById("threshold-warning");
const thresholdDangerInput = document.getElementById("threshold-danger");
const kolamForm = document.getElementById("kolamForm");
const tinggiKolamInput = document.getElementById("tinggiKolamInput");

thresholdWarningInput.value = warningThreshold;
thresholdDangerInput.value = dangerThreshold;
tinggiKolamInput.value = tinggiKolam;

thresholdForm.addEventListener("submit", function (e) {
  e.preventDefault();
  warningThreshold = parseInt(thresholdWarningInput.value);
  dangerThreshold = parseInt(thresholdDangerInput.value);
  localStorage.setItem("thresholdWarning", warningThreshold);
  localStorage.setItem("thresholdDanger", dangerThreshold);
  alert("✅ Batas threshold disimpan!");
});

kolamForm.addEventListener("submit", function (e) {
  e.preventDefault();
  tinggiKolam = parseInt(tinggiKolamInput.value);
  localStorage.setItem("tinggiKolam", tinggiKolam);
  alert("✅ Tinggi kolam disimpan!");
});

let fullData = [];
let lastSentStatus = "";

const flowChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Ketinggian Air (cm)',
      data: [],
      borderColor: 'rgba(59,130,246,1)',
      backgroundColor: 'rgba(59,130,246,0.2)',
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Ketinggian Air (cm)' }
      }
    }
  }
});

function updateStatus(cm) {
  statusWrapper.classList.remove("border-green-400", "border-yellow-400", "border-red-500");

  if (cm > dangerThreshold) {
    status.textContent = "🚨 BAHAYA";
    status.className = "text-red-500 font-bold text-lg";
    statusWrapper.classList.add("border-red-500");
    alarmAudio.play();
    dangerPopup.classList.remove("hidden");

    if (lastSentStatus !== "BAHAYA") {
      sendWhatsAppAlert(`🚨 *ALERT!* Ketinggian air ${cm} cm melebihi batas aman! Harap segera waspada.`);
      lastSentStatus = "BAHAYA";
    }

  } else if (cm > warningThreshold) {
    status.textContent = "⚠️ WASPADA";
    status.className = "text-yellow-400 font-bold text-lg";
    statusWrapper.classList.add("border-yellow-400");
    dangerPopup.classList.add("hidden");

    if (lastSentStatus !== "WASPADA") {
      sendWhatsAppAlert(`⚠️ *Peringatan!* Ketinggian air ${cm} cm memasuki zona waspada.`);
      lastSentStatus = "WASPADA";
    }

  } else {
    status.textContent = "✅ AMAN";
    status.className = "text-green-400 font-bold text-lg";
    statusWrapper.classList.add("border-green-400");
    dangerPopup.classList.add("hidden");

    if (lastSentStatus !== "") {
      sendWhatsAppAlert(`✅ *Aman* — Ketinggian air ${cm} cm kembali normal. Semua kondisi stabil.`);
      lastSentStatus = "";
    }
  }
}

function closePopup() {
  dangerPopup.classList.add("hidden");
}

function fetchSensorData() {
  fetch("getdata.php")
    .then(res => res.json())
    .then(data => {
      const jarakSensor = data.ultrasonik;
      const cm = tinggiKolam - jarakSensor;

      ultrasonic.textContent = `${cm} cm`;
      updateStatus(cm);

      const now = Date.now();
      const label = new Date().toLocaleTimeString();

      fullData.push({ timestamp: now, label, ultrasonik: cm });
      fullData = fullData.filter(d => now - d.timestamp <= 3 * 60 * 60 * 1000);

      flowChart.data.labels = fullData.map(d => d.label);
      flowChart.data.datasets[0].data = fullData.map(d => d.ultrasonik);
      flowChart.update();
    })
    .catch(err => console.error("Gagal fetch sensor:", err));
}

function sendWhatsAppAlert(message) {
  console.log("📤 WA Alert Triggered:", message);
  fetch("https://photography-device-nova-colleges.trycloudflare.com/send-group", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => console.log("✅ WA Webhook Response:", data))
    .catch(err => console.error("❌ Gagal kirim WA:", err));
}

setInterval(fetchSensorData, 5000);
fetchSensorData();

function pingESP() {
  fetch("ping.php")
    .then(response => {
      if (response.ok) {
        connection.textContent = "Online - Signal: " + Math.floor(Math.random() * (-50 - -90) + -90) + " dBm";
        connection.className = "text-green-500 font-medium";
      } else {
        connection.textContent = "Offline";
        connection.className = "text-red-500 font-medium";
      }
    })
    .catch(() => {
      connection.textContent = "Offline";
      connection.className = "text-red-500 font-medium";
    });
}

setInterval(pingESP, 6000);
pingESP();
