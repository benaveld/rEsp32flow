#pragma once

#include <ESPAsyncWebServer.h>

namespace resp32flow
{
  class RelayController;
  class TemperatureSensorI;
  class TemperatureHistory;

  namespace webServer
  {
    namespace api
    {
      void respondStatusJson(resp32flow::TemperatureSensorI *sensor, AsyncWebServerRequest *request);
      void respondTemperatureJson(const resp32flow::TemperatureHistory *a_history, AsyncWebServerRequest *a_request);
    }
  }
}