#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "HARMONI D 9";
const char* password = "raffsahouse";

// Ganti dengan IP server kamu
const char* serverName = "http://192.168.1.192/projectopsi/simpan.php";

// Fungsi helper untuk generate float random dalam rentang tertentu
float randomInRange(float minVal, float maxVal) {
  return random(minVal * 10, maxVal * 10) / 10.0;
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Menghubungkan ke WiFi...");
  }

  Serial.println("WiFi Terhubung");
  randomSeed(analogRead(0)); // Untuk hasil acak yang bervariasi
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    // Generate data acak
    float suhu = randomInRange(25.0, 35.0);      // Suhu antara 25–35°C
    float kelembapan = randomInRange(50.0, 80.0); // Kelembapan 50–80%
    float soil = randomInRange(30.0, 70.0);       // Kelembapan tanah 30–70%
    int ultrasonik = random(700, 1100);           // Tinggi air 700–1100 cm
    int debit = random(50, 200);                  // Debit air 50–200 L/jam

    // Format JSON
    String jsonData = "{";
    jsonData += "\"suhu\":" + String(suhu, 1) + ",";
    jsonData += "\"kelembapan\":" + String(kelembapan, 1) + ",";
    jsonData += "\"soil\":" + String(soil, 1) + ",";
    jsonData += "\"ultrasonik\":" + String(ultrasonik) + ",";
    jsonData += "\"debit\":" + String(debit);
    jsonData += "}";

    int httpResponseCode = http.POST(jsonData);

    Serial.println("Data dikirim: " + jsonData);
    Serial.println("Response code: " + String(httpResponseCode));

    http.end();
  }

  delay(5000); // Kirim setiap 5 detik
}
