# judge.py
#   Main file for kono-judge
#   Depends on:
#       - data.py   (data structure for storing arduino data packets)
#       - router.py (router of the HTTP server)
# 
# bash> python3 judge.py

import os
import asyncio
import json
from dotenv import load_dotenv
from aiohttp.web import Application, AppRunner, TCPSite
import aiohttp_cors

from router import Router
from websocket_server import WebSocketServer
from data import Datadump
from connection import Connection

# Load environment variables (.env on local development, or set by docker-compose)
load_dotenv()
WEBSOCKET_PORT = os.getenv('WEBSOCKET_PORT')    # Port used for websocket server
HTTP_PORT      = os.getenv('HTTP_PORT')         # Port used for RESTful HTTP server

# Whitelist for API requests (CORS issue)
WHITELIST = [
    'http://judge.kono.sparcs.org',     # Production server
    'http://localhost:3000'             # Local development
]

async def http_server(datadump, connection):
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
    router = Router(datadump, connection)
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

def main():
    # Confidentials (refer to docs.kono.sparcs.org)
    try:
        with open('confidentials.json') as confidentials_file:
            confidentials = json.loads(confidentials_file.read())

        loop = asyncio.get_event_loop()

        # Build shared data
        datadump   = Datadump()
        connection = Connection(confidentials)

        # Build websocket server
        websocket_server = WebSocketServer('0.0.0.0', WEBSOCKET_PORT, datadump, connection)
        websocket_runner = websocket_server.get_runner()

        # Build HTTP server
        http_runner, http_site = loop.run_until_complete(http_server(datadump, connection))

        try:
            # Run two servers in separate coroutines
            asyncio.gather(websocket_runner, http_site.start())
            loop.run_forever()

        except KeyboardInterrupt:
            # Handle Ctrl+C (SIGINT) interrupt
            # Execute cleanup coroutines
            loop.run_until_complete(websocket_server.close())
            loop.run_until_complete(close_http_server(http_runner))

            print('[kono-judge] Exiting...')

    except FileNotFoundError:
        print('confidentials.json does not exist')

if __name__ == '__main__':
    main()
