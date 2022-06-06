#include <Arduino.h>
#include <Wire.h>
#include <webserver.h>
#include <temperature_max31856.h>
#include <temperatureHistory.h>
#include <relayController.h>
#include <profileHandler.h>

using namespace resp32flow;

static constexpr uint8_t RELAY_PIN = 32;

WebServer webServer{80};
TemperatureHistory *temperatureHistory{nullptr};
RelayController *relayController{nullptr};
ProfileHandler *profileHandler{nullptr};

void setup()
{
  Serial.begin(115200);

  auto temperatureSensor = TemperatureMAX31856::getInstance();
  temperatureSensor->begin();
  temperatureHistory = new TemperatureHistory(temperatureSensor);
  temperatureHistory->begin();

  pinMode(RELAY_PIN, OUTPUT);
  relayController = new RelayController(RELAY_PIN, temperatureSensor);

  profileHandler = new ProfileHandler();
  profileHandler->loadProfiles();

  webServer.setup(temperatureHistory, relayController, profileHandler);

  log_v("setup done");
}

void loop() {}