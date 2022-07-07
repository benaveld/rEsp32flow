#pragma once

#include <map>
#include <profile.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <stdexcept>

namespace resp32flow
{
  class ProfileHandler
  {
  public:
    using Exception = std::runtime_error;
    using map_t = std::map<Profile::id_t, Profile>;
    using key_type = map_t::key_type;
    using mapped_type = map_t::mapped_type;
    using const_iterator = map_t::const_iterator;
    using const_reverse_iterator = map_t::const_reverse_iterator;

    using stepId_t = mapped_type::stepMap_t::key_type;

  private:
    constexpr static auto fileNamespace = "profile";
    constexpr static auto jsonFileKey = "jsonData";

    Preferences m_preferences;
    map_t m_map;

    void storeProfiles();

  public:
    void toJson(ArduinoJson::JsonArray a_json) const;
    void addFromJson(ArduinoJson::JsonArrayConst a_json);
    void loadProfiles();
    size_t getJsonSize() const;

    bool createProfile(const Profile::name_t &a_name);
    void setProfile(JsonVariantConst a_json);
    void setProfileStep(JsonVariantConst a_json);

    void erase(const key_type& a_key);
    void eraseStep(const key_type& a_profileId, const stepId_t& a_stepId);

    inline const mapped_type &at(const key_type &a_key) const
    {
      return m_map.at(a_key);
    }

    inline const_iterator cbegin() const _GLIBCXX_NOEXCEPT { return m_map.cbegin(); }
    inline const_iterator cend() const _GLIBCXX_NOEXCEPT { return m_map.cend(); }
    inline const_reverse_iterator crbegin() const _GLIBCXX_NOEXCEPT { return m_map.crbegin(); }
    inline const_reverse_iterator crend() const _GLIBCXX_NOEXCEPT { return m_map.crend(); }
  };
}