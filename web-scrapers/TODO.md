# TODOs
1. ~~Currently it doesn't always send the data back to the client, most fail, sometimes data is sent back.~~
2.~~`express_fullstack-scrapers-1   | Error processing scraped data: no close frame received or sent` Exception is triggered even though data is sometimes sent back to the client.~~
3. ~~Check `./docker-compose-logs.log` for false exception errors.~~
4. ~~frontend doesn't receive the signal that the connection is closed.~~

~~So it seems like the `ws_handler` doesn't close the connections properly, hence why it works fine for the first time and then gives an error for the scraped data (`Error processing scraped data: no close frame received or sent`).
When docker containers are stopped, then it will close multiple websocket connections.~~
