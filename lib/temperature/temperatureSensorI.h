#pragma once

#include <myTypes.h>
#include <stdint.h>
#include <functional>
#include <vector>

namespace resp32flow
{
  class TemperatureSensorI
  {
  public:
    using temp_t = resp32flow::temp_t;
    using fault_t = uint8_t;
    using faultCallback_t = std::function<void(fault_t)>;

    virtual temp_t getOvenTemp() = 0;
    virtual temp_t getChipTemp() = 0;
    virtual fault_t getFault() = 0;

    void subscribeToFault(faultCallback_t a_faultCallback);

    void _publicsToFaultSubscribers(fault_t a_fault);

  private:
    std::vector<faultCallback_t> m_faultSubscribers;
  };
}