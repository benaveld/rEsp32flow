#include "statusApi.h"
#include <temperatureSensorI.h>
#include <temperatureHistory.h>

#include <AsyncJson.h>
#include <Arduino.h>

void resp32flow::webServer::api::respondStatusJson(resp32flow::TemperatureSensorI *a_sensor, AsyncWebServerRequest *request)
{
  auto response = new AsyncJsonResponse();
  auto doc = response->getRoot();

  doc["oven"] = a_sensor->getOvenTemp();
  doc["chip"] = a_sensor->getChipTemp();
  doc["fault"] = a_sensor->getFault();
  doc["uptime"] = millis();

  const auto faultStatusTexts = a_sensor->getFaultStatusTexts();
  auto faultStatusTextsJson = doc.createNestedArray("faultText");
  for (const auto &status : faultStatusTexts)
  {
    faultStatusTextsJson.add(status);
  }

  response->setLength();
  request->send(response);
}

void resp32flow::webServer::api::respondTemperatureJson(const resp32flow::TemperatureHistory *a_history, AsyncWebServerRequest *a_request)
{
  int64_t timeBack = 60000;
  if (a_request->hasParam("timeBack"))
    timeBack = std::strtoll(a_request->getParam("timeBack")->value().c_str(), nullptr, 10);

  auto response = new AsyncJsonResponse(false, 0x10000);
  a_history->toJson(response->getRoot(), timeBack);
  response->setLength();
  a_request->send(response);
}