#include <profileHandler.h>

void resp32flow::ProfileHandler::toJson(ArduinoJson::JsonArray a_json) const
{
  for (const auto &profile : *this)
  {
    profile.second.toJSON(a_json.createNestedObject());
  }
}

void resp32flow::ProfileHandler::addFromJson(ArduinoJson::JsonArray a_json)
{
  for (auto jsonProfile : a_json)
  {
    if (!jsonProfile.containsKey("id") || !jsonProfile.containsKey("name"))
    {
      std::string str;
      serializeJsonPretty(jsonProfile, str);
      log_w("Skip loading a profile:\n%s\n", str.c_str());
      continue;
    }
    emplace(jsonProfile["id"], jsonProfile);
  }
}

void resp32flow::ProfileHandler::storeProfiles()
{
  auto expectedJsonSize = 128;
  for(const auto& profile : *this)
  {
    expectedJsonSize += profile.second.getJSONSize();
  }

  DynamicJsonDocument doc(expectedJsonSize);
  auto jsonArray = doc.createNestedArray("profiles");
  toJson(jsonArray);

  String strJson;
  serializeJson(doc, strJson);
  if (!m_preferences.begin(fileNamespace, false))
  {
    log_e("Could not open flash");
    return;
  }
  m_preferences.putString(jsonFileKey, strJson.c_str());
  m_preferences.end();

  String prettyJson;
  serializeJsonPretty(doc, prettyJson);
  Serial.printf("Storing profiles:\n%s\n", prettyJson.c_str());
}

void resp32flow::ProfileHandler::loadProfiles()
{
  m_preferences.begin(fileNamespace, true);
  auto strJson = m_preferences.getString(jsonFileKey, {"{}"});
  m_preferences.end();

  DynamicJsonDocument doc(strJson.length() * 3);
  deserializeJson(doc, strJson.c_str());

  if (doc.containsKey("profiles"))
  {
    addFromJson(doc["profiles"]);
  }
}