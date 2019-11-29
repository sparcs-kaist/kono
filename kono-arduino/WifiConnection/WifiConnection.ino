#include <ESP8266WiFi.h>
#include <Wire.h>
#include <ESP8266HTTPClient.h>
#include "Grove_Human_Presence_Sensor.h"

AK9753 movementSensor;

// need to adjust these sensitivities lower if you want to detect more far
// but will introduce error detection
float sensitivity_presence = 6.0;
float sensitivity_movement = 10.0;
int detect_interval = 30; //milliseconds
PresenceDetector detector(movementSensor, sensitivity_presence, sensitivity_movement, detect_interval);
uint32_t last_time;

//Global variables
String setheader="";
String tempheader="";
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
  
  wifi_set_opmode(STATION_MODE); // Set ESP to STATION mode only, not SOFTAP mode
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
  /* End WPA2 Connection Configuration. */
  wifi_station_connect();
  /* Wait for Connection and IP Address from DHCP. */
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
  
  //Checking wifi status with serial.print
  Serial.print("Wi-Fi Status: ");
  Serial.println(WiFi.status());

  
  //Presence sensor setting currstate
  detector.loop();
  uint32_t now = millis();
  String currstate;
  String roomnumber="4";
  if (now - last_time > 100) {
#if 0
    //see the derivative of a specific channel when you're adjusting the threshold
    //open the Serial Plotter
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

  HTTPClient http;
  const int FIRST_ELEM=0;
  int httpCode;
  String payload;
  const char * headerkeys[] = {"Set-Cookie"} ;
  if(WiFi.status()==3){//if connected
    
    if ( setheader!="" ) {//If setheader(cookie) is defined
      
      //setup
      StaticJsonBuffer<300> JSONbufferroom;   //Declaring static JSON buffer
      JsonObject& JSONencoderroom = JSONbufferroom.createObject();
      size_t headerkeyssize = sizeof(headerkeys)/sizeof(char*);
      char JSONmessageBufferroom[300];
      JSONencoderroom.prettyPrintTo(JSONmessageBufferroom, sizeof(JSONmessageBufferroom));
      Serial.println(currstate);

      //making connections
      http.begin("http://ssal.sparcs.org:32778/api/v1/room?room_number="+roomnumber+"&state="+currstate);
      http.addHeader("Cookie", setheader);
      http.collectHeaders(headerkeys,headerkeyssize);
      httpCode=http.POST(JSONmessageBufferroom);

      //updating cookie if header exists
      tempheader=http.header(FIRST_ELEM);
      if(tempheader!=""){//update setheader containing setcookie
        setheader=tempheader;
        tempheader="";
      }

      //result of connections and end of connection
      payload = http.getString();
      Serial.println(httpCode);
      Serial.println(payload);
      http.end();
      JSONbufferroom.clear();
      
    } else {
      
      //setup
      StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
      JsonObject& JSONencoder = JSONbuffer.createObject();
      size_t headerkeyssize = sizeof(headerkeys)/sizeof(char*);
      JSONencoder["password"] = "";
      char JSONmessageBuffer[300];
      JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

      //making connections
      http.begin("http://ssal.sparcs.org:32778/api/v1/auth/login");      //Specify request destination
      http.addHeader("Content-Type", "application/json");  //Specify content-type header
      http.collectHeaders(headerkeys,headerkeyssize); //Get headers
      httpCode = http.POST(JSONmessageBuffer);   //Send the request 
      
      //updating cookie
      setheader=http.header(FIRST_ELEM);
      
      //print result and set *setheader with the login result
      payload = http.getString();         //Get the response payload
      Serial.println(httpCode);   //Print HTTP return code
      Serial.println(payload);
      http.end();  //Close connection
      JSONbuffer.clear();
    }
    
  }else{//if not connected
    digitalWrite(D8,LOW);
  }
  delay(5000);
  
}
