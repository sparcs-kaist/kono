import websockets
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv('PORT')

async def collector_handler(websocket, path):
    print('Connected')
    try:
        async for message in websocket:
            print(message.hex())
    finally:
        print('Disconnected')

def main():
    start_server = websockets.serve(collector_handler, host='0.0.0.0', port=PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()