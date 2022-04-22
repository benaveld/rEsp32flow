#pragma once

#include <temperature.h>

namespace resp32flow
{
  class TemperatureDummy : public Temperature
  {
  public:
    virtual temp_t getOvenTemp() const override;
    virtual temp_t getChipTemp() const override;
  };
}