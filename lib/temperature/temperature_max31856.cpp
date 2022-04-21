#include <temperature_max31856.h>
#include <stdexcept>

resp32flow::TemperatureMAX31856::TemperatureMAX31856() : m_thermo(MAX31856_CS)
{
}

void resp32flow::TemperatureMAX31856::begin() 
{
  if(!m_thermo.begin()){
    throw std::runtime_error("Can't initialize MAX31856 sencor.");
  }

  m_thermo.setThermocoupleType(MAX31856_TCTYPE_K);
  m_thermo.setConversionMode(MAX31856_CONTINUOUS);
  m_thermo.setColdJunctionFaultThreshholds(MIN_CHIP_TEMPERATURE, MAX_CHIP_TEMPERATURE);
  m_thermo.setTempFaultThreshholds(MIN_OVEN_TEMPERATURE, MAX_OVEN_TEMPERATURE);
}