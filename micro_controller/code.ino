#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "HX711.h"
#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials and server URL
const char* ssid = "";
const char* password = "";
const char* serverUrl = "";// posting weights
const char* serverUrl2 = "";// posting number of stocks

// HX711 pins
#define DOUT 4
#define CLK 5

// Ultrasonic Sensor pins
#define TRIG1 25
#define ECHO1 26
#define TRIG2 15
#define ECHO2 16

// Stock calculation constants
const int max_stock_per_sensor = 10;
const float base_distance_cm = 5.0;
const float object_spacing_cm = 5.0;

// LCD setup
LiquidCrystal_I2C lcd(0x27, 16, 2);

HX711 scale;

bool isWaitingForWeight = false;

void setup() {
  Serial.begin(115200);
  delay(2000);

  Wire.begin(18, 19); // SDA, SCL for ESP32

  // Connect to WiFi
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi");
  } else {
    Serial.println("WiFi connection failed!");
  }

  // LCD initialization
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");

  // HX711 setup
  scale.begin(DOUT, CLK);

  delay(1000);
  if (scale.is_ready()) {
    long reading = scale.get_units(10); // Average over 10 readings
    Serial.print("Weight reading: ");
    Serial.println(reading);
  } else {
    Serial.println("HX711 not found.");
  }

  scale.tare();
  scale.set_scale(49225);

  // Ultrasonic sensor setup
  pinMode(TRIG1, OUTPUT);
  pinMode(ECHO1, INPUT);
  pinMode(TRIG2, OUTPUT);
  pinMode(ECHO2, INPUT);

  delay(1000);
  lcd.clear();
}

// Function to read distance from ultrasonic sensor
float readDistanceCM(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000);
  float distance = duration * 0.034 / 2;
  return distance;
}

// Calculate stock based on distance
int calculateStock(float distance_cm) {
  int missing_items = int((distance_cm - base_distance_cm) / object_spacing_cm);
  int stock = max(0, max_stock_per_sensor - missing_items);
  return stock;
}

void loop() {
  // Get distance and stock
  float dist1 = readDistanceCM(TRIG1, ECHO1);
  int stock1 = calculateStock(dist1);
  float dist2 = readDistanceCM(TRIG2, ECHO2);
  int stock2 = calculateStock(dist2);
  int stock  = stock1 + stock2 ;
  Serial.print(" cm | Stock: ");
  Serial.println(stock);

  // Display stock on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Stock: ");
  lcd.print(stock);
  

  // Send stock data
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String fullUrl2 = serverUrl2;
    fullUrl2 += "?a=" + String(stock1)+"&b="+ String(stock2);

    http.begin(fullUrl2);
    int httpResponseCode2 = http.GET();

    if (httpResponseCode2 > 0) {
      Serial.print("HTTP GET Response code: ");
      Serial.println(httpResponseCode2);
      String response2 = http.getString();
      Serial.print("Server response: ");
      Serial.println(response2);
    } else {
      Serial.print("HTTP request failed. Code: ");
      Serial.println(httpResponseCode2);
    }

    http.end();
  }

  // Get weight
  float weight = scale.get_units(500);
  Serial.println(weight);

  if (!isWaitingForWeight && weight > 0.4) {
    // Upload the weight
    Serial.print("Weight: ");
    Serial.println(weight, 1);
    lcd.setCursor(0, 1);
    lcd.print("Weight: ");
    lcd.print(weight, 1);
    lcd.print(" kg");

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String fullUrl = serverUrl;
      fullUrl += "?a=" + String(weight, 1);

      http.begin(fullUrl);
      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        Serial.print("HTTP GET Response code: ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.print("Server response: ");
        Serial.println(response);
        isWaitingForWeight = true;  // Start waiting
      } else {
        Serial.print("HTTP request failed. Code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("WiFi not connected.");
    }
  }

  // If we're in waiting mode, monitor until weight is removed
  if (isWaitingForWeight) {
    if (weight <= 0.05) {
      Serial.println("Weight removed. Ready for next item.");
      isWaitingForWeight = false;
    } else {
      Serial.println("Waiting for weight to be removed...");
    }
  }

  delay(1000);
}