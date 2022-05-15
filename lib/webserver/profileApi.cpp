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

static void handleProfileGet(resp32flow::ProfileHandler &a_profileHandler, IdProp a_id, IdProp a_stepId, AsyncWebServerRequest *a_request)
{
  AsyncJsonResponse *response{nullptr};
  if (a_id.valid)
  {
    auto &&profileItr = a_profileHandler.find(a_id.id);
    response = new AsyncJsonResponse(false); // TODO: calculate the requeued size.
    if (profileItr != a_profileHandler.end())
    {
      const auto &profile = profileItr->second;
      if (a_stepId.valid)
      {
        if (profile.steps.size() > a_stepId.id)
        {
          profile.steps[a_stepId.id].toJSON(response->getRoot());
        }
        else
        {
          return a_request->send(404, "text/plain", "Can't find requested profile step.");
        }
      }
      else
      {
        profile.toJSON(response->getRoot());
      }
    }
    else
    {
      return a_request->send(404, "text/plain", "Can't find requested profile.");
    }
  }
  else
  {
    response = new AsyncJsonResponse(true); // TODO: calculate the requeued size.
    a_profileHandler.toJson(response->getRoot());
  }

  log_v("profile(s) json response size: %u", response->setLength());
  a_request->send(response);
}

static void handleDeleteProfile(resp32flow::ProfileHandler &a_profileHandler, IdProp a_id, IdProp a_stepId, AsyncWebServerRequest *a_request)
{
  if (!a_id.valid)
    return a_request->send(400, "text/plain", "Not allowed to deleta all profiles at once");

  auto &&profileItr = a_profileHandler.find(a_id.id);
  if (profileItr == a_profileHandler.end())
    return a_request->send(400, "text/plain", "Can't find profile.");

  if (a_stepId.valid)
  {
    auto &steps = profileItr->second.steps;

    for (size_t i = a_stepId.id; i < steps.size() - 1; i++)
    {
      steps[i] = steps[i + 1];
    }
    steps.pop_back();
    return a_request->send(200);
  }

  a_profileHandler.erase(profileItr);
  return a_request->send(200);
}

// TODO validate input
void resp32flow::webserver::api::handleJsonProfile(resp32flow::ProfileHandler &a_profileHandler, AsyncWebServerRequest *a_request, JsonVariant &a_json)
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
  auto profileItr = a_profileHandler.find(static_cast<int>(id.id));
  if (profileItr == a_profileHandler.end())
  {
    log_i("create new profile");
    profileItr = a_profileHandler.emplace(static_cast<int>(id.id), id.id).first;
    httpResponseCode = 201;
  }
  auto &profile = profileItr->second;

  if (stepId.valid)
  {
    if (stepId.id == profile.steps.size())
    {
      profile.steps.emplace_back(a_json.as<JsonObjectConst>());
      httpResponseCode = 201;
    }
    else if (stepId.id < profile.steps.size())
    {
      profile.steps[stepId.id] = resp32flow::ProfileStep(a_json.as<JsonObjectConst>());
    }
    else
    {
      return a_request->send(400, "text/plain", "Step id is outside of profile.");
    }
  }
  else
  {
    log_i("update profile");
    profile = resp32flow::Profile(a_json.as<JsonObjectConst>());
  }

  a_request->send(httpResponseCode);
  a_profileHandler.storeProfiles();
}

void resp32flow::webserver::api::handleProfile(resp32flow::ProfileHandler &a_profileHandler, AsyncWebServerRequest *a_request)
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