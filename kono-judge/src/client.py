# client.py
#   Sample client to test kono-judge
# 
# bash> python3 client.py

import asyncio
import websockets
import time
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
import os
from dotenv import load_dotenv

load_dotenv()
WEBSOCKET_PORT = os.getenv('WEBSOCKET_PORT')

def millis():
    return int(round(time.time() * 1000)) % 1048576

async def connect():
    # Connection coroutine
    uri = f"ws://localhost:7077"
    return await websockets.connect(uri)

async def client(websocket):
    # Message handling coroutine
    try:
        # Send sampled data
        # - bits[0:3] are timestamp
        # - bits[4:7] are device id
        # - Little endian representation
        await websocket.send(millis().to_bytes(4, byteorder='little') + b'\xFF\xFF\xFF\xFF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
        # await websocket.send(millis().to_bytes(4, byteorder='little') + b'\xFD\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
        # Print received messages from now on
        async for message in websocket:
            print(f'[Client] Received: {message}')
            # await asyncio.sleep(1)
            # await websocket.send(millis().to_bytes(4, byteorder='little') + b'\xFD\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
    except ConnectionClosedOK:
        # Received closing frame from the server
        print('[Client] Connection refused from server')
    except ConnectionClosedError:
        # Did not receive closing frame from the server
        print('[Client] Connection closed without close frame') 
    finally:
        print('[Client] Server closed connection')

async def close(websocket):
    # Cleanup
    await websocket.close()

def main():
    loop = asyncio.get_event_loop()
    # Retrieve connection context and connect to server
    websocket = loop.run_until_complete(connect())
    try:
        loop.run_until_complete(client(websocket))
    except KeyboardInterrupt:
        # Cleanup
        loop.run_until_complete(close(websocket))
        print('[Client] Closed connection')

if __name__ == '__main__':
    main()