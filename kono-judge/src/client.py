import asyncio
import websockets
from websockets.exceptions import ConnectionClosedError
import os
from dotenv import load_dotenv

load_dotenv()
WEBSOCKET_PORT = os.getenv('WEBSOCKET_PORT')

async def connect():
    uri = f"ws://localhost:{WEBSOCKET_PORT}"
    return await websockets.connect(uri)

async def client(websocket):
    await websocket.send(b'\x00\x00\x00\x00\x4C\x08\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
    try:
        async for message in websocket:
            print(f'[Client] Received: {message}')
    except ConnectionClosedError:
        print('[Client] Connection closed without close frame') 
    finally:
        print('[Client] Server closed connection')

async def close(websocket):
    await websocket.close()

def main():
    loop = asyncio.get_event_loop()
    websocket = loop.run_until_complete(connect())
    try:
        loop.run_until_complete(client(websocket))
    except KeyboardInterrupt:
        loop.run_until_complete(close(websocket))
        print('[Client] Closed connection')

if __name__ == '__main__':
    main()