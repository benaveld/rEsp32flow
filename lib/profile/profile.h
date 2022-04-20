#pragma once

#include <vector>
#include <string>
#include <ArduinoJson.h>
#include <myTypes.h>

namespace resp32flow
{
  struct ProfileStep
  {
    double Kp, Ki, Kd;
    resp32flow::temp_t targetTemp;
    resp32flow::time_t timer;

    ProfileStep() = default;
    ProfileStep(ArduinoJson::JsonObjectConst a_json);
    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
  };

  struct Profile
  {
    std::string name;
    std::vector<ProfileStep> steps;

    Profile() = default;
    Profile(ArduinoJson::JsonObjectConst a_jsonObject);
    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
  };
}