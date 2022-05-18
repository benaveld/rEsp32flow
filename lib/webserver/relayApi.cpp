#include "relayApi.h"
#include <relayController.h>
#include <profileHandler.h>

void resp32flow::webserver::api::handleJsonRelay(resp32flow::RelayController *a_relayController, resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request, JsonVariant &a_json)
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
}