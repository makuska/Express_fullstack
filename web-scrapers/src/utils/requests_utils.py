import requests
import logging
from scraping_errors import WebsiteScrapingError



def check_whether_website_can_be_scraped(base_url: str) -> bool:
    status_code: int = requests.get(base_url).status_code
    if status_code == 200:
        logging.info(f"Crawler accessed {base_url} successfully!")
        return True
    else:
        error_message = f"There was an error accessing the {base_url}!"
        logging.error(error_message)
        raise WebsiteScrapingError(error_message, status_code)

