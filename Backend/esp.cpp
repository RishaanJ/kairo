#include <WiFi.h>
#include <ESPAsyncWebServer.h>

#define BUZZER_PIN 18  // GPIO 18

const char* ssid = "iPhone";      // Replace with your WiFi SSID
const char* password = "11665241";  // Replace with your WiFi password

AsyncWebServer server(80);  // Web server on port 80

void setup() {
    Serial.begin(115200);
    
    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);  // Ensure buzzer is off at start

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi...");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    
    Serial.println("\nConnected to WiFi!");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());

    // Root route
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
        request->send(200, "text/plain", "ESP32 Buzzer Control: Use /buzzer/on or /buzzer/off");
    });

    // Route to turn the buzzer ON
    server.on("/buzzer/on", HTTP_GET, [](AsyncWebServerRequest *request){
        digitalWrite(BUZZER_PIN, HIGH);
        Serial.println("Buzzer ON");
        request->send(200, "text/plain", "Buzzer ON");
    });

    // Route to turn the buzzer OFF
    server.on("/buzzer/off", HTTP_GET, [](AsyncWebServerRequest *request){
        digitalWrite(BUZZER_PIN, LOW);
        Serial.println("Buzzer OFF");
        request->send(200, "text/plain", "Buzzer OFF");
    });

    server.begin();
}

void loop() {
    // Nothing needed here, AsyncWebServer handles everything
}
