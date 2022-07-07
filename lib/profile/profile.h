#pragma once

#include <map>
#include <string>
#include <ArduinoJson.h>
#include <myTypes.h>

namespace resp32flow
{
  class Profile
  {
  public:
    using id_t = long;
    using name_t = String;

    class Step
    {
    public:
      using id_t = long;

      static constexpr auto JSON_SIZE = 128;

      static constexpr auto ID_JSON = "id";
      static constexpr auto PROFILE_ID_JSON = "profileId";

      Step(ArduinoJson::JsonVariantConst a_json);
      void toJSON(ArduinoJson::JsonObject a_jsonObject) const;

      double Kp, Ki, Kd;
      resp32flow::temp_t targetTemp;
      resp32flow::time_t timer;
      id_t id;
      long profileId;
    };

    using stepMap_t = std::map<id_t, Step>;

    static constexpr auto ID_JSON = "id";
    static constexpr auto NAME_JSON = "name";
    static constexpr auto STEPS_JSON = "steps";

  private:
    name_t name;
    id_t id;
    stepMap_t steps;

  public:
    Profile(id_t a_id, const name_t &a_name);
    Profile(ArduinoJson::JsonVariantConst a_jsonObject);

    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
    size_t getJSONSize() const;

    const name_t &getName() const _GLIBCXX_NOEXCEPT { return name; };
    id_t getId() const _GLIBCXX_NOEXCEPT { return id; };

    bool setStep(const stepMap_t::mapped_type &a_step);
    const stepMap_t &getSteps() const;
    const Step &getStep(const stepMap_t::key_type &a_id) const;
    void eraseStep(const stepMap_t::key_type &a_id);

    inline stepMap_t::const_iterator cbegin() const _GLIBCXX_NOEXCEPT { return steps.cbegin(); }
    inline stepMap_t::const_iterator cend() const _GLIBCXX_NOEXCEPT { return steps.cend(); }
    inline stepMap_t::const_reverse_iterator crbegin() const _GLIBCXX_NOEXCEPT { return steps.crbegin(); }
    inline stepMap_t::const_reverse_iterator crend() const _GLIBCXX_NOEXCEPT { return steps.crend(); }
  };
}