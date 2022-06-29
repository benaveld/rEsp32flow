#pragma once

#include <ArduinoJson.h>

class JsonI
{
public:
  virtual void toJSON(ArduinoJson::JsonObject a_jsonObject) const = 0;
};