#pragma once

#include <vector>
#include <string>
#include <ArduinoJson.h>
#include <myTypes.h>

namespace resp32flow
{
  struct ProfileStep
  {
    static constexpr auto JSON_SIZE = 128;
    double Kp, Ki, Kd;
    resp32flow::temp_t targetTemp;
    resp32flow::time_t timer;

    ProfileStep() = default;
    ProfileStep(ArduinoJson::JsonVariant a_json);
    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
  };

  struct Profile
  {
    std::string name;
    int id;
    std::vector<ProfileStep> steps;

    Profile() = default;
    Profile(int id);
    Profile(ArduinoJson::JsonVariant a_jsonObject);
    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
    size_t getJSONSize() const;
  };
}