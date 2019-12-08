import websockets
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv('PORT')

async def hello(websocket, path):
    name = await websocket.recv()
    print(f"< {name}")

    greeting = f"Hello {name}!"

    await websocket.send(greeting)
    print(f"> {greeting}")

def main():
    start_server = websockets.serve(hello, 'localhost', PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()