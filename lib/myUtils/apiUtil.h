#include <string>
#include <ESPAsyncWebServer.h>
#include <stdlib.h>
#include <stdexcept>
#include <functional>
#include <type_traits>

namespace util
{
  namespace api
  {
    template <typename T>
    using getParameterReturn_t = std::pair<bool, T>;

    template <typename T, class = typename std::enable_if<std::is_arithmetic<T>::value>::type>
    getParameterReturn_t<T> getParameter(std::function<T(const char *, char **, int)> a_converter, const AsyncWebServerRequest *a_request, const String &a_param, int a_base = 10) 
    {
      if (a_request->hasParam(a_param))
        return {true, a_converter(a_request->getParam(a_param)->value().c_str(), nullptr, a_base)};
      return {false, 0};
    }

    template <typename T>
    getParameterReturn_t<T> getParameter(const AsyncWebServerRequest *a_request, const String &a_param, int a_base = 10)
    {
      throw std::logic_error("Unsupported type");
    }

    template <>
    inline getParameterReturn_t<long> getParameter(const AsyncWebServerRequest *a_request, const String &a_param, int a_base)
    {
      return getParameter<long>(std::strtol, a_request, a_param, a_base);
    }

    template <>
    inline getParameterReturn_t<long long> getParameter(const AsyncWebServerRequest *a_request, const String &a_param, int a_base)
    {
      return getParameter<long long>(std::strtoll, a_request, a_param, a_base);
    }
  }
}