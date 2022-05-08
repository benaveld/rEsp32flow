#include "profile.h"

resp32flow::ProfileStep::ProfileStep(ArduinoJson::JsonObjectConst a_jsonObject)
    : Kp(a_jsonObject["Kp"]),
      Ki(a_jsonObject["Ki"]),
      Kd(a_jsonObject["Kd"]),
      targetTemp(a_jsonObject["targetTemp"]),
      timer(a_jsonObject["timer"])
{
}

void resp32flow::ProfileStep::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  a_jsonObject["Kp"] = Kp;
  a_jsonObject["Ki"] = Ki;
  a_jsonObject["Kd"] = Kd;
  a_jsonObject["targetTemp"] = targetTemp;
  a_jsonObject["timer"] = timer;
}

resp32flow::Profile::Profile(int a_id) : name("no name"), id(a_id)
{
}

resp32flow::Profile::Profile(ArduinoJson::JsonObjectConst a_json)
    : name(a_json["name"].as<std::string>()),
      id(a_json["id"])
{
  for (auto step : a_json["steps"].as<JsonArrayConst>())
  {
    steps.emplace_back(step.as<JsonObjectConst>());
  }
}

void resp32flow::Profile::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  a_jsonObject["name"] = name;
  a_jsonObject["id"] = id;
  auto jsonSteps = a_jsonObject.createNestedArray("steps");
  for (const auto &step : steps)
  {
    auto jsonStep = jsonSteps.createNestedObject();
    step.toJSON(jsonStep);
  }
}