#pragma once

#include <myTypes.h>
#include <CircularBuffer.h>
#include <ArduinoJson.h>
#include <temperatureSensorI.h>

namespace resp32flow
{
  class TemperatureHistory
  {
  public:
    constexpr static TickType_t MUTEX_BLOCK_DELAY = 10.0 / portTICK_PERIOD_MS; // 10ms
    constexpr static size_t historySize = 60 * 30;                             // 30min at a sample rate of once every 1000 ms
    constexpr static UBaseType_t TASK_PRIORITY = 50;

    using temp_t = resp32flow::temp_t;
    using history_t = CircularBuffer<temp_t, historySize>;

    const size_t m_sampleRate; // in ms (miliseconds)

    TemperatureHistory(TemperatureSensorI *a_sensor, decltype(m_sampleRate) a_sampleRate = 1000);
    ~TemperatureHistory();

    void begin();

    const history_t &getOvenTempHistory() const;
    const history_t &getChipTempHistory() const;

    virtual void toJson(ArduinoJson::JsonObject a_jsonObject, size_t a_historySize = 30) const;

    void _updateHistory();

  private:
    TaskHandle_t m_taskHandler = nullptr;
    history_t m_ovenHistory;
    history_t m_chipHistory;
    SemaphoreHandle_t m_mutex;
    TemperatureSensorI *m_sensor;
  };

} // namespace resp32flow
