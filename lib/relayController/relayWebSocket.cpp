#include "relayWebSocket.h"

#include <ArduinoJson.h>
#include <AsyncJson.h>

#include <functional>
#include <type_traits>

#include <profileHandler.h>
#include <apiUtil.h>
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
  doc["isOn"] = m_controller.isOn(); // Needed so that the root json is an object.
  toJSON(doc);
  char buffer[JSON_SIZE];
  serializeJson(doc, buffer);
  return String(buffer);
}

void resp32flow::RelayWebSocket::updateClients()
{
  while (!m_ws.availableForWriteAll())
  {
    delay(10);
  }
  m_ws.textAll(getJsonMessage());
}

void resp32flow::RelayWebSocket::toJSON(ArduinoJson::JsonVariant a_jsonVariant) const
{
  m_controller.toJSON(a_jsonVariant);
}

void resp32flow::RelayWebSocket::handleRequest(AsyncWebServerRequest *a_request)
{
  try
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
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    a_request->send(400, "text/plain", e.what());
  }
}

void resp32flow::RelayWebSocket::handlePost(AsyncWebServerRequest *a_request)
{
  using util::api::getParameter;
  auto startId = getParameter<Profile::id_t>(a_request, "startId");
  if (startId.first)
  {
    auto &&profile = m_profiles.at(startId.second);
    auto &&error = m_controller.start(profile);
    if (error.isError)
    {
      const auto &message = error.fullMessage();
      log_e("%s", message.c_str());
      return a_request->send(406, "text/plain", message);
    }
  }

  if (a_request->hasParam("eStop"))
  {
    m_controller.eStop();
  }

  auto sampleRate = getParameter<long long>(a_request, "sampleRate");
  if (sampleRate.first)
  {
    if (sampleRate.second <= 0)
      return a_request->send(406, "text/plain", "sampleRate can't be less then 1.");

    if (sampleRate.second >= ULONG_MAX)
      return a_request->send(406, "text/plain", "sampleRate can't be larger then 4294967296.");

    m_controller.setSampleRate(static_cast<std::remove_reference<decltype(m_controller)>::type::SampleRate_t>(sampleRate.second));
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