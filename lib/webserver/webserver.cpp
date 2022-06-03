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
#include <relayController.h>
#include <profileHandler.h>
#include <string>
#include <ESPmDNS.h>
#include "credential.h"
#include "profileApi.h"
#include "statusApi.h"
#include "relayApi.h"

resp32flow::WebServer::WebServer(uint16_t a_port) : m_server(a_port)
{
}

void resp32flow::WebServer::setup(const TemperatureHistory *a_temperatureSensor, RelayController *a_relayController, ProfileHandler *a_profileHandler)
{
  if (a_temperatureSensor == nullptr)
    throw std::invalid_argument("a_temperatureSensor can't be pointing to null.");

  if (a_relayController == nullptr)
    throw std::invalid_argument("a_relayController can't be pointing to null.");

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
  // Respondeds to CORS pre-flight requests.
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

  m_server.on("/api/status.json", HTTP_GET, [a_temperatureSensor, a_relayController](AsyncWebServerRequest *request)
              { resp32flow::webServer::respondStatusJson(a_relayController, a_temperatureSensor->getSensor(), request); });

  m_server.on("/api/temperature.json", HTTP_GET, [a_temperatureSensor](AsyncWebServerRequest *request)
              {
                size_t historySize = 25;
                if(request->hasParam("historySize")){
                  historySize = std::strtoul(request->getParam("historySize")->value().c_str(), nullptr, 10);
                }

                auto response = new AsyncJsonResponse(false, (96U + 8U * historySize) * 4U);
                a_temperatureSensor->toJson(response->getRoot(), historySize);
                response->setLength();
                request->send(response); });

  m_server.on("/api/profiles.json", HTTP_GET, [a_profileHandler](AsyncWebServerRequest *request)
              { resp32flow::webServer::api::handleProfile(a_profileHandler, request); });
  m_server.on("/api/profiles.json", HTTP_DELETE, [a_profileHandler](AsyncWebServerRequest *request)
              { resp32flow::webServer::api::handleProfile(a_profileHandler, request); });

  auto profileJsonHandler = new AsyncCallbackJsonWebHandler(
      "/api/profiles.json", [a_profileHandler](AsyncWebServerRequest *request, JsonVariant &json)
      { resp32flow::webServer::api::handleJsonProfile(a_profileHandler, request, json); },
      1024U);
  m_server.addHandler(profileJsonHandler);

  auto relayApiHandler = new AsyncCallbackJsonWebHandler("/api/relay.json", [a_relayController, a_profileHandler](AsyncWebServerRequest *request, JsonVariant &json)
                                                         { resp32flow::webServer::api::handleJsonRelay(a_relayController, a_profileHandler, request, json); });
  m_server.addHandler(relayApiHandler);

  m_server.begin();
  MDNS.addService("http", "tcp", 80);
  log_i("started mDNS on address: http://%s.%s", c_hostname, "local");
}
