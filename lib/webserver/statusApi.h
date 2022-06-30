#pragma once

#include <ESPAsyncWebServer.h>

namespace resp32flow
{
  class RelayController;
  class TemperatureSensorI;

  namespace webServer
  {
    namespace api
    {
      void respondStatusJson(resp32flow::TemperatureSensorI *sensor, AsyncWebServerRequest *request);
    }
  }
}