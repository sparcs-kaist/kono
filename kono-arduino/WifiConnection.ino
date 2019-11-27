#include <ESP8266WiFi.h>
#include <Wire.h>
#include <ESP8266HTTPClient.h>
#include "Grove_Human_Presence_Sensor.h"

#include <Wire.h>

#include "Grove_Human_Presence_Sensor.h" 

AK9753 movementSensor;

// need to adjust these sensitivities lower if you want to detect more far
// but will introduce error detection
float sensitivity_presence = 6.0;
float sensitivity_movement = 10.0;
int detect_interval = 30; //milliseconds
PresenceDetector detector(movementSensor, sensitivity_presence, sensitivity_movement, detect_interval);

uint32_t last_time;

extern "C" {
  #include "wpa2_enterprise.h"
}
#include <ArduinoJson.h>
static const char *ssid     = "";
static const char *username = "";
static const char *password = ""; 
void setup() {
  pinMode(D8, OUTPUT);
  Serial.begin(115200);
  wifi_station_disconnect();
  Wire.begin();
  if(movementSensor.initialize()==false){
    Serial.println("Device not found. Check wiring");
    while(true);
  }
  /* Check for Wi-Fi shield existence. */
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present.");
    while (true);
  }
  last_time = millis();
  /* WPA2 Connection Configuration. */
  Serial.println("Configuring WPA2 Connection...");
  wifi_station_clear_cert_key();
  wifi_station_clear_enterprise_ca_cert();
  wifi_station_clear_enterprise_identity();
  wifi_station_clear_enterprise_username();
  wifi_station_clear_enterprise_password();
  wifi_station_clear_enterprise_new_password();
  wifi_station_set_wpa2_enterprise_auth(1);
  
  wifi_set_opmode(STATION_MODE); 
  struct station_config wifi_config;
  memset(&wifi_config, 0, sizeof(wifi_config));
  strncpy((char *)wifi_config.ssid, ssid, strlen(ssid));
  wifi_station_set_config(&wifi_config);
  wifi_station_set_enterprise_identity((uint8*)username, strlen(username));
  wifi_station_set_enterprise_username((uint8*)username, strlen(username));
  wifi_station_set_enterprise_password((uint8*)password, strlen(password));
 
  delay(500);
  Serial.println("Configuring WPA2 Connection Done.");
  Serial.println("");
  delay(500);
  
  wifi_station_connect();
 
  Serial.println("Waiting for connection and IP Address from DHCP...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("Wi-Fi Status: ");
    Serial.println(WiFi.status());
    if (WiFi.status() == WL_CONNECT_FAILED) {
      Serial.println("Attempting to reconnect...");
      wifi_station_connect();
    }
    delay(2000);
  }
  Serial.println("");
  Serial.println("Wi-Fi Connected.");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  /* End Waiting for Connection. */
  
}
void loop() {
  detector.loop();
  String currstate;
  uint32_t now = millis();
  if (now - last_time > 100) {
#if 0
  
    Serial.print(detector.getDerivativeOfIR1());
    Serial.print(" ");
    Serial.print(detector.getDerivativeOfIR2());
    Serial.print(" ");
    Serial.print(detector.getDerivativeOfIR3());
    Serial.print(" ");
    Serial.println(detector.getDerivativeOfIR4());
#else
    if (detector.presentFullField(false)) {
      currstate="1";
    }else{
      currstate="0";
    }
#endif
    last_time = now;
  }
  
  Serial.print("Wi-Fi Status: ");
  Serial.println(WiFi.status());
  
  if(WiFi.status()==3){//when wifi connected, led light is on

    //admin login
    StaticJsonBuffer<300> JSONbuffer;   
    JsonObject& JSONencoder = JSONbuffer.createObject();
    const char * headerkeys[] = {"Set-Cookie"} ;
    String setheader;
    size_t headerkeyssize = sizeof(headerkeys)/sizeof(char*);
    JSONencoder["password"] = "inhibitor";
    char JSONmessageBuffer[300];
    JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

    
    HTTPClient http;    
  
    http.begin("http://ssal.sparcs.org:32778/api/v1/auth/login");//adminlogin api
    http.addHeader("Content-Type", "application/json"); 
    http.collectHeaders(headerkeys,headerkeyssize);
    int httpCode = http.POST(JSONmessageBuffer);   
    String payload = http.getString();//return message of adminlogin                                       
    Serial.println(httpCode);//print http code of adminlogin
    Serial.println(payload);//print message of adminlogin
    int s=0;
    setheader=http.header(s);//setheader is set to contents of setcookie
    for (int i=0; i < http.headers(); i++) {
      Serial.printf("%s = %s\r\n", http.headerName(i).c_str(), http.header(i).c_str());
    }
    http.end();//end connection

    Serial.println("\n");
    Serial.println("\n");
    Serial.println("\n");
    Serial.println("start");//start of update process
    //updating objects
    StaticJsonBuffer<300> JSONbufferroom;   //Declaring static JSON buffer
    JsonObject& JSONencoderroom = JSONbufferroom.createObject();;
    char JSONmessageBufferroom[300];
    JSONencoderroom.prettyPrintTo(JSONmessageBufferroom, sizeof(JSONmessageBufferroom));
    Serial.println(currstate);//check if the currstate set by sensor is ok
    if(currstate=="0"){//when there is no person
      http.begin("http://konoserver/api/v1/room?room_number=4&state=0");
      http.addHeader("Cookie", setheader);
    }else{//when there is person
      http.begin("http://konoserver/api/v1/room?room_number=4&state=1");
      http.addHeader("Cookie", setheader);
    }
    Serial.println(setheader);//check if cookie is correctly set
    int httpCode2=http.POST(JSONmessageBufferroom);
    String payload2 = http.getString();
    Serial.println(httpCode2);//http code of update room process
    Serial.println(payload2);//ret message of update room process
    http.end();

    Serial.println("end");
    Serial.println("\n");
    Serial.println("\n");
    Serial.println("\n");
    Serial.println("\n");

  
    
  }else{
    digitalWrite(D8,LOW);//when no connection, led light is off
  }
  delay(5000);
  
}
