<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>IoT Flood Monitoring Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.getElementById(tabId).classList.remove('hidden');

      document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.remove('border-blue-500', 'text-blue-700');
        el.classList.add('border-transparent', 'text-gray-500');
      });

      const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
      activeTab.classList.add('border-blue-500', 'text-blue-700');
      activeTab.classList.remove('border-transparent', 'text-gray-500');
    }
    window.onload = () => switchTab('tab-dashboard');
  </script>
</head>
<body class="bg-blue-100 text-gray-800 font-sans">

  <!-- Navigation Tabs -->
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center text-blue-600 font-bold text-xl">
            Flood Monitor
          </div>
          <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
            <button data-tab="tab-dashboard" onclick="switchTab('tab-dashboard')" class="nav-tab inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-blue-500 text-blue-700 focus:outline-none">Dashboard</button>
            <button data-tab="tab-log" onclick="switchTab('tab-log')" class="nav-tab inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600">Log & DB</button>
            <button data-tab="tab-settings" onclick="switchTab('tab-settings')" class="nav-tab inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600">Settings</button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <header class="text-center py-6 bg-blue-200 shadow-inner">
    <h1 class="text-3xl font-bold text-blue-800">IoT EWS Flood Monitoring System</h1>
  </header>

  <!-- Tab Dashboard -->
  <div id="tab-dashboard" class="tab-content">
    <!-- Status Block -->
    <section class="p-4 flex flex-col items-center justify-center">
      <div id="statusWrapper" class="border-4 border-green-400 bg-white px-10 py-6 rounded-xl shadow-xl text-center w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-2">Status</h2>
        <p id="status" class="text-2xl font-bold text-green-500">✅ AMAN</p>
      </div>
    </section>

    <!-- Ketinggian Air Block -->
    <section class="p-4 flex flex-col items-center justify-center">
      <div class="bg-white p-6 rounded-xl shadow-xl border-4 border-blue-400 w-full max-w-lg text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Ketinggian Air</h2>
        <p id="ultrasonic" class="text-5xl font-bold text-blue-500">0 cm</p>
      </div>
    </section>

    <!-- Grafik di Dashboard -->
    <section class="p-4">
      <div class="bg-white p-6 rounded-xl shadow-xl">
        <div class="relative" style="height:400px;">
          <canvas id="flowChart"></canvas>
        </div>
      </div>
    </section>
  </div>

  <!-- Tab Log & DB -->
  <div id="tab-log" class="tab-content hidden p-4">
    <div class="bg-white p-6 rounded-xl shadow-xl">
      <div class="relative" style="height:500px;">
        <canvas id="flowChart"></canvas>
      </div>
    </div>
    <!-- Tempat untuk tabel data atau log lainnya -->
    <div class="bg-white mt-6 p-4 rounded shadow text-center text-gray-600">
      <p class="italic">📊 Database view under development...</p>
    </div>
  </div>

  <!-- Tab Settings -->
<div id="tab-settings" class="tab-content hidden p-4 space-y-6">

<!-- Device Status -->
<div class="bg-white p-6 rounded-xl shadow-xl max-w-lg mx-auto text-center">
  <h2 class="text-xl font-semibold text-gray-700 mb-4">Device Status</h2>
  <p id="connection" class="text-lg font-medium text-green-500">Checking connection...</p>
</div>

<!-- Alarm Threshold Settings -->
<div class="bg-white p-6 rounded-xl shadow-xl max-w-lg mx-auto">
  <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Alarm Threshold Settings</h2>
  <form id="thresholdForm" class="space-y-4">
    <div>
      <label for="threshold-warning" class="block font-medium text-gray-600">Waspada Threshold (cm)</label>
      <input type="number" id="threshold-warning" class="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring" min="1" value="200"/>
    </div>
    <div>
      <label for="threshold-danger" class="block font-medium text-gray-600">Bahaya Threshold (cm)</label>
      <input type="number" id="threshold-danger" class="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring" min="1" value="400"/>
    </div>
    <div class="text-center">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Simpan Batas</button>
    </div>
  </form>
</div>

<!-- Tinggi Kolam Setting -->
<div class="bg-white p-6 rounded-xl shadow-xl max-w-lg mx-auto">
  <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Tinggi Kolam</h2>
  <form id="kolamForm" class="space-y-4">
    <div>
      <label for="tinggiKolamInput" class="block font-medium text-gray-600">Tinggi Kolam (cm)</label>
      <input type="number" id="tinggiKolamInput" class="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring" min="1" value="100"/>
    </div>
    <div class="text-center">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Simpan Tinggi Kolam</button>
    </div>
  </form>
</div>

</div>

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
