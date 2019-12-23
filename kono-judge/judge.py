import websockets, asyncio, os, struct, json, collections, time, sys, pprint
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

metadata = { }
datadump = { }

def millis():
    return int(round(time.time() * 1000))

async def collector_handler(websocket, path):
    print('[kono-judge] Device Connected')
    metadata[websocket] = {
        'initialized': False,
        'device_id'  : 0,
        'offset'     : 0,
        'latency'    : 0,
        'buffer_size': {
            '10sec': 0,
            '1min' : 0,
            '10min': 0,
            '1h'   : 0,
            '6h'   : 0,
            '24h'  : 0
        }
    }
    try:
        async for message in websocket:

            data_bin  = list(map(lambda i: message[4*i : 4*(i+1)], range(8)))
            timestamp = int.from_bytes(data_bin[0], 'little')
            device_id = int.from_bytes(data_bin[1], 'little')
            data      = list(map(lambda x: struct.unpack('<f', x)[0], data_bin[2:]))

            if not metadata[websocket]['initialized']:
                metadata[websocket]['initialized'] = True
                metadata[websocket]['device_id'] = device_id
                metadata[websocket]['offset'] = millis() - timestamp
            
            timestamp += metadata[websocket]['offset']

            if device_id not in datadump:
                datadump[device_id] = { }
                for key in INTERVAL_KEYS:
                    datadump[device_id][key] = collections.deque()

            for key in INTERVAL_KEYS:
                datadump[device_id][key].append((timestamp, data))

            t = millis()

            metadata[websocket]['latency'] = t - timestamp

            for key in INTERVAL_KEYS:
                while datadump[device_id][key][0][0] + INTERVALS[key] < t:
                    datadump[device_id][key].popleft()

            for key in INTERVAL_KEYS:
                metadata[websocket]['buffer_size'][key] = len(datadump[device_id][key])

            os.system('clear')
            sys.stdout.write('server time: %d\n' % t)
            sys.stdout.write('packet time: %d\n' % timestamp)
            sys.stdout.write('%s'   % str(pprint.pformat(metadata)))
            sys.stdout.flush()
            
            # reply
            await websocket.send(data_bin[0])

    finally:
        print('[kono-judge] Device Disconnected')
        del metadata[websocket]

def main():
    start_server = websockets.serve(collector_handler, host='0.0.0.0', port=PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()