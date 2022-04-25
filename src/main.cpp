#include <Arduino.h>
#include <Wire.h>
#include <webserver.h>
#include <temperature_max31856.h>
#include <temperatureHistory.h>
#include <relayController.h>

using namespace resp32flow;

WebServer webServer{80};
TemperatureHistory *temperatureHistory{nullptr};
RelayController *relayController{nullptr};

void setup()
{
  Serial.begin(115200);

  auto temperatureSensor = TemperatureMAX31856::getInstance();
  temperatureSensor->begin();
  temperatureHistory = new TemperatureHistory(temperatureSensor);
  temperatureHistory->begin();

  relayController = new RelayController(32, temperatureSensor);

  webServer.setup(temperatureHistory, relayController);

  log_v("setup done");
}

void loop()
{
}