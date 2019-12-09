import websockets
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv('PORT')

COLLECTORS = set()
QUEUE = []

async def register(websocket):
    COLLECTORS.add(websocket)
    print(COLLECTORS)

async def unregister(websocket):
    COLLECTORS.remove(websocket)
    print(COLLECTORS)

async def notify_collector(websocket):
    await websocket.send('tt')

async def routine(websocket, path):
    await register(websocket)
    try:
        async for message in websocket:
            print(f"message: {message}")
            await notify_collector(websocket)
    finally:
        await unregister(websocket)

def main():
    start_server = websockets.serve(routine, '0.0.0.0', PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()