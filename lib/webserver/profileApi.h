#pragma once

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

namespace resp32flow
{
  class ProfileHandler;

  namespace webServer
  {
    namespace api
    {
      void handleProfile(resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request);
      void handleJsonProfile(resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *request, JsonVariant &json);
    }
  }
}