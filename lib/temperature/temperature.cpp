#include <temperature.h>

void temperautreUpdateLoop(void *parameter)
{
  assert(parameter != nullptr || parameter != NULL);
  auto temperature = (resp32flow::Temperature *)parameter;
  for (;;)
  {
    temperature->_updateHistory();
    vTaskDelay(temperature->m_sampleRate / portTICK_PERIOD_MS);
  }
}

resp32flow::Temperature::Temperature(decltype(m_sampleRate) a_sampleRate)
    : m_mutex(xSemaphoreCreateMutex()),
      m_sampleRate(a_sampleRate)
{
  xTaskCreate(temperautreUpdateLoop, "temperature sensor task.", 256, this, 2, &m_taskHandler);
}

resp32flow::Temperature::~Temperature()
{
  if (m_taskHandler != nullptr)
    vTaskDelete(m_taskHandler);
}

auto resp32flow::Temperature::getChipTempHistory() const -> const history_t &
{
  return m_chipHistory;
}

auto resp32flow::Temperature::getOvenTempHistory() const -> const history_t &
{
  return m_ovenHistory;
}

void resp32flow::Temperature::_updateHistory()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  m_chipHistory.push(getChipTemp());
  m_ovenHistory.push(getOvenTemp());
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::Temperature::toJson(ArduinoJson::JsonObject a_jsonObject) const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  a_jsonObject["oven"] = getOvenTemp();
  a_jsonObject["chip"] = getChipTemp();
  a_jsonObject["historySampleRate"] = m_sampleRate;
  auto jsonOvenHistory = a_jsonObject.createNestedArray("ovenHistory");

  for (decltype(m_ovenHistory)::index_t i = 0; i < m_ovenHistory.size(); i++)
  {
    jsonOvenHistory.add(m_ovenHistory[i]);
  }

  for (decltype(m_chipHistory)::index_t i = 0; i < m_chipHistory.size(); i++)
  {
    jsonOvenHistory.add(m_chipHistory[i]);
  }
  xSemaphoreGiveRecursive(m_mutex);
}