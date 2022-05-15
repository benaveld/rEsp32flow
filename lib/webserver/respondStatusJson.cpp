#include "respondStatusJson.h"
#include <relayController.h>
#include <temperatureSensorI.h>
#include <AsyncJson.h>
#include <math.h>

void resp32flow::webserver::respondStatusJson(resp32flow::RelayController &a_relayController, resp32flow::TemperatureSensorI &a_sensor, AsyncWebServerRequest *request)
{
  constexpr unsigned int precision = 1;
  const auto precisionMult = std::pow(10, precision);

  auto response = new AsyncJsonResponse();
  auto doc = response->getRoot();

  doc["oven"] = round(a_sensor.getOvenTemp() * precisionMult);
  doc["chip"] = round(a_sensor.getChipTemp() * precisionMult);
  doc["precision"] = precision;
  doc["fault"] = a_sensor.getFault();

  a_relayController.toJSON(doc);

  response->setLength();
  request->send(response);
}