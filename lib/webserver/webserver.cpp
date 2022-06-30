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
#include <AsyncJson.h>
#include <temperatureHistory.h>
#include <relayWebSocket.h>
#include <profileHandler.h>
#include <string>
#include <ESPmDNS.h>
#include "credential.h"
#include "profileApi.h"
#include "statusApi.h"
#include <functional>

resp32flow::WebServer::WebServer(uint16_t a_port) : m_server(a_port)
{
}

void resp32flow::WebServer::setup(const TemperatureHistory *a_temperatureSensor, RelayWebSocket *a_relayWebSocket, ProfileHandler *a_profileHandler)
{
  using namespace std::placeholders;
  using namespace resp32flow::webServer::api;
  if (a_temperatureSensor == nullptr)
    throw std::invalid_argument("a_temperatureSensor can't be pointing to null.");

  if (a_relayWebSocket == nullptr)
    throw std::invalid_argument("a_relayWebSocket can't be pointing to null.");

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

  if (!MDNS.begin(c_hostname))
  {
    log_e("Error starting mDNS");
    while (1)
    {
      delay(1000);
    }
  }

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  // Respones to CORS pre-flight requests.
  m_server.onNotFound([](AsyncWebServerRequest *request)
                      {
  if (request->method() == HTTP_OPTIONS) {
    auto response = request->beginResponse(200);
    response->addHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
    response->addHeader("Access-Control-Max-Age", "60"); // Cache results of a preflight request for 1 minute
    response->addHeader("Access-Control-Allow-Headers", "Content-Type");
    request->send(response);
  } else {
    request->send(404);
  } });

  m_server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });

  m_server.serveStatic("/static/", SPIFFS, "/static/");
  m_server.serveStatic("/favicon.ico", SPIFFS, "/favicon.ico");
  m_server.serveStatic("/asset-manifest.json", SPIFFS, "/asset-manifest.json");

  m_server.on("/api/status.json", HTTP_GET, std::bind(respondStatusJson, a_temperatureSensor->getSensor(), _1));

  m_server.on("/api/temperature.json", HTTP_GET, [a_temperatureSensor](AsyncWebServerRequest *request)
              {
                int64_t timeBack = 60000;
                if(request->hasParam("timeBack")){
                  timeBack = std::strtoll(request->getParam("timeBack")->value().c_str(), nullptr, 10);
                }

                auto response = new AsyncJsonResponse(false, 0x10000);
                a_temperatureSensor->toJson(response->getRoot(), timeBack);
                response->setLength();
                request->send(response); });

  m_server.on("/api/profiles.json", HTTP_GET | HTTP_DELETE, std::bind(handleProfile, a_profileHandler, _1));

  m_server.addHandler(new AsyncCallbackJsonWebHandler(
      "/api/profiles.json", std::bind(handleJsonProfile, a_profileHandler, _1, _2),
      1024U));

  a_relayWebSocket->attachToService(m_server);

  m_server.begin();
  MDNS.addService("http", "tcp", 80);
  log_i("started mDNS on address: http://%s.%s", c_hostname, "local");
}
