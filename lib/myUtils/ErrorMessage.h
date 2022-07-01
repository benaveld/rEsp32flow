#pragma once

#include <WString.h>

struct ErrorMessage
{
  static constexpr unsigned char ERROR_CODE_BASE = 10U;

  bool isError;
  int errorCode;
  String message;

  String fullMessage() const;
};