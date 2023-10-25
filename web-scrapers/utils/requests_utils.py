import requests
import logging


def check_whether_website_can_be_scraped(base_url: str) -> bool:
    if requests.get(base_url).status_code == 200:
        logging.info(f"Crawler accessed {base_url} successfully!")
        return True
    else:
        logging.error(f"There was an error accessing the {base_url}!")
        return False
