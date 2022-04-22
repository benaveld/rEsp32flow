#include <Arduino.h>
#include <Wire.h>
#include <webserver.h>
#include <temperature_dummy.h>

  using namespace resp32flow;

TemperatureDummy temperatureSensor;
WebServer webServer(80);


void setup()
{
  Serial.begin(115200);

  log_i("setup");
  webServer.setup(&temperatureSensor, nullptr);
}

void loop()
{
}