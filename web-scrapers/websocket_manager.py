import json


class WebSocketManager:
    def __init__(self):
        self.connections = set()

    def add_connection(self, websocket):
        self.connections.add(websocket)

    def remove_connection(self, websocket):
        self.connections.remove(websocket)

    async def send_to_all(self, data):
        for websocket in self.connections:
            await websocket.send(json.dumps(data))

    def handle_scraping_errors(self, error_message, websocket=None):
        # Sends the error to the client as a broadcast if the websocket is None
        error_data = {"error": error_message}
        if websocket:
            websocket.send(json.dumps(error_data))
        else:
            for conn in self.connections:
                conn.send(json.dumps(error_data))


ws_manager = WebSocketManager()
