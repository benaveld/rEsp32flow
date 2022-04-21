#pragma once

#include <myTypes.h>
#include <CircularBuffer.h>
#include <Adafruit_MAX31856.h>

namespace resp32flow
{
  class Temperature
  {
  public:
    constexpr static size_t historySize = 60;
    using temp_t = resp32flow::temp_t;
    using history_t = CircularBuffer<temp_t, historySize>;

    virtual temp_t getOvenTemp() const = 0;
    virtual temp_t getChipTemp() const = 0;

    const history_t &getOvenTempHistory() const;
    const history_t &getChipTempHistory() const;
    void updateHistory();

  private:
    history_t m_ovenHistory;
    history_t m_chipHistory;
  };

} // namespace resp32flow
