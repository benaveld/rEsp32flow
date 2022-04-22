#include <temperature_dummy.h>

resp32flow::temp_t resp32flow::TemperatureDummy::getChipTemp() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  float&& temp = (esp_random() % 1000) / 100.0 + 20.0;
  xSemaphoreGiveRecursive(m_mutex);
  return temp;
}

resp32flow::temp_t resp32flow::TemperatureDummy::getOvenTemp() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  float&& temp = (esp_random() % 5000) / 100.0 + 30.0;
  xSemaphoreGiveRecursive(m_mutex);
  return temp;
}