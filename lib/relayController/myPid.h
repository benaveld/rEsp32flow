#pragma once

#include <pid.h>

namespace resp32flow
{
  class MyPid
  {
  public:
    using input_t = float;
    using result_t = float;
    using pid_t = float;

    void init(input_t a_input, input_t a_target, result_t a_max, pid_t a_Kp, pid_t a_Ki, pid_t a_Kd) noexcept(false);
    result_t calc(input_t a_input);

  private:
    static constexpr result_t m_min = 0;

    bool m_init = false;
    input_t m_target = 0;
    result_t m_max = 0;
    epid_t m_pid;
  };
}