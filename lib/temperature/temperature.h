#pragma once

#include <myTypes.h>
#include <CircularArray.h>
#include <Adafruit_MAX31856.h>

namespace resp32flow
{
  class Temperature
  {
  public:
    constexpr static size_t historySize = 60;

  protected:
    constexpr static int8_t MAX31856_CS = 5;
    constexpr static int8_t MAX31856_DRDY = 16;
    constexpr static int8_t MAX31856_FLT = 17;

    Adafruit_MAX31856 m_thermo;
    CircularArray<temp_t, historySize> m_ovenHistory;
    CircularArray<temp_t, historySize> m_chipHistory;

  public:
    virtual void setup();
    virtual temp_t getOvenTemp() const;
    virtual temp_t getChipTemp() const;
    virtual const decltype(m_ovenHistory) &getOvenTempHistory() const;
    virtual const decltype(m_chipHistory) &getChipTempHistory() const;
  };

} // namespace resp32flow
