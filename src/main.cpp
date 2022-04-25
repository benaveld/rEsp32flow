#include <Arduino.h>
#include <Wire.h>
#include <webserver.h>
#include <temperature_max31856.h>
#include <temperatureHistory.h>

using namespace resp32flow;

WebServer webServer{80};
TemperatureHistory *temperatureHistory{nullptr};

void setup()
{
  Serial.begin(115200);

  auto temperatureSensor = TemperatureMAX31856::getInstance();
  temperatureSensor->begin();
  temperatureHistory = new TemperatureHistory(temperatureSensor);
  temperatureHistory->begin();

  webServer.setup(temperatureHistory, nullptr);

  log_v("setup done");
}

void loop()
{
}