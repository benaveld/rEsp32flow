#pragma once

#include <map>
#include <profile.h>
#include <ArduinoJson.h>
#include <Preferences.h>

namespace resp32flow
{
  class ProfileHandler : public std::map<int32_t, Profile>
  {
  public:
    void toJson(ArduinoJson::JsonArray a_json) const;
    void addFromJson(ArduinoJson::JsonArrayConst a_json);
    void storeProfiles();
    void loadProfiles();

  private:
    constexpr static auto fileNamespace = "profile"; 
    constexpr static auto jsonFileKey = "jsonData";

    Preferences m_preferences;
  };
}