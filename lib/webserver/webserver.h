#pragma once
#include <ESPAsyncWebServer.h>

namespace resp32flow
{
  class Temperature;
  class RelayController;

  class WebServer
  {
  private:
    AsyncWebServer m_server;

  public:
    WebServer(uint16_t a_port);
    void setup(const Temperature *a_temperatureSensor, const RelayController *a_relayController);
  };
}