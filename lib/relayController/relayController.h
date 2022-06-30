#pragma once

#include <myTypes.h>
#include <ArduinoJson.h>
#include <jsonI.h>
#include <profile.h>
#include <myPid.h>

namespace resp32flow
{
  class TemperatureSensorI;
  class RelayWebSocket;

  class RelayController : public JsonI
  {
  private:
    using stepItr_t = decltype(Profile::steps)::const_iterator;

    constexpr static UBaseType_t TASK_PRIORITY = 10U;
    constexpr static auto STACK_DEPTH = 2048U;

    MyPid m_pid;
    const uint8_t m_relayPin;
    TemperatureSensorI *m_temperatureSensor = nullptr;
    RelayWebSocket *m_ws = nullptr;

    TaskHandle_t m_taskHandler = nullptr;
    SemaphoreHandle_t m_mutex;

    const Profile *m_selectedProfile = nullptr;
    stepItr_t m_currentStepItr;

    time_t m_stepStartTime = 0;
    double m_relayOnTime = 0;    // linked into pid output
    double m_sampleRate = 20000; // in ms

    void setupProfileStep();
    void stop();

  public:
    RelayController(decltype(m_relayPin) a_relayPin, decltype(m_temperatureSensor) a_temperatureSensor);
    ~RelayController();
    void start(const Profile &a_profile);
    void eStop();
    void tick();

    decltype(m_selectedProfile) getCurentProfile() const;
    resp32flow::time_t getStepTimer() const;
    decltype(m_sampleRate) getSampleRate() const;
    bool setSampleRate(decltype(m_sampleRate));
    bool isOn() const;
    void attachWebSocket(decltype(m_ws) a_ws);

    virtual void toJSON(ArduinoJson::JsonObject a_jsonObject) const override;
  };
} // namespace reflow