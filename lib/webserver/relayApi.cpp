#include "relayApi.h"
#include <AsyncJson.h>
#include <relayController.h>
#include <profileHandler.h>

void resp32flow::webServer::api::handleRelayGet(JsonI *a_relayController, AsyncWebServerRequest *a_request)
{
  auto response = new AsyncJsonResponse(false, 1024U);
  a_relayController->toJSON(response->getRoot());
  response->setLength();
  a_request->send(response);
}

void resp32flow::webServer::api::handleJsonRelay(resp32flow::RelayController *a_relayController, resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request, JsonVariant &a_json)
{
  if (a_request->method() != HTTP_PUT)
  {
    return a_request->send(400, "text/plain", "Web API Error 5001");
  }

  if (a_json.containsKey("profileId"))
  {
    auto id = a_json["profileId"].as<int32_t>();
    a_relayController->start((*a_profileHandler)[id]);
  }

  if (a_json.containsKey("stop"))
  {
    a_relayController->stop();
  }

  a_request->send(200, "done");
}