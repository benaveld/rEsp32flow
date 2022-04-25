#pragma once

#include <Arduino.h>
#include <PID_v2.h>
#include <myTypes.h>
#include <ArduinoJson.h>

namespace resp32flow
{
  class TemperatureSensorI;
  class Profile;
  class ProfileStep;

  class RelayController
  {
  private:
    constexpr static TickType_t MUTEX_BLOCK_DELAY = 10.0 / portTICK_PERIOD_MS; // 10ms
    constexpr static UBaseType_t TASK_PRIORITY = 10;

    const uint8_t m_relayPin;
    TemperatureSensorI *m_temperatureSensor{nullptr};
    const Profile *m_selectedProfile{nullptr};
    TaskHandle_t m_taskHandler{nullptr};
    PID m_pid;
    SemaphoreHandle_t m_mutex;

    size_t m_profileStep = 0;
    time_t m_stepStartTime = 0;
    double m_relayOnTime = 0; // linked into pid output
    double m_ovenTemp = 0;    // input to pid
    double m_setPoint = 0;    // setPoint for pid
    double m_sampleRate = 5000;

    void setupProfileStep();

  public:
    RelayController(decltype(m_relayPin) a_relayPin, decltype(m_temperatureSensor) a_temperatureSensor);
    ~RelayController();
    void start(const Profile &a_profile);
    void stop();
    void tick();

    decltype(m_selectedProfile) getCurentProfile() const;
    const resp32flow::ProfileStep *getCurrentProfileStep() const;
    resp32flow::time_t getStepTimer() const;

    void toJSON(ArduinoJson::JsonObject a_jsonObject) const;
  };
} // namespace reflow