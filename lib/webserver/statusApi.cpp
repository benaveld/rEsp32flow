#include "statusApi.h"
#include <temperatureSensorI.h>
#include <temperatureHistory.h>
#include <apiUtil.h>

#include <AsyncJson.h>
#include <Arduino.h>

void resp32flow::webServer::api::respondStatusJson(resp32flow::TemperatureSensorI *a_sensor, AsyncWebServerRequest *request)
{
  try
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
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    request->send(400, "text/plain", e.what());
  }
}

void resp32flow::webServer::api::respondTemperatureJson(const resp32flow::TemperatureHistory *a_history, AsyncWebServerRequest *a_request)
{
  using util::api::getParameter;
  try
  {
    auto timeBack = getParameter<long long>(a_request, "timeBack");
    if (!timeBack.first || timeBack.second <= 0)
      return a_request->send(406, "text/plain", "Missing timeBack");

    auto response = new AsyncJsonResponse(false, 0x20000);
    a_history->toJson(response->getRoot(), timeBack.second);
    response->setLength();
    a_request->send(response);
  }
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    a_request->send(400, "text/plain", e.what());
  }
}