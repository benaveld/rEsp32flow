#include "relayWebSocket.h"

#include <ArduinoJson.h>
#include <AsyncJson.h>

#include <functional>

#include <profileHandler.h>
#include "relayController.h"

void resp32flow::RelayWebSocket::onSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
  switch (type)
  {
  case WS_EVT_CONNECT:
    log_i("client %u connected to relay web socket.", client->id());
    break;

  case WS_EVT_DISCONNECT:
    log_i("client %u disconnected.", client->id());
    break;

  default:
    break;
  }
}

resp32flow::RelayWebSocket::RelayWebSocket(decltype(m_controller) a_relayController, decltype(m_profiles) a_profiles)
    : m_ws("/ws/relay"),
      m_controller(a_relayController),
      m_profiles(a_profiles)
{
  m_controller.attachWebSocket(this);
  using namespace std::placeholders;
  m_ws.onEvent(std::bind(&RelayWebSocket::onSocketEvent, this, _1, _2, _3, _4, _5, _6));
}

void resp32flow::RelayWebSocket::attachToService(AsyncWebServer &a_server)
{
  using std::placeholders::_1;
  a_server.addHandler(&m_ws);
  a_server.on("/api/relay", HTTP_GET | HTTP_POST, std::bind(&RelayWebSocket::handleRequest, this, _1));
}

String resp32flow::RelayWebSocket::getJsonMessage() const
{
  DynamicJsonDocument doc(JSON_SIZE);
  doc["uptime"] = esp_timer_get_time() / 1000; // Needed so that the root json is an object.
  toJSON(doc);
  char buffer[JSON_SIZE];
  serializeJson(doc, buffer);
  return String(buffer);
}

void resp32flow::RelayWebSocket::updateClients()
{
  m_ws.textAll(getJsonMessage());
}

void resp32flow::RelayWebSocket::toJSON(ArduinoJson::JsonVariant a_jsonVariant) const
{
  m_controller.toJSON(a_jsonVariant);
}

void resp32flow::RelayWebSocket::handleRequest(AsyncWebServerRequest *a_request)
{
  switch (a_request->method())
  {
  case HTTP_GET:
    return handleGet(a_request);

  case HTTP_POST:
    return handlePost(a_request);

  default:
    return a_request->send(405);
  }
}

void resp32flow::RelayWebSocket::handlePost(AsyncWebServerRequest *a_request)
{
  if (a_request->hasParam("startId"))
  {
    auto id = std::strtol(a_request->getParam("startId")->value().c_str(), nullptr, 10);
    auto profileItr = m_profiles.find(id);
    if (profileItr == m_profiles.end())
    {
      String errorMessage = "Can't find profile with id: ";
      errorMessage.concat(id);
      return a_request->send(406, "text/plain", errorMessage);
    }
    m_controller.start(profileItr->second);
  }

  if (a_request->hasParam("eStop"))
  {
    m_controller.eStop();
  }

  a_request->send(200);
}

void resp32flow::RelayWebSocket::handleGet(AsyncWebServerRequest *a_request) const
{
  auto response = new AsyncJsonResponse(false, 1024U);
  toJSON(response->getRoot());
  response->setLength();
  a_request->send(response);
}