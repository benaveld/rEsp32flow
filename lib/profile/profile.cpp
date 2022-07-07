#include "profile.h"

#include <stdexcept>

using resp32flow::Profile;

resp32flow::Profile::Step::Step(ArduinoJson::JsonVariantConst a_jsonObject)
    : Kp(a_jsonObject["Kp"]),
      Ki(a_jsonObject["Ki"]),
      Kd(a_jsonObject["Kd"]),
      targetTemp(a_jsonObject["temperature"]),
      timer(a_jsonObject["timer"].as<time_t>() * 1000),
      id(a_jsonObject[Profile::Step::ID_JSON]),
      profileId(a_jsonObject[Profile::Step::PROFILE_ID_JSON])
{
}

void resp32flow::Profile::Step::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  a_jsonObject["Kp"] = Kp;
  a_jsonObject["Ki"] = Ki;
  a_jsonObject["Kd"] = Kd;
  a_jsonObject["temperature"] = targetTemp;
  a_jsonObject["timer"] = timer / 1000;
  a_jsonObject[Profile::Step::ID_JSON] = id;
  a_jsonObject[Profile::Step::PROFILE_ID_JSON] = profileId;
}

resp32flow::Profile::Profile(decltype(id) a_id, const decltype(name) &a_name) : name(a_name), id(a_id)
{
}

resp32flow::Profile::Profile(ArduinoJson::JsonVariantConst a_json)
    : name(a_json[NAME_JSON].as<decltype(name)>()),
      id(a_json[ID_JSON])
{
  if (!a_json.containsKey(ID_JSON))
    throw std::runtime_error("No id in json");

  if (!a_json.containsKey(NAME_JSON))
    throw std::runtime_error("No name in json");

  JsonArrayConst jsonSteps = a_json[STEPS_JSON];
  for (auto jsonStep : jsonSteps)
  {
    decltype(steps)::mapped_type step(jsonStep);
    steps.emplace(step.id, step);
  }
}

void resp32flow::Profile::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  a_jsonObject[NAME_JSON] = name;
  a_jsonObject[ID_JSON] = id;
  auto jsonSteps = a_jsonObject.createNestedArray(STEPS_JSON);
  for (const auto &step : steps)
  {
    step.second.toJSON(jsonSteps.createNestedObject());
  }
}

size_t resp32flow::Profile::getJSONSize() const
{
  return 128 + steps.size() * Step::JSON_SIZE;
}

bool Profile::setStep(const stepMap_t::mapped_type &a_step)
{
  if (a_step.profileId != id)
    throw std::invalid_argument("steps profile id must match");

  auto added = steps.emplace(a_step.id, a_step);
  if (!added.second)
  {
    steps.at(added.first->first) = a_step;
  }
  return added.second;
}

auto Profile::getSteps() const -> const stepMap_t &
{
  return steps;
}

auto Profile::getStep(const stepMap_t::key_type &a_id) const -> const Step &
{
  return steps.at(a_id);
}

void Profile::eraseStep(const stepMap_t::key_type &a_id)
{
  steps.erase(a_id);
}
