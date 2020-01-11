# judge.py
#   Main file for kono-judge
#   Depends on:
#       - data.py   (data structure for storing arduino data packets)
#       - router.py (router of the HTTP server)
# 
# bash> python3 judge.py

import os
import asyncio
import struct
import collections
import time
import json

import websockets
from websockets.exceptions import ConnectionClosedError

from dotenv import load_dotenv

from aiohttp.web import Application, AppRunner, TCPSite
import aiohttp_cors

from router import Router
from data   import Datadump

# Load environment variables (.env on local development, or set by docker-compose)
load_dotenv()
WEBSOCKET_PORT = os.getenv('WEBSOCKET_PORT')    # Port used for websocket server
HTTP_PORT      = os.getenv('HTTP_PORT')         # Port used for RESTful HTTP server

# Whitelist for API requests (CORS issue)
WHITELIST = ['http://judge.kono.sparcs.org', 'http://localhost:3000']

# Create data structure (data.py)
datadump = Datadump()

async def http_server():
    # Create context for HTTP server
    app = Application()

    # Configure CORS options
    # Check https://github.com/aio-libs/aiohttp-cors for details
    cors_default_options = {}
    for host in WHITELIST:
        cors_default_options[host] = aiohttp_cors.ResourceOptions(
            allow_methods=['GET'], 
            allow_headers=('Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-timebase', 'Link')
        )
    cors = aiohttp_cors.setup(app, defaults=cors_default_options)

    # Configure routes
    router = Router(datadump)
    router.register(app.router)

    # Configure CORS on all routes
    for route in list(app.router.routes()):
        cors.add(route)

    runner = AppRunner(app)
    await runner.setup()
    site = TCPSite(runner, '0.0.0.0', HTTP_PORT)
    return runner, site

async def close_http_server(runner):
    # Cleanup routine for HTTP server
    print('[kono-judge] Closing HTTP server...')
    await runner.cleanup()

# Global constants for websocket server
WEIGHT = 0.97               # Weight of moving average algorithm, for calculating connection latency
MAX_CONNECTIONS     = 9     # Max number of total websocket connections available
MAX_STATUS_CLIENTS  = 2     # Max number of kono-judge-status clients available

# Confidentials (refer to docs.kono.sparcs.org)
try:
    confidentials = json.loads(open('confidentials.json').read())
except FileNotFoundError:
    print('confidentials.json does not exist')
    exit()

# Global data structure
metadata        = {}    # Storage of arduino websocket metadata 
                        #   device_id -> { 
                        #       offset,         // latency (difference between local time and server time)
                        #       last_packet     // Last received packet timestamp (in local time)
                        #   }
connections     = []    # Storage of all websocket context
arduino_clients = {}    # Storage of arduino websocket context (websocket -> device_id)
status_clients  = []    # Storage of kono-judge-status clients

def get_data(device_id):
    if device_id in datadump:
        return datadump[device_id]
    else:
        return None

def millis():
    return int(round(time.time() * 1000))

async def collector_handler(websocket, path):
    # MAX_CONNECTION check
    if len(connections) >= MAX_CONNECTIONS:
        print('[kono-judge] Connection refused by max connection limit')
        await websocket.send('[kono-judge] Max connection limit exceeded')
        await websocket.close()
        return
    else:
        print('[kono-judge] Device Connected')
        connections.append(websocket)
    
    # Main message handling routine
    try:
        async for message in websocket:

            # Parse received packet
            #   - message[0:3] = timestamp (int,   little endian)
            #   - message[4:7] = device_id (int,   little endian, -1 if kono-judge-status)
            #   - message[8:]  = data[0:5] (float, little endian)
            data_bin  = list(map(lambda i: message[4*i : 4*(i+1)], range(8)))
            timestamp = int.from_bytes(data_bin[0], 'little')
            device_id = int.from_bytes(data_bin[1], 'little')
            data      = list(map(lambda x: round(struct.unpack('<f', x)[0], 2), data_bin[2:]))

            current_time = millis()

            if device_id == 0xFFFFFFFF:
                # Client is kono-judge-status
                # MAX_STATUS_CLIENTS check
                if len(status_clients) >= MAX_STATUS_CLIENTS:
                    await websocket.send('[kono-judge] Connection refused by max status client limit')
                    await websocket.close()
                else:
                    status_clients.append(websocket)
                    await websocket.send('[kono-judge] Connected')
                continue
            else:
                # Client is kono-arduino
                if websocket not in arduino_clients:
                    # device_id check
                    if device_id in confidentials['allowed_device_ids']:
                        # duplicate connection check
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

            # Initialize metadata data structure
            if device_id not in metadata:
                metadata[device_id] = {
                    'offset'     : current_time - timestamp,
                    'last_packet': 0
                }

            # Update metadata
            # Moving average for calculating offset
            metadata[device_id]['last_packet'] = timestamp
            metadata[device_id]['offset'] = WEIGHT * metadata[device_id]['offset'] + (1 - WEIGHT) * (current_time - timestamp)

            # Insert new data from the packet
            new_data = {
                'timestamp': round(timestamp + metadata[device_id]['offset']),
                'device_id': device_id,
                'data': data
            }
            datadump.insert(device_id, new_data, current_time)

            # Forward new data to kono-judge-status clients
            if len(status_clients) > 0:
                await asyncio.wait([client.send(json.dumps(new_data)) for client in status_clients])
            # Acknowledge received packet back to kono-arduino
            await websocket.send(data_bin[0])

    # Error handling routine
    except ConnectionClosedError:
        print('[kono-judge] Connection closed without close frame')

    # Cleanup
    finally:
        indicator = f'device {arduino_clients[websocket]}' if websocket in arduino_clients else 'kono-status'
        print(f'[kono-judge] Disconnected: {indicator}')
        if websocket in connections:
            connections.remove(websocket)
        if websocket in arduino_clients:
            del arduino_clients[websocket]
        if websocket in status_clients:
            status_clients.remove(websocket)

def websocket_server():
    # Returns websocket server context
    return websockets.serve(
        collector_handler, 
        host='0.0.0.0', port=WEBSOCKET_PORT,
        max_size=256, max_queue=8, read_limit=1024, write_limit=1024
    )

async def close_websocket_server():
    print('[kono-judge] Closing websocket server...')
    if len(connections) > 0:
        await asyncio.wait([websocket.close() for websocket in connections])

def main():
    loop = asyncio.get_event_loop()

    # Retrieve websocket server and HTTP server contexts
    websocket_runner       = websocket_server()
    http_runner, http_site = loop.run_until_complete(http_server())

    try:
        # Run two servers in separate coroutines
        asyncio.gather(websocket_runner, http_site.start())
        loop.run_forever()

    except KeyboardInterrupt:
        # Handle Ctrl+C (SIGINT) interrupt
        # Execute cleanup coroutines
        loop.run_until_complete(close_websocket_server())
        loop.run_until_complete(close_http_server(http_runner))

        print('[kono-judge] Exiting...')

if __name__ == '__main__':
    main()
