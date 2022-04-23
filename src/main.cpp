#include <Arduino.h>
#include <Wire.h>
#include <webserver.h>
#include <temperature_max31856.h>

  using namespace resp32flow;

TemperatureMAX31856 temperatureSensor;
WebServer webServer(80);

TaskHandle_t task;

void setup()
{
  Serial.begin(115200);

  log_i("setup");
  webServer.setup(&temperatureSensor, nullptr);
  temperatureSensor.begin();
  log_i("setup done");
}

void loop()
{
}