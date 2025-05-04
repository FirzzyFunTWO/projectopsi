<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>IoT Flood Monitoring Dashboard</title>
  <link href="./css/style.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white font-sans">

  <header class="text-center py-6 bg-gray-800 shadow-md">
    <h1 class="text-3xl font-bold text-white">IoT Flood Monitoring Dashboard</h1>
  </header>

  <!-- Status Bar -->
  <section class="p-4">
    <div class="bg-gray-800 p-6 rounded-xl shadow">
      <h2 class="text-xl font-semibold text-center">Status</h2>
      <p id="status" class="text-3xl font-bold text-center">✅ AMAN</p>
    </div>
  </section>

  <!-- Top Info Row -->
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
    <div class="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
      <h2 class="text-xl font-semibold mb-2">Ketinggian Air</h2>
      <p id="ultrasonic" class="text-4xl font-bold text-blue-400">0 cm</p>
    </div>
    <div class="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
      <h2 class="text-xl font-semibold mb-2">Suhu</h2>
      <p id="temperature" class="text-4xl font-bold text-red-400">0°C</p>
    </div>
    <div class="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
      <h2 class="text-xl font-semibold mb-2">Kelembapan</h2>
      <p id="humidity" class="text-4xl font-bold text-green-400">0%</p>
    </div>
    <div class="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
      <h2 class="text-xl font-semibold mb-2">Kelembapan Tanah</h2>
      <p id="soil" class="text-4xl font-bold text-yellow-400">0%</p>
    </div>
  </section>

<section class="p-4">
  <div class="bg-gray-800 p-6 rounded-xl shadow">
    <h2 class="text-xl font-semibold text-center mb-4">Chart Debit Air</h2>
    <div class="relative" style="height:500px;">
    <div class="mb-4 flex justify-center">
      <select id="timeRange" class="bg-gray-600 p-2 rounded-xl text-white">
        <option value="6">6 Jam</option>
        <option value="12">12 Jam</option>
        <option value="24">24 Jam</option>
      </select>
    </div>
    <!-- Chart -->
    <canvas id="flowChart"></canvas>
  </div>
</section>
  
<!-- Bottom Info -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
  <div class="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
  <h3>Prakiraan 5 Hari:</h3>
  <ul id="forecast-5days"></ul>
  </div>
  <div class="bg-gray-800 p-4 rounded-xl shadow flex flex-col items-center">
    <h2 class="text-xl font-semibold mb-2">Utilitas</h2>
    <ul class="list-disc list-inside text-sm text-gray-300">
      <li>Battery: <span id="battery">80%</span></li>
      <li>Connection: <span id="connection">Offline</span></li>
      <li>Volt: <span id="volt">5.00 V</span></li>
    </ul>
  </div>
</section>

  <!-- Alarm Audio -->
  <audio id="alarmAudio" src="./assets/alarm.mp3" preload="auto"></audio>

  <!-- Danger Popup -->
  <div id="dangerPopup" class="hidden fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-red-500 p-8 rounded-xl text-center">
      <h2 class="text-3xl text-white font-bold mb-4">🚨 BAHAYA! Ketinggian Air Tinggi!</h2>
      <button onclick="closePopup()" class="text-lg text-white bg-red-600 p-2 rounded">Tutup</button>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="./js/script.js"></script>

</body>
</html>
