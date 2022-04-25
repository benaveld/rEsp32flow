#pragma once

#include <temperatureSensorI.h>

namespace resp32flow
{
  class TemperatureDummy : public TemperatureSensorI
  {
  public:
    virtual temp_t getOvenTemp() override;
    virtual temp_t getChipTemp() override;
    virtual fault_t getFault() override;
  };
}