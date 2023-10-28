import asyncio
import websockets
import logging
from websocket_manager import ws_manager
from sample_scraper import find_quotes

logger = logging.getLogger()
logger.setLevel(logging.INFO)


async def handler(websocket):
    ws_manager.add_connection(websocket)
    while True:
        try:
            data = await websocket.recv()
            # print(f"<<< {data}")
            # response = f"Data: {data}!"
            # await websocket.send(data)
            # print(f">>> {data}")
            if data:
                sample_scraper_task = asyncio.create_task(find_quotes('https://quotes.toscrape.com', num_pages=10))
                await sample_scraper_task

        except websockets.ConnectionClosedOK:
            ws_manager.remove_connection(websocket)
            # logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)
            # logger.info('Connection closed successfully!')
            print("Connection closed successfully!")
        except websockets.ConnectionClosedError as e:
            error_message = str(e)
            await websocket.send(f"An error occurred with websocket connection: {error_message}")
        except Exception as e:
            error_message = str(e)
            await websocket.send(f"An error occurred with websocket handler: {error_message}")


async def main():
    async with websockets.serve(handler, "scrapers", 8001):
        print('Websocket listening on port 8001')
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
