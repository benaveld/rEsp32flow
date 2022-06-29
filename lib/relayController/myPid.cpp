#include "myPid.h"
#include <stdexcept>
#include <assert.h>

void resp32flow::MyPid::init(input_t a_input, input_t a_target, result_t a_max, pid_t a_Kp, pid_t a_Ki, pid_t a_Kd)
{
  m_target = a_target;
  m_max = a_max;
  auto error = epid_init(&m_pid, a_input, a_input, 0, a_Kp, a_Ki, a_Kd);

  if (error != EPID_ERR_NONE)
  {
    throw std::runtime_error("Error setting up pid controller.");
  }
  m_init = true;
}

resp32flow::MyPid::result_t resp32flow::MyPid::calc(input_t a_input)
{
  assert(m_init);

  epid_pid_calc(&m_pid, m_target, a_input);
  epid_pid_sum(&m_pid, m_min, m_max);

  return m_pid.y_out;
}