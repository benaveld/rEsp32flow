#pragma once

#include <map>
#include <string>
#include <ArduinoJson.h>
#include <myTypes.h>

namespace resp32flow
{
  using id_t = int;
  struct ProfileStep
  {
    static constexpr auto JSON_SIZE = 128;
    double Kp, Ki, Kd;
    resp32flow::temp_t targetTemp;
    resp32flow::time_t timer;
    id_t id, profileId;

    ProfileStep() = default;
    ProfileStep(ArduinoJson::JsonVariant a_json);
    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
  };

  struct Profile
  {
    std::string name;
    id_t id;
    std::map<decltype(id), ProfileStep> steps;

    Profile() = default;
    Profile(int id);
    Profile(ArduinoJson::JsonVariant a_jsonObject);
    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
    size_t getJSONSize() const;
  };
}