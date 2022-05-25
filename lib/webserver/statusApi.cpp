#include "statusApi.h"
#include <relayController.h>
#include <temperatureSensorI.h>
#include <AsyncJson.h>

void resp32flow::webserver::respondStatusJson(resp32flow::RelayController *a_relayController, resp32flow::TemperatureSensorI *a_sensor, AsyncWebServerRequest *request)
{
  auto response = new AsyncJsonResponse();
  auto doc = response->getRoot();

  doc["oven"] = a_sensor->getOvenTemp();
  doc["chip"] = a_sensor->getChipTemp();
  doc["fault"] = a_sensor->getFault();
  doc["uptime"] = esp_timer_get_time() / 1000; // microseconds to miliseconds

  const auto faultStatusTexts = a_sensor->getFaultStatusTexts();
  auto faultStatusTextsJson = doc.createNestedArray("faultText");
  for (const auto& status : faultStatusTexts)
  {
    faultStatusTextsJson.add(status);
  }

  a_relayController->toJSON(doc);

  response->setLength();
  request->send(response);
}