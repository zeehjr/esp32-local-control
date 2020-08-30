#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

struct PORT
{
  int port;
  uint8_t state;
  uint8_t desiredState;
};

PORT LED1;
PORT LED2;
PORT LED3;

const int DELAY = 2000;

const char *ssid = "zezin";
const char *password = "sofiaalice2016";

void setup()
{
  LED1.port = 2;
  LED2.port = 4;
  LED3.port = 5;

  LED1.state = LOW;
  LED1.desiredState = LOW;

  LED2.state = LOW;
  LED3.desiredState = LOW;

  LED3.state = LOW;
  LED3.desiredState = LOW;

  pinMode(LED1.port, OUTPUT);
  pinMode(LED2.port, OUTPUT);
  pinMode(LED3.port, OUTPUT);

  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.println();
  Serial.print("WiFi: Connecting...");

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println();

  Serial.println("WiFi: Connected!");
}

void checkPort(PORT *port)
{
  if (port->state != port->desiredState)
  {
    Serial.printf("PORT: %d - DESIRED: %d - CURRENT: %d \n", port->port, port->desiredState, port->state);
    port->state = port->desiredState;
    digitalWrite(port->port, port->state);
  }

  Serial.printf("AFTER :: Desired %d, Current %d \n", port->desiredState, port->state);
}

void checkPorts()
{
  Serial.println("Will check LED1");
  checkPort(&LED1);
  Serial.println("Will check LED2");
  checkPort(&LED2);
  Serial.println("Will check LED3");
  checkPort(&LED3);
}

void updateLeds()
{
  HTTPClient client;

  client.begin("http://192.168.0.3:3000/esp/states");

  int resCode = client.GET();

  if (resCode <= 0)
  {
    Serial.println("Cannot fetch states from server! We will wait 5 seconds.");
    delay(5000);
    return;
  }

  String response = client.getString();

  if (response.length() != 3)
  {
    Serial.println("The response from server has length different than 3.");
    return;
  }

  LED1.desiredState = response[0] == '1' ? HIGH : LOW;
  LED2.desiredState = response[1] == '1' ? HIGH : LOW;
  LED3.desiredState = response[2] == '1' ? HIGH : LOW;

  checkPorts();
}

void loop()
{
  updateLeds();

  delay(200);
}