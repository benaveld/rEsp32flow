#include <Arduino.h>
#include <temperature_max31856.h>
#include <stdexcept>

struct InterruptTemperatureSensor
{
  resp32flow::TemperatureMAX31856 *temperature;
  Adafruit_MAX31856 *thermo;
} interruptTemperatureSensor{nullptr, nullptr};

void sensorFaultInterupt()
{
  if (interruptTemperatureSensor.temperature == nullptr)
    return;
  if (interruptTemperatureSensor.thermo == nullptr)
    return;

  auto &&faultCode = interruptTemperatureSensor.thermo->readFault();
  interruptTemperatureSensor.temperature->_faultCallback(faultCode);
}

resp32flow::TemperatureMAX31856::TemperatureMAX31856() : m_thermo(MAX31856_CS)
{
}

resp32flow::TemperatureMAX31856::~TemperatureMAX31856()
{
  if (interruptTemperatureSensor.temperature == this)
  {
    interruptTemperatureSensor.temperature = nullptr;
    interruptTemperatureSensor.thermo = nullptr;
  }
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

  if (interruptTemperatureSensor.temperature != nullptr )
  {
    log_e("Interrpt already set.\n");
    return;
  }

  pinMode(MAX31856_FLT, INPUT);
  interruptTemperatureSensor.temperature = this;
  interruptTemperatureSensor.thermo = &this->m_thermo;
  attachInterrupt(MAX31856_FLT, sensorFaultInterupt, FALLING);

  Temperature::begin();
}

resp32flow::temp_t resp32flow::TemperatureMAX31856::getOvenTemp() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto &&temp = const_cast<Adafruit_MAX31856 *>(&m_thermo)->readThermocoupleTemperature();
  xSemaphoreGiveRecursive(m_mutex);
  return temp;
}

resp32flow::temp_t resp32flow::TemperatureMAX31856::getChipTemp() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto &&temp = const_cast<Adafruit_MAX31856 *>(&m_thermo)->readCJTemperature();
  xSemaphoreGiveRecursive(m_mutex);
  return temp;
}

uint8_t resp32flow::TemperatureMAX31856::getFault() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto &&fault = const_cast<Adafruit_MAX31856 *>(&m_thermo)->readFault();
  xSemaphoreGiveRecursive(m_mutex);
  return fault;
}