#pragma once

#include <ESPAsyncWebServer.h>

namespace resp32flow
{
  class RelayController;
  class TemperatureSensorI;

  namespace webServer
  {
    void respondStatusJson(resp32flow::RelayController *a_relayController, resp32flow::TemperatureSensorI *sensor, AsyncWebServerRequest *request);
  }
}