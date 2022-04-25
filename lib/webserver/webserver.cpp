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
#include "credential.h"

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

  m_server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });

  m_server.serveStatic("/static/", SPIFFS, "/static/");
  m_server.serveStatic("/favicon.ico", SPIFFS, "/favicon.ico");
  m_server.serveStatic("/asset-manifest.json", SPIFFS, "/asset-manifest.json");

  m_server.on("/api/temperature.json", HTTP_GET, [a_temperatureSensor](AsyncWebServerRequest *request)
              {
                auto historySizePtr = request->getParam("historySize");
                auto historySize = historySizePtr != nullptr ? std::strtoul(historySizePtr->value().c_str(), nullptr,10) : 25;

                // I don't understand why it needs to be times 4 to get the size in bytes.
                auto response = new AsyncJsonResponse(false, (96U + 8U * historySize) * 4U);
                response->addHeader("Server", "resp32flow web server");
                auto&& jsonTemperatureObject = response->getRoot(); 
                a_temperatureSensor->toJson(jsonTemperatureObject, historySize);
                auto&& responseSize = response->setLength();
                log_v("temperautre json response size: %u", responseSize * 4);
                request->send(response); });

  m_server.on("/api/controller.json", HTTP_GET, [a_relayController](AsyncWebServerRequest *request)
              {
    auto response = new AsyncJsonResponse();
    response->addHeader("Server", "resp32flow web server");
    a_relayController->toJSON(response->getRoot());
    log_v("relay controller json response size: %u", response->setLength() * 4);
    request->send(response); });

  m_server.on("/api/controller", HTTP_POST, [a_relayController](AsyncWebServerRequest *request)
              {
    if(request->hasParam("runProfile", true, false))
    {
      auto p = request->getParam("runProfile", true, false);
      log_i("post request", p->value().c_str());
    } });

  m_server.on("/api/profiles.json", HTTP_GET, [a_profileHandler](AsyncWebServerRequest *request)
              {
                AsyncJsonResponse* response {nullptr};
                if(request->hasParam("id", false, false)){
                  auto profileId = std::strtoul(request->getParam("id", false, false)->value().c_str(), nullptr, 10);
                  auto profile = a_profileHandler->find(profileId);
                  response = new AsyncJsonResponse(); //TODO: calculate the requeued size.
                  if(profile != a_profileHandler->end()){
                    profile->second.toJSON(response->getRoot());
                  }
                } else {
                  response = new AsyncJsonResponse(); //TODO: calculate the requeued size.
                  a_profileHandler->toJson(response->getRoot());
                }
                log_v("profile(s) json response size: %u", response->setLength() * 4);
                request->send(response); });

  m_server.begin();
}