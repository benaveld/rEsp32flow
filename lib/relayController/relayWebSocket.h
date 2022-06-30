#pragma once

#include <AsyncWebSocket.h>
#include <WString.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

namespace resp32flow
{
  class RelayController;
  class ProfileHandler;

  class RelayWebSocket 
  {
  private:
    AsyncWebSocket m_ws;
    RelayController &m_controller;
    ProfileHandler &m_profiles;

    String getJsonMessage() const;
    void onSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);

  public:
    static constexpr auto JSON_SIZE = 1024U;

    RelayWebSocket(decltype(m_controller) a_relayController, decltype(m_profiles) a_profiles);
    void attachToService(AsyncWebServer &a_server);

    void updateClients();

    void handleRequest(AsyncWebServerRequest *a_request);
    void handlePost(AsyncWebServerRequest *a_request);
    void handleGet(AsyncWebServerRequest *a_request) const;

    void toJSON(ArduinoJson::JsonVariant a_jsonVariant) const;
  };
}