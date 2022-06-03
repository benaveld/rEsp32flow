#include <Arduino.h>
#include <temperature_max31856.h>
#include <stdexcept>
#include <functional>
#include <utility>
#include <freeRTOSUtils.h>

resp32flow::TemperatureMAX31856 *resp32flow::TemperatureMAX31856::_ptrInstance = nullptr;

void sensorFaultInterrupt()
{
  auto sensor = resp32flow::TemperatureMAX31856::getInstance();
  sensor->_publicsToFaultSubscribers(sensor->getFault());
}

resp32flow::TemperatureMAX31856::TemperatureMAX31856()
    : m_mutex(xSemaphoreCreateMutex()),
      m_thermo(MAX31856_CS)
{
}

void resp32flow::TemperatureMAX31856::begin()
{
  if (!m_thermo.begin())
  {
    throw std::runtime_error("Can't initialize MAX31856 sencor.");
  }

  m_thermo.setThermocoupleType(MAX31856_TCTYPE_K);
  m_thermo.setColdJunctionFaultThreshholds(MIN_CHIP_TEMPERATURE, MAX_CHIP_TEMPERATURE);
  m_thermo.setTempFaultThreshholds(MIN_OVEN_TEMPERATURE, MAX_OVEN_TEMPERATURE);

  pinMode(MAX31856_FLT, INPUT);
  attachInterrupt(MAX31856_FLT, sensorFaultInterrupt, FALLING);
}

resp32flow::temp_t resp32flow::TemperatureMAX31856::getOvenTemp()
{
  return rtosUtils::threadSafeRun<float>(m_mutex, [this]()
                               { return this->m_thermo.readThermocoupleTemperature(); });
}

resp32flow::temp_t resp32flow::TemperatureMAX31856::getChipTemp()
{
  return rtosUtils::threadSafeRun<float>(m_mutex, [this]()
                               { return this->m_thermo.readCJTemperature(); });
}

uint8_t resp32flow::TemperatureMAX31856::getFault()
{
  return rtosUtils::threadSafeRun<uint8_t>(m_mutex, [this]()
                               { return this->m_thermo.readFault(); });
}

resp32flow::TemperatureMAX31856 *resp32flow::TemperatureMAX31856::getInstance()
{
  if (_ptrInstance == nullptr)
  {
    _ptrInstance = new TemperatureMAX31856();
  }
  return _ptrInstance;
}

std::vector<std::string> resp32flow::TemperatureMAX31856::getFaultStatusTexts()
{
  decltype(getFaultStatusTexts()) result;
  auto fault = getFault();
  if (fault == 0)
    return result;

  if (fault & MAX31856_FAULT_CJRANGE)
    result.emplace_back("Cold Junction Range Fault");
  if (fault & MAX31856_FAULT_TCRANGE)
    result.emplace_back("Thermocouple Range Fault");
  if (fault & MAX31856_FAULT_CJHIGH)
    result.emplace_back("Cold Junction High Fault");
  if (fault & MAX31856_FAULT_CJLOW)
    result.emplace_back("Cold Junction Low Fault");
  if (fault & MAX31856_FAULT_TCHIGH)
    result.emplace_back("Thermocouple High Fault");
  if (fault & MAX31856_FAULT_TCLOW)
    result.emplace_back("Thermocouple Low Fault");
  if (fault & MAX31856_FAULT_OVUV)
    result.emplace_back("Over/Under Voltage Fault");
  if (fault & MAX31856_FAULT_OPEN)
    result.emplace_back("Thermocouple Open Fault");

  return result;
}