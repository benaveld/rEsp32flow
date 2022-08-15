#include "profileApi.h"
#include <profileHandler.h>
#include <AsyncJson.h>
#include <climits>
#include <string>
#include <profile.h>
#include <type_traits>
#include <apiUtil.h>

using util::api::getParameter;
using idParam_t = util::api::getParameterReturn_t<resp32flow::Profile::id_t>;

constexpr auto ID_PARAM = "id";
constexpr auto STEP_ID_PARAM = "stepId";

static void handleProfileGet(resp32flow::ProfileHandler *a_profileHandler, idParam_t a_id, idParam_t a_stepId, AsyncWebServerRequest *a_request)
{
  try
  {
    if (!a_id.first)
    {
      auto response = new AsyncJsonResponse(true, a_profileHandler->getJsonSize());
      a_profileHandler->toJson(response->getRoot());
      response->setLength();
      return a_request->send(response);
    }

    auto &&profile = a_profileHandler->at(a_id.second);
    auto response = new AsyncJsonResponse(false, a_profileHandler->getJsonSize());

    if (a_stepId.first)
    {
      profile.getStep(a_stepId.second).toJSON(response->getRoot());
    }
    else
    {
      profile.toJSON(response->getRoot());
    }

    response->setLength();
    a_request->send(response);
  }
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    a_request->send(400, "text/plain", e.what());
  }
}

static void handleDeleteProfile(resp32flow::ProfileHandler *a_profileHandler, idParam_t a_id, idParam_t a_stepId, AsyncWebServerRequest *a_request)
{
  if (!a_id.first)
    return a_request->send(400, "text/plain", "Not allowed to delta all profiles at once");
  try
  {

    if (a_stepId.first)
    {
      a_profileHandler->eraseStep(a_id.second, a_stepId.second);
    }
    else
    {
      a_profileHandler->erase(a_id.second);
    }
    a_request->send(200);
  }
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    a_request->send(400, "text/plain", e.what());
  }
}

// TODO validate input
void resp32flow::webServer::api::handleJsonProfile(resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request, JsonVariant &a_json)
{
  try
  {
    if (a_request->method() & (HTTP_PUT | HTTP_POST) == 0)
    {
      return a_request->send(405);
    }

    auto id = getParameter<idParam_t::second_type>(a_request, ID_PARAM);
    if (!id.first)
    {
      if (!a_json.containsKey("name"))
        return a_request->send(400);

      auto isAdded = a_profileHandler->createProfile(a_json[Profile::NAME_JSON]);
      if (isAdded)
        return a_request->send(201);
      return a_request->send(406, "text/plain", "Profile already exist.");
    }

    auto stepId = getParameter<idParam_t::second_type>(a_request, STEP_ID_PARAM);
    if (stepId.first)
      a_profileHandler->setProfileStep(a_json);
    else
      a_profileHandler->setProfile(a_json);

    a_request->send(200);
  }
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    a_request->send(400, "text/plain", e.what());
  }
}

void resp32flow::webServer::api::handleProfile(resp32flow::ProfileHandler *a_profileHandler, AsyncWebServerRequest *a_request)
{
  try
  {
    auto &&id = getParameter<idParam_t::second_type>(a_request, ID_PARAM);
    auto &&stepId = getParameter<idParam_t::second_type>(a_request, STEP_ID_PARAM);

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
  catch (std::exception &e)
  {
    log_e("%s", e.what());
    a_request->send(400, "text/plain", e.what());
  }
}