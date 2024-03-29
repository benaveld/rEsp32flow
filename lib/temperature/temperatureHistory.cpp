#include <temperatureHistory.h>
#include <math.h>
#include <freeRTOSUtils.h>

using rtosUtils::waitRecursiveTake;

void temperatureUpdateLoop(void *parameter)
{
  assert(parameter != nullptr || parameter != NULL);
  auto temperature = (resp32flow::TemperatureHistory *)parameter;
  for (;;)
  {
    try
    {
      temperature->_updateHistory();
      vTaskDelay(temperature->m_sampleRate / portTICK_PERIOD_MS);
    }
    catch (std::exception &e)
    {
      log_e("%s", e.what());
    }
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
  xTaskCreate(temperatureUpdateLoop, "temperature sensor task.", 2048, this, TASK_PRIORITY, &m_taskHandler);
}

auto resp32flow::TemperatureHistory::getHistory() const -> const history_t &
{
  return m_history;
}

void resp32flow::TemperatureHistory::_updateHistory()
{
  waitRecursiveTake(m_mutex);
  State currentState;
  currentState.uptime = millis();
  currentState.chip = m_sensor->getChipTemp();
  currentState.oven = m_sensor->getOvenTemp();
  m_history.push(currentState);
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::TemperatureHistory::toJson(ArduinoJson::JsonObject a_jsonObject, time_t a_timeBack) const
{
  waitRecursiveTake(m_mutex);
  a_jsonObject["historySampleRate"] = m_sampleRate;

  auto &&uptime = millis();
  auto time = uptime > a_timeBack ? uptime - a_timeBack : 0;
  auto jsonHistory = a_jsonObject.createNestedArray("history");
  for (auto i = m_history.size() - 1; i >= 0; i--)
  {
    auto &&pastState = m_history[i];
    if (pastState.uptime < time)
      break;

    auto jsonState = jsonHistory.createNestedObject();
    jsonState["uptime"] = pastState.uptime;
    jsonState["oven"] = pastState.oven;
    jsonState["chip"] = pastState.chip;
  }

  xSemaphoreGiveRecursive(m_mutex);
}

resp32flow::TemperatureSensorI *resp32flow::TemperatureHistory::getSensor() const
{
  return m_sensor;
}