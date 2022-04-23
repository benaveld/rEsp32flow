#pragma once
#include <math.h>

template <unsigned int POWER>
float round(float number)
{
  const float pow = std::pow(10, POWER);
  return round(number * pow) / pow;
};

float round(float value, int precision)
{
  const float p = std::pow(10, precision);
  return round(value * p) / p;
};