#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include <Grove_Human_Presence_Sensor.h>
#include "confidentials.h"
#include "StreamingQueue.h"

extern "C"
{
  #include "wpa2_enterprise.h"
}

/* Comment the following line on release. */
// #define __DEBUG__
#define __CUSTOM_NETWORK__

/* Configurations for network connection. */
extern const char    *SSID;
extern const char    *USERNAME;
extern const char    *PASSWORD;
extern const String   WEBSOCKET_HOST;
extern const uint16_t WEBSOCKET_PORT;
extern const String   WEBSOCKET_PATH;
extern const uint32_t DEVICE_ID;

static const uint32_t   FETCH_INTERVAL       = 1000; // 1000 ms
static const float      SENSITIVITY_PRESENCE = 6.0;
static const float      SENSITIVITY_MOVEMENT = 10.0;
static const int        DETECT_INTERVAL      = 30;

/* Global variables. */
static bool             g_error = false;
static StreamingQueue  *g_queue = NULL;
static uint32_t         g_fetch_timer;
static float            g_data[6] = { };

WebSocketsClient        g_websocket_client;
AK9753                  g_movement_sensor;
PresenceDetector        g_detector(g_movement_sensor, SENSITIVITY_PRESENCE, SENSITIVITY_MOVEMENT, DETECT_INTERVAL);

void websocket_event(WStype_t type, uint8_t *payload, size_t len)
{
    switch(type) {
        case WStype_DISCONNECTED:
#ifdef __DEBUG__
            Serial.println("[WSc] Disconnected!");
#endif
            break;
        case WStype_CONNECTED:
#ifdef __DEBUG__
            Serial.print("[WSc] Connected to host: ");
            Serial.println((char *) payload);
#endif
            break;
        case WStype_TEXT:
#ifdef __DEBUG__
            Serial.print("[WSc] Received text: ");
            Serial.println((char *)payload);
#endif
            break;
        case WStype_BIN:
#ifdef __DEBUG__
            Serial.print("[WSc] Received binary length: ");
            Serial.println(len);
#endif
            g_queue->pop(*((uint32_t *) payload));
            break;
    }
    
}

void setup()
{

    struct station_config wifi_config;

    /* Initialize serial connection. */
    Serial.begin(115200);
  
    /* Initialize detector. */
    Wire.begin();
    if (!g_movement_sensor.initialize())
    {
#ifdef __DEBUG__
        Serial.println("Device not found. Check wiring");
#endif // __DEBUG__
        g_error = true;
        return;
    }

    yield();

#ifndef __CUSTOM_NETWORK__
    /* Initialize Wi-Fi connection. */
    wifi_station_disconnect();
    if (WiFi.status() == WL_NO_SHIELD)
    {
#ifdef __DEBUG__
        Serial.println("Wi-Fi shield not present.");
#endif // __DEBUG__
        g_error = true;
        return;
    }
#ifdef __DEBUG__
    Serial.println("Configuring WPA2 Connection...");
#endif // __DEBUG__
    wifi_station_clear_cert_key();
    wifi_station_clear_enterprise_ca_cert();
    wifi_station_clear_enterprise_identity();
    wifi_station_clear_enterprise_username();
    wifi_station_clear_enterprise_password();
    wifi_station_clear_enterprise_new_password();
    wifi_station_set_wpa2_enterprise_auth(1);
    wifi_set_opmode(STATION_MODE);

    /* Setup connection settings. */
    memset(&wifi_config, 0, sizeof(wifi_config));
    strncpy((char *) wifi_config.ssid, SSID, strlen(SSID));
    wifi_station_set_config(&wifi_config);
    wifi_station_set_enterprise_identity((uint8 *)USERNAME, strlen(USERNAME));
    wifi_station_set_enterprise_username((uint8 *)USERNAME, strlen(USERNAME));
    wifi_station_set_enterprise_password((uint8 *)PASSWORD, strlen(PASSWORD));
#ifdef __DEBUG__
    Serial.println("Configuring WPA2 Connection Done.");
#endif // __DEBUG__

    wifi_station_connect();
    yield();
#ifdef __DEBUG__
    Serial.println("Waiting for connection and IP address from router...");
#endif // __DEBUG__
    while (WiFi.status() != WL_CONNECTED)
    {
        if (WiFi.status() == WL_CONNECT_FAILED)
        {
#ifdef __DEBUG__
            Serial.println("Attempting to reconnect...");
#endif // __DEBUG__
            wifi_station_connect();
        }
        delay(1000);
    }
#else // __CUSTOM_NETWORK__
    WiFi.begin(SSID, PASSWORD);
#endif // __CUSTOM_NETWORK

#ifdef __DEBUG__
    Serial.println("Wi-Fi connected.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
#endif

    g_websocket_client.begin(WEBSOCKET_HOST, WEBSOCKET_PORT, WEBSOCKET_PATH);
    g_websocket_client.onEvent(websocket_event);

    g_queue = new StreamingQueue();

    g_fetch_timer = millis();

}

void loop()
{

    String  ws_data;
    uint8_t ws_opcode;
    uint32_t current_time;
    
    if (g_error)
    {
        return;
    }

    /* Add data packet every FETCH_INTERVAL to the queue. */
    current_time = millis();
    if (g_fetch_timer + FETCH_INTERVAL < current_time)
    {
        g_data[0] = g_detector.getIR1();
        g_data[1] = g_detector.getIR2();
        g_data[2] = g_detector.getIR3();
        g_data[3] = g_detector.getIR4();
        g_queue->push(Packet(current_time, DEVICE_ID, g_data));
        g_fetch_timer = current_time;
    }

    g_detector.loop();
    yield();

    /* Check for Wi-Fi connection status. */
    if (WiFi.status() == WL_CONNECTED)
    {
        g_websocket_client.loop();
        yield();
        g_queue->loop();
    }
    else
    {
#ifdef __DEBUG__
        Serial.println("Disconnected from Wi-Fi. Attempting to reconnect...");
#endif // __DEBUG__
        wifi_station_connect();
        delay(5000);
    }

    delay(1);
    
}
