#pragma once

#include <temperature.h>
#include <Adafruit_MAX31856.h>

namespace resp32flow
{
  class TemperatureMAX31856 : resp32flow::Temperature
  {
  public:
    constexpr static int8_t MAX31856_CS = 5;
    constexpr static int8_t MAX31856_DRDY = 16;
    constexpr static int8_t MAX31856_FLT = 17;

    constexpr static int8_t MAX_CHIP_TEMPERATURE = 70;
    constexpr static int8_t MIN_CHIP_TEMPERATURE = -10;
    constexpr static int8_t MAX_OVEN_TEMPERATURE = 300;
    constexpr static int8_t MIN_OVEN_TEMPERATURE = -10;
    
    TemperatureMAX31856();
    void begin();
    virtual temp_t getOvenTemp() const override;
    virtual temp_t getChipTemp() const override;

  private:
    Adafruit_MAX31856 m_thermo;
  };
}