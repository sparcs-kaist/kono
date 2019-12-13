/* StreamingQueue.cpp */

#include "StreamingQueue.h"
#include <stdlib.h>
#include <Arduino.h>

#define QUEUE_SIZE 8192 // 8KB Queue
#define QUEUE_CAP  (QUEUE_SIZE / sizeof(Packet))

/* Comment the following line on operating code. */
#define __DEBUG__

extern WebSocketsClient g_websocket_client;

StreamingQueue::StreamingQueue()
{
    _mem  = reinterpret_cast<PACKET_T>( calloc(1, QUEUE_SIZE) );
    _head = _tail = _wait = _mem;
    
    _empty      = true;
    _full       = false;
    _wait_empty = true;
}

StreamingQueue::~StreamingQueue()
{
    free(_mem);
}

void StreamingQueue::push(Packet packet)
{
    if (_empty)
        _empty = false;

    if (_full)
    {
        /* If queue is already full, discard the oldest packet in the waiting list. */
        if (_wait_empty)
            _wait = _incr(_wait);
        _tail = _incr(_tail);
    }

    /* Fill data at the space next to _head and proceed _head */
    memcpy(_head, &packet, sizeof(packet));
    _head = _incr(_head);

    if (_head == _tail)
        _full = true;
}

void StreamingQueue::loop()
{
    for ( ; _wait != _head; _wait = _incr(_wait))
    {
      
        /* Send packet at _wait through WebSocket. */
        if (g_websocket_client.sendBIN(reinterpret_cast<uint8_t *>(_wait), sizeof(Packet)))
        {
#ifdef __DEBUG__
            Serial.print("[StQ] data sent: ");
            Serial.println(_wait->timestamp);
#endif
            _wait_empty = false;
        }
        else
        {
            break;
        }
        yield();
    }
}

bool StreamingQueue::pop(uint32_t timestamp)
{
    bool success;
    
    if (_empty)
        success = false;
    else
    {
        success = (_tail->timestamp == timestamp);
        if (success)
        {
            _tail = _incr(_tail);
            if (_tail == _wait)
                _wait_empty = true;
        }
    }

    return success;   
}

bool StreamingQueue::empty()
{
    return _empty;
}

bool StreamingQueue::full()
{
    return _full;
}

uint16_t StreamingQueue::size()
{
    if (_empty)
        return 0;

    if (_full)
        return QUEUE_CAP;

    return (_head > _tail) ? (_head - _tail) : (QUEUE_CAP + _head - _tail);
}

PACKET_T StreamingQueue::_incr(PACKET_T ptr)
{
    return (ptr - _mem) < QUEUE_CAP ? (ptr + 1) : _mem;
}
