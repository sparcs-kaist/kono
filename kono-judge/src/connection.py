import asyncio

MAX_CONNECTIONS     = 9     # Max number of total websocket connections available
MAX_STATUS_CLIENTS  = 2     # Max number of kono-judge-status clients available

STATUS_DEVICE_ID    = 0xFFFFFFFF

class Connection():
    def __init__(self, confidentials):
        self.connections = []
        self.arduino_clients = {}
        self.status_clients = []
        self.whitelist = confidentials['allowed_device_ids']

    async def connect(self, websocket):
        # MAX_CONNECTION check
        if len(self.connections) >= MAX_CONNECTIONS:
            print('[kono-judge] Connection refused by max connection limit')
            await websocket.send('[kono-judge] Max connection limit exceeded')
            await websocket.close()
            return
        else:
            print('[kono-judge] Device Connected')
            self.connections.append(websocket)

    async def register(self, websocket, device_id):
        if device_id == 0xFFFFFFFF:
            # Client is kono-judge-status
            # MAX_STATUS_CLIENTS check
            if len(self.status_clients) >= MAX_STATUS_CLIENTS:
                await websocket.send('[kono-judge] Connection refused by max status client limit')
                await websocket.close()
            else:
                self.status_clients.append(websocket)
                await websocket.send('[kono-judge] Connected')
            return False
        else:
            # Client is kono-arduino
            if websocket not in self.arduino_clients:
                # device_id check
                if device_id in self.whitelist:
                    # duplicate connection check
                    if device_id in self.device_ids():
                        await websocket.send(f'[kono-judge] The device {device_id} is already connected. Are you sure you are the right device?')
                        print(f'[kono-judge] Dupulicate connection attempt from device {device_id}')
                        await websocket.close()
                        return False
                    else:
                        self.arduino_clients[websocket] = device_id
                        return True
                else:
                    await websocket.send('[kono-judge] Invalid device id')
                    await websocket.close()
                    return False
            else:
                return True

    async def forward_data(self, data):
        if len(self.status_clients) > 0:
            await asyncio.wait([client.send(data) for client in self.status_clients])

    async def close(self):
        print('[kono-judge] Closing websocket server...')
        if len(self.connections) > 0:
            await asyncio.wait([websocket.close() for websocket in self.connections])

    def error(self, websocket):
        print('[kono-judge] Connection closed without close frame')

    def unregister(self, websocket):
        indicator = f'device {self.arduino_clients[websocket]}' if websocket in self.arduino_clients else 'kono-status'
        print(f'[kono-judge] Disconnected: {indicator}')
        if websocket in self.connections:
            self.connections.remove(websocket)
        if websocket in self.arduino_clients:
            del self.arduino_clients[websocket]
        if websocket in self.status_clients:
            self.status_clients.remove(websocket)

    def device_ids(self):
        return list(self.arduino_clients.values())