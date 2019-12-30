import os, websockets, asyncio, struct, collections, time, json
from dotenv import load_dotenv
from aiohttp.web import Application, run_app
from router import Router

load_dotenv()
WEBSOCKET_PORT = os.getenv('WEBSOCKET_PORT')
HTTP_PORT      = os.getenv('HTTP_PORT')

def run_http_server():
    app = Application()
    router = Router()
    router.register(app.router)
    run_app(app, port=HTTP_PORT)

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
MAX_STATUS_CLIENTS = 2

metadata = { }
datadump = { }
status_clients = []

def get_data(device_id):
    if device_id in datadump:
        return datadump[device_id]
    else:
        return None

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

            if device_id == 0xFFFFFFFF:
                if len(status_clients) >= MAX_STATUS_CLIENTS:
                    await websocket.send('[kono-judge] Connection refused')
                else:
                    status_clients.append(websocket)
                    await websocket.send('[kono-judge] Connected')
                continue

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

            new_data = {
                'timestamp': round(timestamp + metadata[device_id]['offset']),
                'device_id': device_id,
                'data': data
            }

            for key in INTERVAL_KEYS:
                datadump[device_id][key].append(new_data)

            for key in INTERVAL_KEYS:
                while datadump[device_id][key][0]['timestamp'] + INTERVALS[key] < current_time:
                    datadump[device_id][key].popleft()

            for key in INTERVAL_KEYS:
                metadata[device_id]['buffer_size'][key] = len(datadump[device_id][key])
            
            if len(status_clients) > 0:
                await asyncio.wait([client.send(json.dumps(new_data)) for client in status_clients])
            await websocket.send(data_bin[0])

    finally:
        print('[kono-judge] Device Disconnected')
        if websocket in status_clients:
            status_clients.remove(websocket)

def run_websocket_server():
    start_server = websockets.serve(collector_handler, host='0.0.0.0', port=WEBSOCKET_PORT)
    asyncio.get_event_loop().run_until_complete(start_server)

def main():
    run_websocket_server()
    run_http_server()
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()