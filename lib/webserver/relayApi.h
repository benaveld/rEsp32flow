#pragma once

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

namespace resp32flow
{
  class RelayController;
  class ProfileHandler;

  namespace webserver
  {
    namespace api
    {
      void handleJsonRelay(resp32flow::RelayController &a_relayController, resp32flow::ProfileHandler &a_profileHandler, AsyncWebServerRequest *request, JsonVariant &json);
    }
  }
}