#include "relayController.h"

resp32flow::RelayController::RelayController(decltype(m_relayPin) a_relayPin)
    : m_relayPin(a_relayPin),
      m_pid(0, 0, 0, PID::Direction::Direct)
{
}

void resp32flow::RelayController::tick(reactesp::ReactESP &a_app)
{
  if (isOn())
    return;

  auto& step = m_state.getCurrentProfileStep();
  if(step.targetTemp <= a_state.getOvenTemp() && step.timer <= a_state.getStepTimer()){
    auto& nextStep = a_state.getNextProfileStep();
    m_pid.SetTunings(nextStep.Kp, nextStep.Ki, nextStep.Kd);
  }

  auto ovenOnTime = m_pid.Run(a_state.getOvenTemp());
  digitalWrite(m_relayPin, HIGH);

  //TODO reactesp with digitalwrite low
}
