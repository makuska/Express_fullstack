# Python websocket server to run web scrapers
The idea is to have multiple web scrapers for different sources. In order to send data back to the client in real time there's a need for data streaming pipeline.

Since there is no need for data manipulation (everything is done within the scripts, the data is transformed to JSON format, which is then sent to the client), using Kafka would be overkill.
Python's `websockets` package seems to do the job alright.

With `docker compose`, `server.py` starts on a separate container and listens for requests on port **8001**. As soon as a client makes a request to the `ws://localhost:8001` resource, websockets server will create a new websocket connection via `WebSocketManager`.
The important code flow is in the `handler` function (`./server.py`), which then creates asynchronous task (web scraper) and forwards the data back to the client in real time. Regardless of the result (OK/ERRORS) the `WebSocketManager` removes the connection from the connection pool (set), closing the websocket connection.