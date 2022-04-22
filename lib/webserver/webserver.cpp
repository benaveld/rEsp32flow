#include <webserver.h>

#include <SPIFFS.h>
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#else
#error Not a ESP32 platform
#endif
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <temperature.h>

const char *ssid = "yourNetworkName";
const char *password = "yourNetworkPassword";

resp32flow::WebServer::WebServer(uint16_t a_port) : m_server(a_port)
{
}

void resp32flow::WebServer::setup(const Temperature *a_temperatureSensor, const RelayController *a_relayController)
{
  if (!SPIFFS.begin())
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  WiFi.begin(ssid, password);

  int notConnectedCounter = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    log_i("Connecting to WiFi..\n");
    notConnectedCounter++;
    if (notConnectedCounter > 60)
    {
      log_w("Resetting due to Wifi not connecting...");
      ESP.restart();
    }
  }

  log_i("local IP: \n", WiFi.localIP().toString());

  m_server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });

  m_server.on("/demo.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/demo.js", "text/javascript"); });

  m_server.on("/api/temperature.json", HTTP_GET, [a_temperatureSensor](AsyncWebServerRequest *request)
              {
    auto response = request->beginResponseStream("application/json");
    StaticJsonDocument<1024> doc;
    a_temperatureSensor->toJson(doc.as<JsonObject>());
    serializeJson(doc, *response);
    request->send(response); });

  m_server.begin();
  log_v("web server started.\n");
}