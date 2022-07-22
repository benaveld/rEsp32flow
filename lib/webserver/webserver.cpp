#include <webserver.h>

#ifdef ESP32
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#else
#error Not a ESP32 platform
#endif

// STD
#include <functional>
#include <array>
#include <string>

// ESP
#include <SPIFFS.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <AsyncJson.h>
#include <ESPmDNS.h>

// rEsp32flow
#include <temperatureHistory.h>
#include <relayWebSocket.h>
#include <profileHandler.h>
#include "credential.h"
#include "profileApi.h"
#include "statusApi.h"

static const std::array<std::string, 6> STATIC_FILES{{"/favicon.svg",
                                                      "/asset-manifest.json",
                                                      "/manifest.json",
                                                      "/robots.txt",
                                                      "/logo192.png",
                                                      "/logo512.png"}};

static void onNotFound(AsyncWebServerRequest *request)
{
  // Respones to CORS pre-flight requests.
  if (request->method() == HTTP_OPTIONS)
  {
    auto response = request->beginResponse(200);
    response->addHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
    response->addHeader("Access-Control-Max-Age", "60"); // Cache results of a preflight request for 1 minute
    response->addHeader("Access-Control-Allow-Headers", "Content-Type");
    request->send(response);
    return;
  }
  request->send(404);
}

resp32flow::WebServer::WebServer(uint16_t a_port) : m_server(a_port)
{
}

void resp32flow::WebServer::begin(const TemperatureHistory *a_temperatureSensor, RelayWebSocket *a_relayWebSocket, ProfileHandler *a_profileHandler)
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
  m_server.onNotFound(onNotFound);

  m_server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });

  m_server.serveStatic("/static/", SPIFFS, "/static/", "max-age=31536000");
  for (auto &&staticFile : STATIC_FILES)
    m_server.serveStatic(staticFile.c_str(), SPIFFS, staticFile.c_str());

  m_server.on("/api/status.json", HTTP_GET, std::bind(respondStatusJson, a_temperatureSensor->getSensor(), _1));

  m_server.on("/api/temperature.json", HTTP_GET, std::bind(respondTemperatureJson, a_temperatureSensor, _1));

  m_server.on("/api/profiles.json", HTTP_GET | HTTP_DELETE, std::bind(handleProfile, a_profileHandler, _1));

  m_server.addHandler(new AsyncCallbackJsonWebHandler(
      "/api/profiles.json", std::bind(handleJsonProfile, a_profileHandler, _1, _2),
      1024U));

  a_relayWebSocket->attachToService(m_server);

  m_server.begin();
  MDNS.addService("http", "tcp", 80);
  log_i("started mDNS on address: http://%s.%s", c_hostname, "local");
}
