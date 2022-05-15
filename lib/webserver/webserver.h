#pragma once

#include <ESPAsyncWebServer.h>

namespace resp32flow
{
  class TemperatureHistory;
  class RelayController;
  class ProfileHandler;

  class WebServer
  {
  private:
    AsyncWebServer m_server;

  public:
    static constexpr auto c_hostname = "resp32flow";
    WebServer(uint16_t a_port);
    void setup(const TemperatureHistory *a_temperatureSensor, RelayController *a_relayController, ProfileHandler *a_profileHandler);
  };
}