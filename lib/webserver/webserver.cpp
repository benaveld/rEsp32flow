#include <webserver.h>

#ifdef ESP32
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#else
#error Not a ESP32 platform
#endif

#include <SPIFFS.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <temperature.h>
#include <string>

const char *ssid = "";
const char *password = "";

resp32flow::WebServer::WebServer(uint16_t a_port) : m_server(a_port)
{
}

void resp32flow::WebServer::setup(const Temperature *a_temperatureSensor, const RelayController *a_relayController)
{
  if (a_temperatureSensor == nullptr)
    throw std::invalid_argument("a_temperatureSensor can't point to null.");

  if (!SPIFFS.begin())
  {
    log_e("An Error has occurred while mounting SPIFFS");
    ESP.restart();
  }

  WiFi.begin(ssid, password);

  int notConnectedCounter = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    log_i("Connecting to WiFi..");
    notConnectedCounter++;
    if (notConnectedCounter > 60)
    {
      log_w("Resetting due to Wifi not connecting...");
      ESP.restart();
    }
  }

  log_i("local IP: %s", WiFi.localIP().toString().c_str());

  m_server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });

  m_server.serveStatic("/static/", SPIFFS, "/static/");
  m_server.serveStatic("/favicon.ico", SPIFFS, "/favicon.ico");
  m_server.serveStatic("/asset-manifest.json", SPIFFS, "/asset-manifest.json");

  m_server.on("/api/temperature.json", HTTP_GET, [a_temperatureSensor](AsyncWebServerRequest *request)
              {
                auto historySizePtr = request->getParam("historySize");
                auto historySize = historySizePtr != nullptr ? std::strtoul(historySizePtr->value().c_str(), nullptr,10) : 30;

                auto response = request->beginResponseStream("application/json");
                StaticJsonDocument<1024> doc;
                auto&& jsonTemperatureObject = doc.createNestedObject();
                a_temperatureSensor->toJson(jsonTemperatureObject, historySize);
                serializeJson(doc, *response);
                request->send(response); });

  m_server.begin();
}