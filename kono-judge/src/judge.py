import os, websockets, asyncio, struct, collections, time, json
from websockets.exceptions import ConnectionClosedError
from dotenv import load_dotenv
from aiohttp.web import Application, run_app
from router import Router
from data   import Datadump

load_dotenv()
WEBSOCKET_PORT = os.getenv('WEBSOCKET_PORT')
HTTP_PORT      = os.getenv('HTTP_PORT')

datadump = Datadump()

def run_http_server():
    app = Application()
    router = Router(datadump)
    router.register(app.router)
    run_app(app, port=HTTP_PORT)

WEIGHT = 0.97
MAX_STATUS_CLIENTS = 2

confidentials = json.loads(open('confidentials.json').read())

metadata = { }
arduino_clients = { }
status_clients  = []

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
            data      = list(map(lambda x: round(struct.unpack('<f', x)[0], 2), data_bin[2:]))

            current_time = millis()

            if device_id == 0xFFFFFFFF:
                if len(status_clients) >= MAX_STATUS_CLIENTS:
                    await websocket.send('[kono-judge] Connection refused')
                else:
                    status_clients.append(websocket)
                    await websocket.send('[kono-judge] Connected')
                continue
            else:
                if device_id in confidentials['allowed_device_ids']:
                    if device_id in arduino_clients.values():
                        await websocket.send(f'[kono-judge] The device {device_id} is already connected. Are you sure you are the right device?')
                        print(f'[kono-judge] Dupulicate connection attempt from device {device_id}')
                        await websocket.close()
                        continue
                    else:
                        arduino_clients[websocket] = device_id
                else:
                    await websocket.send('[kono-judge] Invalid device id')
                    await websocket.close()
                    continue

            if device_id not in metadata:
                metadata[device_id] = {
                    'offset'     : current_time - timestamp,
                    'last_packet': 0
                }

            metadata[device_id]['last_packet'] = timestamp
            metadata[device_id]['offset'] = WEIGHT * metadata[device_id]['offset'] + (1 - WEIGHT) * (current_time - timestamp)

            new_data = {
                'timestamp': round(timestamp + metadata[device_id]['offset']),
                'device_id': device_id,
                'data': data
            }

            datadump.insert(device_id, new_data, current_time)

            if len(status_clients) > 0:
                await asyncio.wait([client.send(json.dumps(new_data)) for client in status_clients])
            await websocket.send(data_bin[0])

    except ConnectionClosedError:
        print('[kono-judge] Connection closed without close frame')

    finally:
        print('[kono-judge] Device Disconnected')
        if websocket in arduino_clients:
            del arduino_clients[websocket]
        if websocket in status_clients:
            status_clients.remove(websocket)

def run_websocket_server():
    start_server = websockets.serve(
        collector_handler, 
        host='0.0.0.0', port=WEBSOCKET_PORT,
        max_size=256, max_queue=8, read_limit=1024, write_limit=1024
    )
    asyncio.get_event_loop().run_until_complete(start_server)

def main():
    run_websocket_server()
    run_http_server()
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()