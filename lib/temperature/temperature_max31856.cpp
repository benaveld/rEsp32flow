#include <Arduino.h>
#include <temperature_max31856.h>
#include <stdexcept>

resp32flow::TemperatureMAX31856 *resp32flow::TemperatureMAX31856::_ptrInstance = nullptr;

void sensorFaultInterupt()
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
  attachInterrupt(MAX31856_FLT, sensorFaultInterupt, FALLING);
}

resp32flow::temp_t resp32flow::TemperatureMAX31856::getOvenTemp()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto &&temp = const_cast<Adafruit_MAX31856 *>(&m_thermo)->readThermocoupleTemperature();
  xSemaphoreGiveRecursive(m_mutex);
  return temp;
}

resp32flow::temp_t resp32flow::TemperatureMAX31856::getChipTemp()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto &&temp = const_cast<Adafruit_MAX31856 *>(&m_thermo)->readCJTemperature();
  xSemaphoreGiveRecursive(m_mutex);
  return temp;
}

uint8_t resp32flow::TemperatureMAX31856::getFault()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto &&fault = const_cast<Adafruit_MAX31856 *>(&m_thermo)->readFault();
  xSemaphoreGiveRecursive(m_mutex);
  return fault;
}

resp32flow::TemperatureMAX31856 *resp32flow::TemperatureMAX31856::getInstance()
{
  if (_ptrInstance == nullptr)
  {
    _ptrInstance = new TemperatureMAX31856();
  }
  return _ptrInstance;
}