import websockets
import asyncio
import os
import struct
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv('PORT')

async def collector_handler(websocket, path):
    print('Connected')
    try:
        async for message in websocket:
            # process received data
            data_bin  = list(map(lambda i: message[4*i : 4*(i+1)], range(8)))
            timestamp = int.from_bytes(data_bin[0], 'little')
            data      = list(map(lambda x: struct.unpack('<f', x)[0], data_bin[1:]))

            # TODO: update data structure

            print((timestamp, data))
            
            # reply
            await websocket.send(data_bin[0])

    finally:
        print('Disconnected')

def main():
    start_server = websockets.serve(collector_handler, host='0.0.0.0', port=PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()