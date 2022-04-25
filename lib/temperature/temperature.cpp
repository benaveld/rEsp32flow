#include <temperature.h>
#include <myMath.h>

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
}

resp32flow::Temperature::~Temperature()
{
  if (m_taskHandler != nullptr)
    vTaskDelete(m_taskHandler);
}

void resp32flow::Temperature::begin()
{
  xTaskCreate(temperautreUpdateLoop, "temperature sensor task.", 1000, this, 2, &m_taskHandler);
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

void resp32flow::Temperature::toJson(ArduinoJson::JsonObject a_jsonObject, size_t a_historySize) const
{
  constexpr unsigned int precision = 1;
  const auto precisionMult = std::pow(10, precision);
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  a_jsonObject["oven"] = round(getOvenTemp() * precisionMult);
  a_jsonObject["chip"] = round(getChipTemp() * precisionMult);
  a_jsonObject["historySampleRate"] = m_sampleRate;
  a_jsonObject["precision"] = precision;

  if (historySize > 0)
  {
    decltype(m_ovenHistory)::index_t historyStartIndex = m_ovenHistory.size() > a_historySize ? m_ovenHistory.size() - a_historySize : 0;

    auto jsonOvenHistory = a_jsonObject.createNestedArray("ovenHistory");
    for (decltype(m_ovenHistory)::index_t i = historyStartIndex; i < m_ovenHistory.size(); i++)
    {
      jsonOvenHistory.add(round(m_ovenHistory[i] * precisionMult));
    }

    auto jsonChipHistory = a_jsonObject.createNestedArray("chipHistory");
    for (decltype(m_chipHistory)::index_t i = historyStartIndex; i < m_chipHistory.size(); i++)
    {
      jsonChipHistory.add(round(m_chipHistory[i] * precisionMult));
    }
  }

  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::Temperature::setFaultCallback(decltype(m_faultCallback) a_faultCallback)
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  m_faultCallback = a_faultCallback;
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::Temperature::_faultCallback(uint8_t a_faultCode)
{
  m_faultCallback(a_faultCode);
}