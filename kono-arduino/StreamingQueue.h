/* StreamingQueue.h */

#ifndef __STREAMING_QUEUE_H__
#define __STREAMING_QUEUE_H__

#include <stdint.h>
#include <WebSocketsClient.h>

typedef struct Packet
{
    uint32_t timestamp;
    float    value[7];
    Packet(uint32_t _timestamp, float _value[]): timestamp(_timestamp)
    {
        for (int i = 0; i < 7; i++)
          value[i] = _value[i];
    }
} *PACKET_T; // sizeof(Packet) = 32

class StreamingQueue
{

public:
    StreamingQueue();
    ~StreamingQueue();
    void   push(Packet packet);
    void     loop();
    bool     pop(uint32_t timestamp);
    bool     empty();
    bool     full();
    uint16_t size();

private:
    PACKET_T _mem;                       // memory allocated to queue
    PACKET_T _head, _tail, _wait;        // window end pointers
    bool     _empty, _full, _wait_empty; // state flags

    PACKET_T _incr(PACKET_T ptr);        // incrementer in circular queue
};

#endif /* __STREAMING_QUEUE_H__ */
