# This scraper makes requests to https://quotes.toscrape.com/, which doesn't give any IP bans, good for testing
from requests import RequestException
from websockets import ConnectionClosedOK, ConnectionClosedError

from requests_utils import check_whether_website_can_be_scraped
from bs4 import BeautifulSoup as bs
import requests
from websocket_manager import ws_manager
from scraping_errors import WebsiteScrapingError

header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36"
}


async def find_quotes(base_url: str, num_pages: int):
    # check_whether_website_can_be_scraped(base_url)
    #
    # for page_number in range(1, num_pages + 1):
    #     page_url = f"{base_url}/page/{page_number}"
    #     website = requests.get(page_url, headers=header)
    #
    #     soup = bs(website.text, 'html.parser')
    #
    #     results = soup.find_all('div', {"class": "quote"})
    #
    #     for result in results:
    #         data: dict[str, str | [str]] = {
    #             "title": result.find('span', {"class": "text"}).text[1:-1],
    #             "author": result.find('small', {"class": "author"}).text,
    #             "tags": [tag.text for tag in result.find_all('a', {"class": "tag"})],
    #         }
    #         # Send the data over the WebSocket
    #         await ws_manager.send_to_all(data)

    try:
        # result: bool = check_whether_website_can_be_scraped(base_url)
        check_whether_website_can_be_scraped(base_url)
        for page_number in range(1, num_pages + 1):
            page_url = f"{base_url}/page/{page_number}"
            try:
                website = requests.get(page_url, headers=header)
                # Raise an exception if the response status code indicates an error
                website.raise_for_status()
            except RequestException as e:
                print(f"Failed to retrieve page {page_url}: {e}")
                # Skip this page and continue with the next one
                continue

            soup = bs(website.text, 'html.parser')

            results = soup.find_all('div', {"class": "quote"})
            for result in results:
                try:
                    data: dict[str, str | [str]] = {
                        "title": result.find('span', {"class": "text"}).text[1:-1],
                        "author": result.find('small', {"class": "author"}).text,
                        "tags": [tag.text for tag in result.find_all('a', {"class": "tag"})],
                    }
                    # Send the data over the WebSocket
                    await ws_manager.send_to_all(data)
                except Exception as e:
                    print(f"Error processing scraped data: {e}")


    # Currently it broadcasts the message but it should send error message to the appropriate websocket maybe?
    except WebsiteScrapingError as e:
        ws_manager.handle_scraping_error(str(e))
    except ConnectionClosedError as e:
        print(f"An error occurred with WebSocket connection: {e}")



# Scrape data from pages 1 to 10
# find_quotes('https://quotes.toscrape.com', num_pages=10)
