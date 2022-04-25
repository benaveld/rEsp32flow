#include <profileHandler.h>

void resp32flow::ProfileHandler::toJson(ArduinoJson::JsonArray a_json) const
{
  for (const auto &profile : *this)
  {
    profile.second.toJSON(a_json.createNestedObject());
  }
}

void resp32flow::ProfileHandler::addFromJson(ArduinoJson::JsonArrayConst a_json)
{
  for (const auto &jsonProfile : a_json)
  {
    auto &&id = std::strtol(jsonProfile["id"], nullptr, 10);
    emplace(id, jsonProfile.as<ArduinoJson::JsonObjectConst>());
  }
}

void resp32flow::ProfileHandler::storeProfiles()
{
  DynamicJsonDocument doc(1024);
  toJson(doc.as<ArduinoJson::JsonArray>());

  String strJson;
  serializeJson(doc, strJson);
  m_preferences.begin(fileNamespace);
  m_preferences.putString(jsonFileKey, strJson);
  m_preferences.end();
}

void resp32flow::ProfileHandler::loadProfiles()
{
  m_preferences.begin(fileNamespace);
  auto strJson = m_preferences.getString(jsonFileKey, {"[]"});
  m_preferences.end();

  DynamicJsonDocument doc(strJson.length());
  deserializeJson(doc, strJson);

  addFromJson(doc.as<ArduinoJson::JsonArrayConst>());
}