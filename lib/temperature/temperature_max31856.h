#pragma once

#include <temperature.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_MAX31856.h>

namespace resp32flow
{
  class TemperatureMAX31856 : public resp32flow::Temperature
  {
  public:
    constexpr static int8_t MAX31856_CS = 5;
    constexpr static int8_t MAX31856_DATA_RDY = 16;
    constexpr static int8_t MAX31856_FLT = 17;

    constexpr static int8_t MAX_CHIP_TEMPERATURE = 70;
    constexpr static int8_t MIN_CHIP_TEMPERATURE = -10;
    constexpr static float MAX_OVEN_TEMPERATURE = 300;
    constexpr static float MIN_OVEN_TEMPERATURE = -10;

    TemperatureMAX31856();
    ~TemperatureMAX31856();

    virtual void begin() override;
    virtual temp_t getOvenTemp() const override;
    virtual temp_t getChipTemp() const override;
    virtual uint8_t getFault() const override;

  private:
    Adafruit_MAX31856 m_thermo;
  };
}