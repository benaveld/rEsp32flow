#pragma once
#include <ESPAsyncWebServer.h>

namespace resp32flow
{
  class WebServer
  {
  private:
    AsyncWebServer m_server;

  public:
    WebServer(uint16_t a_port);
    ~WebServer();
    void setup();
  };
}