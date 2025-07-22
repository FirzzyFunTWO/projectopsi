#include <WiFi.h>
#include <HTTPClient.h>
#include <NewPing.h>
#include <ArduinoJson.h>

const char* ssid = "HARMONI D 9_Plus";
const char* password = "raffsahouse";

// Konfigurasi sensor ultrasonik
#define TRIGGER_PIN 4
#define ECHO_PIN 5
#define MAX_DISTANCE 400

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

// Ganti dengan endpoint Cloudflare Tunnel kamu
const char* serverName = "https://fragrances-federation-tank-cargo.trycloudflare.com/projectopsi/simpan.php";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Menghubungkan ke WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Terhubung!");
}

void loop() {
  delay(3000); // Kirim data setiap 3 detik

  // Baca data dari sensor ultrasonik
  int distance = sonar.ping_cm();

  // Filter pembacaan tidak valid
  if (distance == 0 || distance < 30 || distance > MAX_DISTANCE) {
    Serial.println("❌ Jarak tidak valid, abaikan.");
    return;
  }

  // Buat payload JSON
  StaticJsonDocument<100> jsonDoc;
  jsonDoc["ultrasonik"] = distance;

  String jsonString;
  serializeJson(jsonDoc, jsonString);

  Serial.print("📤 Mengirim data: ");
  Serial.println(jsonString);

  // Kirim ke server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonString);
    Serial.print("📶 Respon server: ");
    Serial.println(httpResponseCode);

    http.end();
  } else {
    Serial.println("⚠️ WiFi tidak terhubung");
  }
}
