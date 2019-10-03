#include <ESP8266WiFi.h>
extern "C" {
  #include "wpa2_enterprise.h"
}
static const char *ssid     = "Welcome_KAIST";
static const char *username = "maxkim139";
static const char *password = "Rlaxodnjs1013!";
void setup() {
  pinMode(D8, OUTPUT);
  Serial.begin(115200);
  wifi_station_disconnect();
  /* Check for Wi-Fi shield existence. */
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present.");
    while (true);
  }
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
  
  Serial.print("Wi-Fi Status: ");
  Serial.println(WiFi.status());
  if(WiFi.status()==3){
    digitalWrite(D8, HIGH);//Increase brightness when connected
  }else{
    digitalWrite(D8,LOW);//Decrease brightness when not connected
  }
  delay(5000);
  
}
