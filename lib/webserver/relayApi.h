#pragma once

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

class JsonI;

namespace resp32flow
{
  class RelayController;
  class ProfileHandler;

  namespace webServer
  {
    namespace api
    {
      void handleRelayGet(JsonI *a_relayController, AsyncWebServerRequest *request);
      void handleJsonRelay(resp32flow::RelayController *a_relayController, resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *request, JsonVariant &json);
    }
  }
}