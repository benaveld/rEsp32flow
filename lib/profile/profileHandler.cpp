#include <profileHandler.h>
#include <type_traits>
#include <string>

using resp32flow::ProfileHandler;

void resp32flow::ProfileHandler::toJson(ArduinoJson::JsonArray a_json) const
{
  for (const auto &profile : m_map)
  {
    profile.second.toJSON(a_json.createNestedObject());
  }
}

size_t resp32flow::ProfileHandler::getJsonSize() const
{
  decltype(getJsonSize()) expectedJsonSize = 128;
  for (const auto &profile : m_map)
  {
    expectedJsonSize += profile.second.getJSONSize();
  }
  return expectedJsonSize;
}

void resp32flow::ProfileHandler::addFromJson(ArduinoJson::JsonArrayConst a_json)
{
  for (auto jsonProfile : a_json)
  {
    if (!jsonProfile.containsKey(Profile::ID_JSON) || !jsonProfile.containsKey(Profile::NAME_JSON))
    {
      String str;
      ArduinoJson::serializeJsonPretty(jsonProfile, str);
      log_w("Skip loading a profile:\n%s\n", str.c_str());
      continue;
    }
    m_map.emplace(jsonProfile[Profile::ID_JSON], jsonProfile);
  }
}

void resp32flow::ProfileHandler::storeProfiles()
{
  DynamicJsonDocument doc(getJsonSize());
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
  ArduinoJson::serializeJsonPretty(doc, prettyJson);
}

void resp32flow::ProfileHandler::loadProfiles()
{
  m_preferences.begin(fileNamespace, true);
  auto strJson = m_preferences.getString(jsonFileKey, {"{}"});
  m_preferences.end();

  DynamicJsonDocument doc(strJson.length() * 3 + 16);
  deserializeJson(doc, strJson.c_str());

  if (doc.containsKey("profiles"))
  {
    addFromJson(doc["profiles"]);
  }
}

bool resp32flow::ProfileHandler::createProfile(const Profile::name_t &a_name)
{
  key_type id = 0;
  for (const auto &profilePair : m_map)
  {
    if (profilePair.first == id)
    {
      id++;
    }
  }

  auto isAdded = m_map.emplace(id, Profile{id, a_name}).second;
  if (isAdded)
    storeProfiles();
  return isAdded;
}

void ProfileHandler::setProfile(JsonVariantConst a_json)
{
  if (!a_json.containsKey(Profile::ID_JSON))
    throw Exception("json has no profile id");
  m_map.at(a_json[Profile::ID_JSON]) = mapped_type{a_json};
  storeProfiles();
}

void ProfileHandler::setProfileStep(JsonVariantConst a_json)
{
  if (!a_json.containsKey(Profile::Step::PROFILE_ID_JSON))
    throw Exception("json has no profile id");

  if (!a_json.containsKey(Profile::Step::ID_JSON))
    throw Exception("json has no step id");

  m_map.at(a_json[Profile::Step::PROFILE_ID_JSON]).setStep({a_json});
  storeProfiles();
}

void ProfileHandler::erase(const key_type &a_key)
{
  m_map.erase(a_key);
}

void ProfileHandler::eraseStep(const key_type &a_profileId, const stepId_t &a_stepId)
{
  m_map.at(a_profileId).eraseStep(a_stepId);
}