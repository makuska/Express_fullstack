# Python websocket server to run web scrapers
The idea is to have multiple web scrapers for different sources. In order to send data back to the client in real time there's a need for data streaming pipeline.

Since there is no need for data manipulation (everything is done within the scripts, the data is transformed to JSON format), using Kafka would be overkill.
Python's `websockets` package seems to do the job alright.

With `docker compose`, `server.py` starts on a separate container and listens for requests on port **8001**. 