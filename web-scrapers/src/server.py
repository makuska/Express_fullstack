import asyncio
import websockets
import logging
import custom_logger
from ws.websocket_manager import ws_manager
from scrapers.sample_scraper import find_quotes

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

log = logging.getLogger('root')
log.setLevel('INFO')
log.addHandler(custom_logger.MyHandler())


async def handler(websocket):
    """
        Handles WebSocket connections and data exchange with clients.

        Parameters:
            websocket (WebSocketServerProtocol): The WebSocket connection object.

        The handler function is responsible for managing WebSocket connections and
        processing incoming data from clients.

        1. It adds the WebSocket connection to the connection manager.

        2. It enters a loop that continuously listens for incoming data from the client.

        3. Upon receiving data, it responds with an acknowledgment message.

        4. If valid data is received, it initiates a background task to perform a task
           (e.g., web scraping) and communicates the progress back to the client.

        5. If no valid data is received, it sends a message to the client indicating
           an unknown request and proceeds to close the WebSocket connection.

        6. It informs the connection manager to remove the connection from its list.

        7. It explicitly closes the WebSocket connection with a reason message.

        8. The loop terminates when the WebSocket connection is closed or when a
           ConnectionClosedOK exception is raised.

        9. It handles specific exceptions, such as ConnectionClosedOK, ConnectionClosedError,
           IncompleteReadError, and other general exceptions that might occur during
           the WebSocket communication.

        Args:
            websocket (WebSocketServerProtocol): The WebSocket connection object.

        Raises:
            ConnectionClosedOK: Raised when the WebSocket connection is closed successfully.
            ConnectionClosedError: Raised if an error occurs during WebSocket closure.
            IncompleteReadError: Raised in case of a timeout on WebSocket communication.
            Exception: Raised for any other unhandled exceptions during WebSocket handling.
        """
    ws_manager.add_connection(websocket)

    try:
        websocket_running = True
        while websocket_running:
            data = await websocket.recv()
            await websocket.send("Request received, workers started!")
            # Could also specify the request/data, since frontend sends a message as data
            if data:
                sample_scraper_task = asyncio.create_task(find_quotes('https://quotes.toscrape.com', num_pages=10, websocket=websocket))
                await sample_scraper_task
            else:
                websocket.send("Unknown request, closing the connection!")
            await ws_manager.remove_connection(websocket)
            await websocket.close(reason="Tasks finished, websocket closed")
            websocket_running = False

    except websockets.ConnectionClosedOK:
        log.info("Connection closed successfully")
        await ws_manager.remove_connection(websocket)
    except websockets.ConnectionClosedError as e:
        error_message = str(e)
        log.error("Connection closed error: %s", e)
        await websocket.send(f"An error occurred with websocket connection: {error_message}")
        await ws_manager.remove_connection(websocket)
    except asyncio.exceptions.IncompleteReadError as e:
        log.error("Websocket timeout error: %s", str(e))
    except Exception as e:
        error_message = str(e)
        log.error("Exception occurred with the websocket: %s", e)
        await websocket.send(f"An error occurred with websocket handler: {error_message}")
        await ws_manager.remove_connection(websocket)


async def main():
    async with websockets.serve(handler, "scrapers", 8001):
        log.info('Websocket listening on port 8001')
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
