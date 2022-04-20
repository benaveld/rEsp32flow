#include <webserver.h>

#include <SPIFFS.h>
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#else
#error Not a ESP32 platform
#endif
#include <ESPAsyncWebServer.h>

const char *ssid = "yourNetworkName";
const char *password = "yourNetworkPassword";

resp32flow::WebServer::WebServer(uint16_t a_port) : m_server(a_port)
{
}

void resp32flow::WebServer::setup()
{
  if (!SPIFFS.begin())
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println(WiFi.localIP());

  m_server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/index.html", "text/html"); });

  m_server.on("/demo.js", HTTP_GET, [](AsyncWebServerRequest *request)
              { request->send(SPIFFS, "/demo.js", "text/javascript"); });

  m_server.begin();
}