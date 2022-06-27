#include "profileApi.h"
#include <profileHandler.h>
#include <AsyncJson.h>
#include <climits>
#include <string>
#include <profile.h>

struct IdProp
{
  bool valid;
  unsigned long id;
};

static void handleProfileGet(resp32flow::ProfileHandler *a_profileHandler, IdProp a_id, IdProp a_stepId, AsyncWebServerRequest *a_request)
{
  if (!a_id.valid)
  {
    auto response = new AsyncJsonResponse(true, a_profileHandler->getJsonSize());
    a_profileHandler->toJson(response->getRoot());
    response->setLength();
    return a_request->send(response);
  }

  auto &&profileItr = a_profileHandler->find(a_id.id);
  auto response = new AsyncJsonResponse(false, a_profileHandler->getJsonSize());
  if (profileItr == a_profileHandler->end())
    return a_request->send(404, "text/plain", "Can't find requested profile.");

  const auto &profile = profileItr->second;
  if (a_stepId.valid)
  {
    if (profile.steps.size() <= a_stepId.id)
      return a_request->send(404, "text/plain", "Can't find requested profile step.");

    profile.steps.at(a_stepId.id).toJSON(response->getRoot());
  }
  else
  {
    profile.toJSON(response->getRoot());
  }

  response->setLength();
  a_request->send(response);
}

static void handleDeleteProfile(resp32flow::ProfileHandler *a_profileHandler, IdProp a_id, IdProp a_stepId, AsyncWebServerRequest *a_request)
{
  if (!a_id.valid)
    return a_request->send(400, "text/plain", "Not allowed to delta all profiles at once");

  auto &&profileItr = a_profileHandler->find(a_id.id);
  if (profileItr == a_profileHandler->end())
    return a_request->send(400, "text/plain", "Can't find profile.");

  if (a_stepId.valid)
  {
    profileItr->second.steps.erase(a_stepId.id);
    return a_request->send(200);
  }

  a_profileHandler->erase(profileItr);
  return a_request->send(200);
}

// TODO validate input
void resp32flow::webServer::api::handleJsonProfile(resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request, JsonVariant &a_json)
{
  if (a_request->method() != HTTP_PUT)
  {
    return a_request->send(400, "text/plain", "Web API Error: 4832");
  }

  IdProp id{false, 0};
  IdProp stepId{false, 0};
  if (a_request->hasParam("id"))
  {
    id.valid = true;
    id.id = std::strtoul(a_request->getParam("id")->value().c_str(), nullptr, 10);
    if (a_request->hasParam("stepId"))
    {
      stepId.valid = true;
      stepId.id = std::strtoul(a_request->getParam("stepId")->value().c_str(), nullptr, 10);
    }
  }
  else
  {
    return a_request->send(400, "text/plain", "No profile specified.");
  }

  int httpResponseCode = 200;
  auto profileItr = a_profileHandler->find(static_cast<int>(id.id));
  if (profileItr == a_profileHandler->end())
  {
    log_i("create new profile");
    profileItr = a_profileHandler->emplace(static_cast<int>(id.id), id.id).first;
    httpResponseCode = 201;
  }
  auto &profile = profileItr->second;

  if (stepId.valid)
  {
    ProfileStep step(a_json);
    auto result = profile.steps.insert(std::pair<decltype(step.id), decltype(step)>(step.id, step));
    if (result.second)
      httpResponseCode = 201;
  }
  else
  {
    profile = resp32flow::Profile(a_json);
  }

  a_request->send(httpResponseCode);
  a_profileHandler->storeProfiles();
}

void resp32flow::webServer::api::handleProfile(resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request)
{
  IdProp id{false, 0};
  IdProp stepId{false, 0};
  if (a_request->hasParam("id"))
  {
    id.valid = true;
    id.id = std::strtoul(a_request->getParam("id")->value().c_str(), nullptr, 10);
    if (a_request->hasParam("stepId"))
    {
      stepId.valid = true;
      stepId.id = std::strtoul(a_request->getParam("stepId")->value().c_str(), nullptr, 10);
    }
  }

  switch (a_request->method())
  {
  case HTTP_GET:
    return handleProfileGet(a_profileHandler, id, stepId, a_request);

  case HTTP_PUT:
    return a_request->send(400, "text/plain", "No json with request.");

  case HTTP_DELETE:
    return handleDeleteProfile(a_profileHandler, id, stepId, a_request);

  default:
    return a_request->send(405, "text/plain", "Unsupported request method.");
  }
}