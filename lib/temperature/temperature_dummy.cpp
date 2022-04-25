#include <temperature_dummy.h>
#include <Arduino.h>

auto resp32flow::TemperatureDummy::getChipTemp() -> temp_t
{
  return (esp_random() % 1000) / 100.0 + 20.0;
}

auto resp32flow::TemperatureDummy::getOvenTemp() -> temp_t
{
  return (esp_random() % 5000) / 100.0 + 30.0;
}

auto resp32flow::TemperatureDummy::getFault() -> fault_t
{
  return 0;
}