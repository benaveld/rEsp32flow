#include "myPid.h"
#include <stdexcept>
#include <assert.h>
#include <esp32-hal-log.h>

ErrorMessage resp32flow::MyPid::init(input_t a_input, input_t a_target, result_t a_max, pid_t a_Kp, pid_t a_Ki, pid_t a_Kd)
{
  m_target = a_target;
  m_max = a_max;
  auto error = epid_init(&m_pid, a_input, a_input, 0, a_Kp, a_Ki, a_Kd);

  switch (error)
  {
  case EPID_ERR_NONE:
    m_init = true;
    return {false};

  case EPID_ERR_INIT:
    return {true, 1101, "Can't initialize PID."};

  case EPID_ERR_FLT:
    return {true, 1102, "Unknown PID fault."};

  default:
    return {true, 1103, "Should not be able to reach here."};
  }
}

resp32flow::MyPid::result_t resp32flow::MyPid::calc(input_t a_input)
{
  assert(m_init);

  epid_pid_calc(&m_pid, m_target, a_input);
  epid_pid_sum(&m_pid, m_min, m_max);

  return m_pid.y_out;
}