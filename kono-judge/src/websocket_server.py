import time
import struct
import json
from websockets import serve
from websockets.exceptions import ConnectionClosedError

# Global constants for websocket server
WEIGHT = 0.97               # Weight of moving average algorithm, for calculating connection latency

def millis():
    return int(round(time.time() * 1000))

class WebSocketServer():
    def __init__(self, host, port, datadump, connection):
        self.datadump  = datadump
        self.metadata  = {}     # Storage of arduino websocket metadata 
                                #   device_id -> { 
                                #       offset,         // latency (difference between local time and server time)
                                #       last_packet     // Last received packet timestamp (in local time)
                                #   }
        self.connection = connection
        self.host = host
        self.port = port

    def get_data(self, device_id):
        if device_id in self.datadump:
            return datadump[device_id]
        else:
            return None

    def get_runner(self):
        return serve(self.message_handler, 
            host=self.host, port=self.port,
            max_size=256, max_queue=8, read_limit=1024, write_limit=1024)

    async def close(self):
        await self.connection.close()

    async def message_handler(self, websocket, path):
        await self.connection.connect(websocket)
        
        # Main message handling routine
        try:
            async for message in websocket:
                # Parse received packet
                #   - message[0:3] = timestamp (int,   little endian)
                #   - message[4:7] = device_id (int,   little endian, -1 if kono-judge-status)
                #   - message[8:]  = data[0:5] (float, little endian)
                data_bin  = list(map(lambda i: message[4*i : 4*(i+1)], range(8)))
                timestamp = int.from_bytes(data_bin[0], 'little')
                device_id = int.from_bytes(data_bin[1], 'little')
                data      = list(map(lambda x: round(struct.unpack('<f', x)[0], 2), data_bin[2:]))

                current_time = millis()

                # Register connection to connection manager
                register_result = await self.connection.register(websocket, device_id)
                if not register_result:
                    continue

                # Initialize metadata data structure
                if device_id not in self.metadata:
                    self.metadata[device_id] = {
                        'offset'     : current_time - timestamp,
                        'last_packet': 0
                    }

                # Update metadata
                # Moving average for calculating offset
                self.metadata[device_id]['last_packet'] = timestamp
                self.metadata[device_id]['offset'] = WEIGHT * self.metadata[device_id]['offset'] + (1 - WEIGHT) * (current_time - timestamp)

                # Insert new data from the packet
                new_data = {
                    'timestamp': round(timestamp + self.metadata[device_id]['offset']),
                    'device_id': device_id,
                    'data': data
                }
                self.datadump.insert(device_id, new_data, current_time)

                # Forward new data to kono-judge-status clients
                await self.connection.forward_data(json.dumps(new_data))

                # Acknowledge received packet back to kono-arduino
                await websocket.send(data_bin[0])

        # Error handling routine
        except ConnectionClosedError:
            self.connection.error(websocket)

        # Cleanup
        finally:
            self.connection.unregister(websocket)
