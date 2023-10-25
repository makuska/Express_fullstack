from utils.requests_utils import check_whether_website_can_be_scraped
from bs4 import BeautifulSoup as bs
import requests
import lxml
import re

city_names: dict[str, str] = {
    "Haabersti": "1001",
    "Kadriorg": "5701",
    "Kesklinn": "1003",
    "Kristiine": "1004",
    "Lasnamäe": "1006",
    "Mustamäe": "1007",
    "Nõmme": "1008",
    "Pirita": "1010",
    "Põhja-Tallinn": "1011",
    "Vanalinn": "5700"
}


def map_city_names_to_numbers(city_names_list):
    """
    Maps incoming requests city areas (e.g. "Kesklinn" - to the appropriate value - "2003") from the `city_names` dict.
    Returns an array of str numbers
    """
    mapped_numbers: [str] = [key for key, value in city_names.items() if value in city_names_list]
    return mapped_numbers


def get_parameters_for_request(city_areas: [str], deal_type: int, min_price: int = None, max_price: int = None):

    mapped_city_numbers: [str] = map_city_names_to_numbers(city_areas)

    parameters = {
        "city": mapped_city_numbers,
        "county": 1,  # Harjumaa
        "deal_type": deal_type,
        "parish": 1061,  # Tallinn,
        "orderby": 'pawl',
        "view": 'default',
        "more": 500  # This works even if there aren't that many listings
    }

    if min_price is not None:
        parameters["price_min"] = min_price

    if max_price is not None:
        parameters["price_max"] = max_price

    return parameters


# class Client:
#     """
#     This is the HTTP Request client
#     """
#     def __init__(self, headers=None, url=''):
#         self.headers: {} = headers or {}
#         self.url: str = url
#
#     def prepare_request(self, path, params=None, **kwargs):
#         url: str = self.url + path
#         headers: {} = self.headers.copy()
#         headers.update(kwargs.pop('headers', {}))
#         request_data: {} = {
#             'url': url,
#             'headers': headers,
#             'params': params,
#             **kwargs
#         }
#         return request_data


header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36"
}

# client = Client(header, url)

sample_json = {
    "orderby": "pawl",
    "view": "default",
    "deal_type": "2",
    "county": "1",
    "parish": "1061",
    "city": ["1003", "1004", "1007", "1011", "5700"]
}


def create_url_with_params(base_url: str, params: dict) -> str:
    query_params: str = "&".join([f"{key}={','.join(value) if isinstance(value, list) else value}" for key, value in params.items()])
    url = f"{base_url}/search?{query_params}"
    return url


def find_investments(base_url: str) -> [{}]:
    check_whether_website_can_be_scraped(base_url)
    user_data = get_parameters_for_request(["Kesklinn", "Kristiine", "Pirita"], 1, 400, 530)
    formatted_url = create_url_with_params(base_url, user_data)

    website = requests.get(formatted_url, headers=header)

    soup = bs(website.content, 'lxml')

    results = soup.find_all('article', class_="default object-type-apartment")

    found_results = []
    for result in results:
        img_tag = result.find('img', loading="lazy", data_lazy="1")
        data = {
            "img_url": img_tag.get('src'),
            "description": result.find('h2').text,
            "rooms": result.find('div', class_="rooms").text,
            "squareM": result.find('div', class_="area").text,
            "price": result.find('div', class_="price").text,
        }
        # Instead of appending the results just to a list, it should send them immediately back to the client
        # A some kind of datastream would be necessary, all the results from the different sources would be sent back to the client in parallel
        found_results.append(data)

    return found_results
