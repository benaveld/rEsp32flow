#include "relayController.h"

#include <assert.h>
#include <Arduino.h>
#include <functional>
#include <profile.h>
#include <temperatureSensorI.h>
#include <freeRTOSUtils.h>

#include "relayWebSocket.h"

using rtosUtils::waitRecursiveTake;

void controllerLoop(void *parameter)
{
  auto controller = (resp32flow::RelayController *)parameter;
  while (controller->isOn())
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

auto resp32flow::RelayController::start(const Profile &a_profile) -> ErrorMessage
{
  assert(m_ws != nullptr);
  assert(m_temperatureSensor != nullptr);
  if (m_selectedProfile != nullptr)
  {
    return {true, 1001, "RelayController already on."};
  }

  waitRecursiveTake(m_mutex);
  m_selectedProfile = &a_profile;
  m_currentStepItr = stepBegin();
  auto error = setupProfileStep();
  xSemaphoreGiveRecursive(m_mutex);
  if (error.isError)
    return error;

  m_ws->updateClients();

  xTaskCreate(controllerLoop, "RelayController loop", STACK_DEPTH, this, TASK_PRIORITY, &m_taskHandler);
  return {false};
}

void resp32flow::RelayController::stop()
{
  waitRecursiveTake(m_mutex);
  m_selectedProfile = nullptr;
  m_ws->updateClients();
  digitalWrite(m_relayPin, LOW);
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::RelayController::eStop()
{
  stop();
}

auto resp32flow::RelayController::setupProfileStep() -> ErrorMessage
{
  if (m_selectedProfile == nullptr)
    return {true, 1002, "Tried to setup profile step without selecting a profile"};

  waitRecursiveTake(m_mutex);
  m_stepStartTime = millis();
  auto step = m_currentStepItr->second;
  auto ovenTemp = m_temperatureSensor->getOvenTemp();
  auto pidError = m_pid.init(ovenTemp, step.targetTemp, m_sampleRate, step.Kp, step.Ki, step.Kd);
  xSemaphoreGiveRecursive(m_mutex);
  if (pidError.isError)
    eStop();

  return pidError;
}

void resp32flow::RelayController::tick()
{
  if (!isOn())
    return;

  waitRecursiveTake(m_mutex);

  auto ovenTemp = m_temperatureSensor->getOvenTemp();
  auto stepTime = getStepTimer();
  auto step = m_currentStepItr->second;
  if (step.targetTemp <= ovenTemp && step.timer <= stepTime)
  {
    m_currentStepItr++;
    if (m_currentStepItr == stepEnd())
    {
      stop();
      xSemaphoreGiveRecursive(m_mutex);
      return;
    }
    setupProfileStep();
  }

  m_relayOnTime = m_pid.calc(ovenTemp);
  m_ws->updateClients();

  digitalWrite(m_relayPin, HIGH);
  xSemaphoreGiveRecursive(m_mutex);
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
  if (isOn())
  {
    auto info = a_jsonObject.createNestedObject("info");
    info[Profile::Step::PROFILE_ID_JSON] = m_selectedProfile->getId();
    info["stepId"] = m_currentStepItr->second.id;
    info["stepTime"] = getStepTimer();
    info["relayOnTime"] = m_relayOnTime;
    info["updateRate"] = m_sampleRate;
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

void resp32flow::RelayController::attachWebSocket(decltype(m_ws) a_ws)
{
  assert(a_ws != nullptr);
  m_ws = a_ws;
}

auto resp32flow::RelayController::stepBegin() const -> stepItr_t
{
  if(m_selectedProfile == nullptr)
    throw std::runtime_error("No selected profile.");
  return m_selectedProfile->cbegin();
}
auto resp32flow::RelayController::stepEnd() const -> stepItr_t
{
  if(m_selectedProfile == nullptr)
    throw std::runtime_error("No selected profile.");
  return m_selectedProfile->cend();
}