#pragma once

#include <CircularBuffer.h>
#include <ArduinoJson.h>
#include <temperatureSensorI.h>

namespace resp32flow
{
  class TemperatureHistory
  {
  public:
    using time_t = decltype(esp_timer_get_time());
    using temp_t = TemperatureSensorI::temp_t;

    struct State {
      time_t uptime;
      temp_t oven;
      temp_t chip;
    };

    constexpr static TickType_t MUTEX_BLOCK_DELAY = 4.0 / portTICK_PERIOD_MS;
    constexpr static size_t historySize = 60 * 30;                             // 30min at a sample rate of once every 1000 ms
    constexpr static UBaseType_t TASK_PRIORITY = 50;

    using history_t = CircularBuffer<State, historySize>;

    const size_t m_sampleRate; // in ms (miliseconds)

    TemperatureHistory(TemperatureSensorI *a_sensor, decltype(m_sampleRate) a_sampleRate = 1000);
    ~TemperatureHistory();

    void begin();

    const history_t &getHistory() const;

    virtual void toJson(ArduinoJson::JsonObject a_jsonObject, time_t a_timeBack) const;

    void _updateHistory();
    TemperatureSensorI* getSensor() const;

  private:
    TaskHandle_t m_taskHandler = nullptr;
    history_t m_history;
    SemaphoreHandle_t m_mutex;
    TemperatureSensorI *m_sensor;
  };

} // namespace resp32flow
