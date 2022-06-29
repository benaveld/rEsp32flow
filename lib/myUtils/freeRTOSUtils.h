#pragma once

#include <freertos/semphr.h>
#include <functional>
#include <type_traits>

namespace rtosUtils
{
  template <typename T>
  static T threadSafeRun(SemaphoreHandle_t &a_xMutex, std::function<T()> &&a_func)
  {
    while (xSemaphoreTakeRecursive(a_xMutex, portTICK_PERIOD_MS) != pdTRUE)
      ;
    auto &&result = a_func();
    xSemaphoreGiveRecursive(a_xMutex);
    return result;
  }

  static void waitRecursiveTake(const SemaphoreHandle_t &a_xMutex, TickType_t a_blockMs = 4)
  {
    while (xSemaphoreTakeRecursive(a_xMutex, a_blockMs / portTICK_PERIOD_MS) != pdTRUE)
      ;
  }
}