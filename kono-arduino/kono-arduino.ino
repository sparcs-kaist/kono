#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include "confidentials.h"
#include "StreamingQueue.h"

extern "C"
{
  #include "wpa2_enterprise.h"
}

/* Comment the following line on release. */
// #define __DEBUG__

/* Configurations for network connection. */
extern const char    *SSID;
extern const char    *USERNAME;
extern const char    *PASSWORD;
extern const String   WEBSOCKET_HOST;
extern const uint16_t WEBSOCKET_PORT;

/* Global variables. */
static bool             g_error = false;
static StreamingQueue  *g_queue;

WebSocketsClient g_websocket_client;

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
            hexdump(payload, len);
#endif
            break;
    }
    
}

void setup()
{

    struct station_config wifi_config;

#ifdef __DEBUG__
    /* Initialize serial connection. */
    Serial.begin(115200);
#endif

    /* Initialize Wi-Fi connection. */
    wifi_station_disconnect();
    if (WiFi.status() == WL_NO_SHIELD)
    {
#ifdef __DEBUG__
        Serial.println("Wi-Fi shield not present.");
#endif
        g_error = true;
        return;
    }
#ifdef __DEBUG__
    Serial.println("Configuring WPA2 Connection...");
#endif
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
#endif

    wifi_station_connect();
#ifdef __DEBUG__
    Serial.println("Waiting for connection and IP address from router...");
#endif
    while (WiFi.status() != WL_CONNECTED)
    {
        if (WiFi.status() == WL_CONNECT_FAILED)
        {
#ifdef __DEBUG__
            Serial.println("Attempting to reconnect...");
#endif
            wifi_station_connect();
        }
        delay(1000);
    }

#ifdef __DEBUG__
    Serial.println("Wi-Fi connected.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
#endif

    g_websocket_client.begin(WEBSOCKET_HOST, WEBSOCKET_PORT);
    g_websocket_client.onEvent(websocket_event);

    g_queue = new StreamingQueue();

}

void loop()
{

    String  ws_data;
    uint8_t ws_opcode;
    
    if (g_error)
    {
        return;
    }

    /* Check for Wi-Fi connection status. */
    if (WiFi.status() == WL_CONNECTED)
    {
        g_websocket_client.loop();
        g_queue->loop();
    }
    else
    {
#ifdef __DEBUG__
        Serial.println("Disconnected from Wi-Fi. Attempting to reconnect...");
#endif
        wifi_station_connect();
        delay(5000);
    }
    
}
