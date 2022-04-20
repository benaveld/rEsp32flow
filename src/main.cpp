#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <ReactESP.h>
#include <Adafruit_MAX31856.h>
#include <webserver.h>

reactesp::ReactESP app;

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  app.tick();
}