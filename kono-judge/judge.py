import os, websockets, asyncio, struct, json, collections, time
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv('PORT')
INTERVALS = {
    '10sec':           10 * 1000,
    '1min' :       1 * 60 * 1000,
    '10min':      10 * 60 * 1000,
    '1h'   :  1 * 60 * 60 * 1000,
    '6h'   :  6 * 60 * 60 * 1000,
    '24h'  : 24 * 60 * 60 * 1000
}
INTERVAL_KEYS = INTERVALS.keys()
WEIGHT = 0.97

metadata = { }
datadump = { }

def millis():
    return int(round(time.time() * 1000))

async def collector_handler(websocket, path):
    print('[kono-judge] Device Connected')
    try:
        async for message in websocket:

            data_bin  = list(map(lambda i: message[4*i : 4*(i+1)], range(8)))
            timestamp = int.from_bytes(data_bin[0], 'little')
            device_id = int.from_bytes(data_bin[1], 'little')
            data      = list(map(lambda x: struct.unpack('<f', x)[0], data_bin[2:]))

            current_time = millis()

            if device_id not in metadata:
                metadata[device_id] = {
                    'offset'     : current_time - timestamp,
                    'last_packet': 0,
                    'buffer_size': {
                        '10sec': 0,
                        '1min' : 0,
                        '10min': 0,
                        '1h'   : 0,
                        '6h'   : 0,
                        '24h'  : 0
                    }
                }
            
            metadata[device_id]['last_packet'] = timestamp
            metadata[device_id]['offset'] = WEIGHT * metadata[device_id]['offset'] + (1 - WEIGHT) * (current_time - timestamp)

            if device_id not in datadump:
                datadump[device_id] = { }
                for key in INTERVAL_KEYS:
                    datadump[device_id][key] = collections.deque()

            for key in INTERVAL_KEYS:
                datadump[device_id][key].append((timestamp + metadata[device_id]['offset'], data))

            for key in INTERVAL_KEYS:
                while datadump[device_id][key][0][0] + INTERVALS[key] < current_time:
                    datadump[device_id][key].popleft()

            for key in INTERVAL_KEYS:
                metadata[device_id]['buffer_size'][key] = len(datadump[device_id][key])
            
            # reply
            await websocket.send(data_bin[0])

    finally:
        print('[kono-judge] Device Disconnected')

def main():
    start_server = websockets.serve(collector_handler, host='0.0.0.0', port=PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()