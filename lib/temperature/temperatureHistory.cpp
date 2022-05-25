#include <temperatureHistory.h>
#include <math.h>

void temperautreUpdateLoop(void *parameter)
{
  assert(parameter != nullptr || parameter != NULL);
  auto temperature = (resp32flow::TemperatureHistory *)parameter;
  for (;;)
  {
    temperature->_updateHistory();
    vTaskDelay(temperature->m_sampleRate / portTICK_PERIOD_MS);
  }
}

resp32flow::TemperatureHistory::TemperatureHistory(TemperatureSensorI *a_sensor, decltype(m_sampleRate) a_sampleRate)
    : m_sampleRate(a_sampleRate),
      m_mutex(xSemaphoreCreateMutex()),
      m_sensor(a_sensor)
{
  assert(a_sensor != nullptr);
}

resp32flow::TemperatureHistory::~TemperatureHistory()
{
  if (m_taskHandler != nullptr)
    vTaskDelete(m_taskHandler);
}

void resp32flow::TemperatureHistory::begin()
{
  xTaskCreate(temperautreUpdateLoop, "temperature sensor task.", m_sampleRate, this, TASK_PRIORITY, &m_taskHandler);
}

auto resp32flow::TemperatureHistory::getChipTempHistory() const -> const history_t &
{
  return m_chipHistory;
}

auto resp32flow::TemperatureHistory::getOvenTempHistory() const -> const history_t &
{
  return m_ovenHistory;
}

void resp32flow::TemperatureHistory::_updateHistory()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  m_chipHistory.push(m_sensor->getChipTemp());
  m_ovenHistory.push(m_sensor->getOvenTemp());
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::TemperatureHistory::toJson(ArduinoJson::JsonObject a_jsonObject, size_t a_historySize) const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  a_jsonObject["historySampleRate"] = m_sampleRate;
  //TODO make to history with time.  {uptime: {oven, chip}}
  if (historySize > 0)
  {
    decltype(m_ovenHistory)::index_t historyStartIndex = m_ovenHistory.size() > a_historySize ? m_ovenHistory.size() - a_historySize : 0;

    auto jsonOvenHistory = a_jsonObject.createNestedArray("ovenHistory");
    for (auto i = m_ovenHistory.size() - 1; i >= historyStartIndex; i--)
    {
      jsonOvenHistory.add(m_ovenHistory[i]);
    }

    auto jsonChipHistory = a_jsonObject.createNestedArray("chipHistory");
    for (auto i = m_chipHistory.size() - 1; i >= historyStartIndex; i--)
    {
      jsonChipHistory.add(m_chipHistory[i]);
    }
  }

  xSemaphoreGiveRecursive(m_mutex);
}

resp32flow::TemperatureSensorI *resp32flow::TemperatureHistory::getSensor() const
{
  return m_sensor;
}