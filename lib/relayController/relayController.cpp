#include "relayController.h"

#include <Arduino.h>
#include <profile.h>
#include <temperatureSensorI.h>
#include <freeRTOSUtils.h>

using rtosUtils::waitRecursiveTake;

void controllerLoop(void *parameter)
{
  auto controller = (resp32flow::RelayController *)parameter;
  for (;;)
  {
    controller->tick();
  }
}

resp32flow::RelayController::RelayController(decltype(m_relayPin) a_relayPin, decltype(m_temperatureSensor) a_temperatureSensor)
    : m_relayPin(a_relayPin),
      m_temperatureSensor(a_temperatureSensor),
      m_mutex(xSemaphoreCreateRecursiveMutex())
{
  assert(a_temperatureSensor != nullptr);
}

resp32flow::RelayController::~RelayController()
{
  if (m_taskHandler != nullptr)
  {
    vTaskDelete(m_taskHandler);
    digitalWrite(m_relayPin, LOW);
  }
}

void resp32flow::RelayController::start(const Profile &a_profile)
{
  if (m_selectedProfile != nullptr)
  {
    log_e("RelayController already on.");
    return;
  }

  waitRecursiveTake(m_mutex);
  m_selectedProfile = &a_profile;
  m_currentStepItr = m_selectedProfile->steps.cbegin();
  setupProfileStep();

  xSemaphoreGiveRecursive(m_mutex);

  xTaskCreate(controllerLoop, "RelayController loop", STACK_DEPTH, this, TASK_PRIORITY, &m_taskHandler);
}

void resp32flow::RelayController::stop()
{
  waitRecursiveTake(m_mutex);
  vTaskDelete(m_taskHandler);
  digitalWrite(m_relayPin, LOW);
  m_selectedProfile = nullptr;
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::RelayController::setupProfileStep()
{
  if (m_selectedProfile == nullptr)
    return;

  waitRecursiveTake(m_mutex);
  auto step = m_currentStepItr->second;
  auto ovenTemp = m_temperatureSensor->getOvenTemp();
  m_pid.init(ovenTemp, step.targetTemp, m_sampleRate, step.Kp, step.Ki, step.Kd);
  m_stepStartTime = millis();
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::RelayController::tick()
{
  waitRecursiveTake(m_mutex);
  if (m_selectedProfile == nullptr)
  {
    xSemaphoreGiveRecursive(m_mutex);
    vTaskDelete(NULL);
    return;
  }

  auto ovenTemp = m_temperatureSensor->getOvenTemp();
  auto stepTime = getStepTimer();
  auto step = m_currentStepItr->second;
  if (step.targetTemp <= ovenTemp && step.timer <= stepTime)
  {
    m_currentStepItr++;
    if (m_currentStepItr == m_selectedProfile->steps.cend())
    {
      m_selectedProfile = nullptr;
      return;
    }
    setupProfileStep();
  }

  m_relayOnTime = m_pid.calc(ovenTemp);

  xSemaphoreGiveRecursive(m_mutex);

  digitalWrite(m_relayPin, HIGH);
  vTaskDelay(m_relayOnTime / portTICK_PERIOD_MS);
  digitalWrite(m_relayPin, LOW);
  vTaskDelay((m_sampleRate - m_relayOnTime) / portTICK_PERIOD_MS);
}

auto resp32flow::RelayController::getCurentProfile() const -> decltype(m_selectedProfile)
{
  return m_selectedProfile;
}

resp32flow::time_t resp32flow::RelayController::getStepTimer() const
{
  waitRecursiveTake(m_mutex);
  auto stepTime = 0;
  if (isOn())
    stepTime = millis() - m_stepStartTime;
  xSemaphoreGiveRecursive(m_mutex);
  return stepTime;
}

void resp32flow::RelayController::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  waitRecursiveTake(m_mutex);
  a_jsonObject["isOn"] = m_selectedProfile != nullptr;
  a_jsonObject["sampleRate"] = m_sampleRate;
  if (isOn())
  {
    a_jsonObject["profileId"] = m_selectedProfile->id;
    a_jsonObject["profileStepId"] = m_currentStepItr->second.id;
    a_jsonObject["stepTime"] = getStepTimer();
    a_jsonObject["relayOnTime"] = m_relayOnTime;
    a_jsonObject["updateRate"] = m_sampleRate;
  }
  xSemaphoreGiveRecursive(m_mutex);
}

bool resp32flow::RelayController::setSampleRate(decltype(m_sampleRate) a_sampleRate)
{
  if (isOn())
    return false;

  m_sampleRate = a_sampleRate;
  return true;
}

auto resp32flow::RelayController::getSampleRate() const -> decltype(m_sampleRate)
{
  return m_sampleRate;
}

bool resp32flow::RelayController::isOn() const
{
  return m_selectedProfile != nullptr;
}