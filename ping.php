<?php
// Simple check to simulate ping response (you can add real ping logic if desired)
$esp_ip = "192.168.1.100";  // Replace with your ESP32 IP

$ping_result = shell_exec("ping -c 1 $esp_ip");
if ($ping_result !== null) {
    http_response_code(200);  // ESP is online
} else {
    http_response_code(500);  // ESP is offline
}
?>
