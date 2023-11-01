import json
import logging

from websockets import WebSocketServerProtocol

log = logging.getLogger()
log.setLevel(logging.INFO)


class WebSocketManager:
    """
    Manages WebSocket connections and facilitates communication with clients.

    WebSocketManager is responsible for managing WebSocket connections, handling
    errors, broadcasting messages, and removing connections.

    Attributes:
        connections (set): A set containing active WebSocket connections.

    Methods:

    - add_connection(websocket: WebSocketServerProtocol)
        Adds a WebSocket connection to the manager's list of active connections.

    - remove_connection(websocket: WebSocketServerProtocol)
        Removes a WebSocket connection from the manager's list of active connections.

    - send_to_all(data: dict)
        Broadcasts a JSON data message to all connected clients.

    - handle_scraping_errors(error_message: str, websocket: WebSocketServerProtocol)
        Handles and broadcasts an error message to all clients or a specific client.

    """
    def __init__(self):
        self.connections = set()

    def add_connection(self, websocket: WebSocketServerProtocol) -> None:
        log.info("Added websocket connection: %s", str(websocket))
        self.connections.add(websocket)

    async def remove_connection(self, websocket: WebSocketServerProtocol) -> None:
        log.info("Websocket connection removed: %s", str(websocket))
        if websocket is not None:
            self.connections.remove(websocket)
        else:
            log.error("Websocket is None")

    async def send_to_all(self, data) -> None:
        for websocket in self.connections:
            await websocket.send(json.dumps(data))

    async def handle_scraping_errors(self, error_message, websocket: WebSocketServerProtocol = None) -> None:
        # Sends the error to the client as a broadcast if the websocket is None
        error_data = {"error": error_message}
        if websocket:
            await websocket.send(json.dumps(error_data))
        else:
            for conn in self.connections:
                await conn.send(json.dumps(error_data))


ws_manager = WebSocketManager()
