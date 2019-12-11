/* StreamingQueue.h */

#ifndef __STREAMING_QUEUE_H__
#define __STREAMING_QUEUE_H__

#include <stdint.h>

struct Packet
{
    uint32_t timestamp;
    float    value[7];
    Packet(uint32_t _timestamp, float _value[]): timestamp(_timestamp)
    {
        for (int i = 0; i < 7; i++)
          value[i] = _value[i];
    }
}; // sizeof(Packet) = 32

class StreamingQueue
{

public:
    StreamingQueue();
    void push(Packet packet);
    void loop();
    bool pop(uint32_t timestamp);
    bool empty();
    bool full();

private:
    uint8_t *_mem;                  // memory allocated to queue
    uint8_t *_head, *_tail, *_wait; // window end pointers
    bool    _empty, _full;          // state flags

    void    _send_packet();         // sends packet and shifts waiting window
};

#endif /* __STREAMING_QUEUE_H__ */
