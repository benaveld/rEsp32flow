#pragma once

#include <freertos/semphr.h>
#include <functional>
#include <type_traits>

namespace rtosUtils
{
  static void waitRecursiveTake(const SemaphoreHandle_t &a_xMutex, TickType_t a_blockMs = 4)
  {
    while (xSemaphoreTakeRecursive(a_xMutex, a_blockMs / portTICK_PERIOD_MS) != pdTRUE)
      ;
  }

  template <typename T>
  static T threadSafeRun(SemaphoreHandle_t &a_xMutex, std::function<T()> &&a_func, TickType_t a_blockMs = 4)
  {
    waitRecursiveTake(a_xMutex, a_blockMs);
    auto &&result = a_func();
    xSemaphoreGiveRecursive(a_xMutex);
    return result;
  }
}