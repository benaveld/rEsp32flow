#pragma once

#include <Arduino.h>
#include <PID_v2.h>
#include <ReactESP.h>
#include <myTypes.h>
#include <profile.h>
#include <temperature.h>
#include <ArduinoJson.h>

namespace resp32flow
{
  class RelayController
  {
  private:
    constexpr static TickType_t MUTEX_BLOCK_DELAY = 10.0 / portTICK_PERIOD_MS; // 10ms

    const uint8_t m_relayPin;
    const Temperature &m_temperatureSensor;
    const Profile *m_selectedProfile = nullptr;
    SemaphoreHandle_t m_mutex;
    TaskHandle_t m_taskHandler = nullptr;
    PID m_pid;

    size_t m_profileStep = 0;
    time_t m_stepStartTime = 0;
    double m_relayOnTime = 0; // linked into pid output
    double m_ovenTemp;        // input to pid
    double m_setPoint;        // setPoint for pid
    double m_sampleRate = 5000;

    void setupProfileStep();

  public:
    RelayController(decltype(m_relayPin) a_relayPin, decltype(m_temperatureSensor) a_temperatureSensor);
    void start(const Profile &a_profile);
    void stop();
    void tick();

    decltype(m_selectedProfile) getCurentProfile() const;
    const resp32flow::ProfileStep *getCurrentProfileStep() const;
    resp32flow::time_t getStepTimer() const;

    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
    void fromJSON(ArduinoJson::JsonObject a_jsonObject);
  };
} // namespace reflow