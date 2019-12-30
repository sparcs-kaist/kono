import asyncio
import websockets

async def client():
    uri = "ws://localhost:7077"
    async with websockets.connect(uri) as websocket:
        await websocket.send(b'\x00\x00\x00\x00\xFF\xFF\xFF\xFF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
        try:
            async for message in websocket:
                print(f'Received: {message}')
        finally:
            pass

def main():
    asyncio.get_event_loop().run_until_complete(client())
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    main()