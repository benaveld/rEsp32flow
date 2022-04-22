#pragma once

#include <myTypes.h>
#include <CircularBuffer.h>
#include <Adafruit_MAX31856.h>
#include <ArduinoJson.h>

namespace resp32flow
{
  class Temperature
  {
  public:
    constexpr static TickType_t MUTEX_BLOCK_DELAY = 10.0 / portTICK_PERIOD_MS; // 10ms
    constexpr static size_t historySize = 60*30; // 30min

    using temp_t = resp32flow::temp_t;
    using history_t = CircularBuffer<temp_t, historySize>;

    const size_t m_sampleRate; // in ms

    virtual temp_t getOvenTemp() const = 0;
    virtual temp_t getChipTemp() const = 0;

    Temperature(decltype(m_sampleRate) = 1000);
    ~Temperature();

    const history_t &getOvenTempHistory() const;
    const history_t &getChipTempHistory() const;

    virtual void toJson(ArduinoJson::JsonObject a_jsonObject) const;
    void _updateHistory();

  protected:
    SemaphoreHandle_t m_mutex;

  private:
    TaskHandle_t m_taskHandler = nullptr;
    history_t m_ovenHistory;
    history_t m_chipHistory;
  };

} // namespace resp32flow
