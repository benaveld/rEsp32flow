#pragma once

#include <freertos/semphr.h>
#include <functional>
#include <type_traits>

namespace rtosUtils
{
  template <typename T>
  T threadSafeRun(SemaphoreHandle_t &a_xMutex, std::function<T()> &&a_func)
  {
    while (xSemaphoreTakeRecursive(a_xMutex, portTICK_PERIOD_MS) != pdTRUE)
      ;
    auto &&result = a_func();
    xSemaphoreGiveRecursive(a_xMutex);
    return result;
  }
}