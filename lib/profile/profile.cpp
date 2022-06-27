#include "profile.h"

resp32flow::ProfileStep::ProfileStep(ArduinoJson::JsonVariant a_jsonObject)
    : Kp(a_jsonObject["Kp"]),
      Ki(a_jsonObject["Ki"]),
      Kd(a_jsonObject["Kd"]),
      targetTemp(a_jsonObject["temperature"]),
      timer(a_jsonObject["timer"].as<time_t>() * 1000),
      id(a_jsonObject["id"]),
      profileId(a_jsonObject["profileId"])
{
}

void resp32flow::ProfileStep::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  a_jsonObject["Kp"] = Kp;
  a_jsonObject["Ki"] = Ki;
  a_jsonObject["Kd"] = Kd;
  a_jsonObject["temperature"] = targetTemp;
  a_jsonObject["timer"] = timer / 1000;
  a_jsonObject["id"] = id;
  a_jsonObject["profileId"] = profileId;
}

resp32flow::Profile::Profile(int a_id) : name("no name"), id(a_id)
{
}

resp32flow::Profile::Profile(ArduinoJson::JsonVariant a_json)
    : name(a_json["name"].as<std::string>()),
      id(a_json["id"])
{
  JsonArray jsonSteps = a_json["steps"];
  for (const auto& jsonStep : jsonSteps)
  {
    ProfileStep step(jsonStep);
    steps.emplace(step.id, step);
  }
}

void resp32flow::Profile::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  a_jsonObject["name"] = name;
  a_jsonObject["id"] = id;
  auto jsonSteps = a_jsonObject.createNestedArray("steps");
  for (const auto &step : steps)
  {
    step.second.toJSON(jsonSteps.createNestedObject());
  }
}

size_t resp32flow::Profile::getJSONSize() const
{
  return 128 + steps.size() * ProfileStep::JSON_SIZE;
}