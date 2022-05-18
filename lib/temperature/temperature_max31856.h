#pragma once

#include <temperatureSensorI.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_MAX31856.h>

namespace resp32flow
{
  class TemperatureMAX31856 : public resp32flow::TemperatureSensorI
  {
  private:
    static TemperatureMAX31856 *_ptrInstance;

    SemaphoreHandle_t m_mutex;
    Adafruit_MAX31856 m_thermo;

    TemperatureMAX31856();

  public:
    constexpr static TickType_t MUTEX_BLOCK_DELAY = 10.0 / portTICK_PERIOD_MS; // 10ms

    constexpr static int8_t MAX31856_CS = 5;
    constexpr static int8_t MAX31856_DATA_RDY = 16;
    constexpr static int8_t MAX31856_FLT = 17;

    constexpr static int8_t MAX_CHIP_TEMPERATURE = 50;
    constexpr static int8_t MIN_CHIP_TEMPERATURE = -10;
    constexpr static float MAX_OVEN_TEMPERATURE = 300;
    constexpr static float MIN_OVEN_TEMPERATURE = -10;

    void begin();
    virtual temp_t getOvenTemp() override;
    virtual temp_t getChipTemp() override;
    virtual uint8_t getFault() override;
    virtual std::vector<std::string> getFaultStatusTexts() override;

    TemperatureMAX31856(TemperatureMAX31856 &other) = delete;
    TemperatureMAX31856 &operator=(const TemperatureMAX31856 &) = delete;
    TemperatureMAX31856 &operator=(const TemperatureMAX31856 &&) = delete;

    static TemperatureMAX31856 *getInstance();
  };
}