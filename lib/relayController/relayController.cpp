#include "relayController.h"

#include <profile.h>
#include <temperatureSensorI.h>

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
  m_pid.begin(&m_ovenTemp, &m_relayOnTime, &m_setPoint);
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
  if (m_selectedProfile != nullptr){
    log_e("RelayController already on.");
    return;
  }

  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  m_selectedProfile = &a_profile;
  m_profileStepIndex = 0;
  setupProfileStep();
  m_ovenTemp = m_temperatureSensor->getOvenTemp();
  m_relayOnTime = 0;
  m_setPoint = 100;
  m_pid.setOutputLimits(0, m_sampleRate);

  m_pid.start();

  xSemaphoreGiveRecursive(m_mutex);

  xTaskCreate(controllerLoop, "RelayController loop", 2048, this, TASK_PRIORITY, &m_taskHandler);
}

void resp32flow::RelayController::stop()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  vTaskDelete(m_taskHandler);
  digitalWrite(m_relayPin, LOW);
  m_selectedProfile = nullptr;
  m_pid.stop();
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::RelayController::setupProfileStep()
{
  if (m_selectedProfile == nullptr)
    return;
  auto &&step = getCurrentProfileStep();
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  m_pid.setCoefficients(step->Kp, step->Ki, step->Kd);
  m_stepStartTime = millis();
  xSemaphoreGiveRecursive(m_mutex);
}

void resp32flow::RelayController::tick()
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  if (m_selectedProfile == nullptr)
  {
    xSemaphoreGiveRecursive(m_mutex);
    vTaskDelete(NULL);
    return;
  }

  auto ovenTemp = m_temperatureSensor->getOvenTemp();
  auto stepTime = getStepTimer();
  auto &&step = getCurrentProfileStep();
  if (step->targetTemp <= ovenTemp && step->timer <= stepTime)
  {
    m_profileStepIndex++;
    if (m_profileStepIndex < m_selectedProfile->steps.size())
    {
      setupProfileStep();
    }
    else
    {
      m_selectedProfile = nullptr;
    }
  }

  m_pid.compute();

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

const resp32flow::ProfileStep *resp32flow::RelayController::getCurrentProfileStep() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  if (!isOn())
    return nullptr;

  decltype(getCurrentProfileStep()) stepPtr = nullptr;
  if (m_profileStepIndex < m_selectedProfile->steps.size())
    stepPtr = &m_selectedProfile->steps[m_profileStepIndex];
  xSemaphoreGiveRecursive(m_mutex);
  return stepPtr;
}

resp32flow::time_t resp32flow::RelayController::getStepTimer() const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  auto stepTime = 0;
  if (isOn())
    stepTime = millis() - m_stepStartTime;
  xSemaphoreGiveRecursive(m_mutex);
  return stepTime;
}

void resp32flow::RelayController::toJSON(ArduinoJson::JsonObject a_jsonObject) const
{
  xSemaphoreTakeRecursive(m_mutex, MUTEX_BLOCK_DELAY);
  a_jsonObject["isOn"] = m_selectedProfile != nullptr;
  // a_jsonObject["sampleRate"] = m_sampleRate;
  if (isOn())
  {
    a_jsonObject["profileId"] = m_selectedProfile->id;
    a_jsonObject["profileStepIndex"] = m_profileStepIndex;
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