#include "temperatureSensorI.h"

void resp32flow::TemperatureSensorI::subscribeToFault(faultCallback_t a_faultCallback)
{
  m_faultSubscribers.emplace_back(a_faultCallback);
}

void resp32flow::TemperatureSensorI::_publicsToFaultSubscribers(fault_t a_fault)
{
  for (auto &faultCallback : m_faultSubscribers)
  {
    faultCallback(a_fault);
  }
}