#include "ErrorMessage.h"

String ErrorMessage::fullMessage() const {
  return "Error " + String(errorCode, ERROR_CODE_BASE) + ": " + message;
}