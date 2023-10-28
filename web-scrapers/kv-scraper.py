# https://realpython.com/beautiful-soup-web-scraper-python/
from utils.requests_utils import check_whether_website_can_be_scraped
from bs4 import BeautifulSoup as bs
import requests

html = '''
<article class="default object-type-apartment" data-object-id="3583472" data-object-url="/uurile-anda-2-toaline-korter-pindala-45-m2-6s-korr-3583472.html">
    <div class="media">
        <div class="images swiper swiper-initialized swiper-horizontal" data-swiper-pagination="" data-swiper-element="a">
            <div class="swiper-wrapper" id="swiper-wrapper-06df1873dd51df1f" aria-live="polite" style="transform: translate3d(0px, 0px, 0px);">
                <div class="swiper-slide swiper-slide-active" style="width: 372px;" role="group" aria-label="1 / 3"><a data-key="8cb14a4e7a1" href="/uurile-anda-2-toaline-korter-pindala-45-m2-6s-korr-3583472.html" data-skeleton="object"> <img src="https://kv.img-bcg.eu/image/object/34/5637/115525637.jpg" loading="lazy" alt=""> </a></div>
                <div class="swiper-slide" style="width: 372px;" role="group" aria-label="2 / 3"><a data-key="8cb14a4e7a3" href="/uurile-anda-2-toaline-korter-pindala-45-m2-6s-korr-3583472.html" data-skeleton="object"> <img src="https://kv.img-bcg.eu/image/object/34/5640/115525640.jpg" loading="lazy" alt=""> </a></div>
                <div class="swiper-slide" role="group" aria-label="3 / 3" style="width: 372px;"><a data-key="8cb14a4e7a17" href="/uurile-anda-2-toaline-korter-pindala-45-m2-6s-korr-3583472.html" data-skeleton="object"> <img src="https://kv.img-bcg.eu/image/object/34/5657/115525657.jpg" loading="lazy" alt=""> </a></div>
            </div>
            <div class="swiper-button-next" tabindex="0" role="button" aria-label="Next slide" aria-controls="swiper-wrapper-06df1873dd51df1f" aria-disabled="false"></div>
            <div class="swiper-button-prev swiper-button-disabled" tabindex="-1" role="button" aria-label="Previous slide" aria-controls="swiper-wrapper-06df1873dd51df1f" aria-disabled="true"></div>
            <div class="swiper-pagination swiper-pagination-fraction swiper-pagination-horizontal"><span class="swiper-pagination-current">1</span> / <span class="swiper-pagination-total">17</span></div>
            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
        </div>
    </div>
    <div class="actions"> <a data-key="8cb143ed1218" onclick="KV.favorite(3583472, 'object')" title="Lisa lemmikuks"><i class="icon icon-heart"></i></a> <a data-key="8cb14b7bff19" href="/object/images/3583472" data-target="gallery" title="Galerii"><i class="icon icon-camera"></i></a> </div>
    <div class="description">
        <h2> <a data-key="8cb14a4e7a20" href="/uurile-anda-2-toaline-korter-pindala-45-m2-6s-korr-3583472.html" data-skeleton="object"> Tallinn, Kesklinn, Kreutzwaldi 19 </a> </h2>
        <p class="object-excerpt"> Korrus 6/6, kivimaja, ehitusaasta 1932, valmis, elektripliit, boiler, dušš, keskküte, ... </p>
        <p class="object-excerpt"> Üürile anda 2 toaline korter, pindala 45 m2, 6-s korrus, lift. Ajalooline kivimaja ... </p>
    </div>
    <div class="rooms"> 2 </div>
    <div class="area"> 45&nbsp;m² </div>
    <div class="add-time"> </div>
    <div class="price"> 400&nbsp;€ <small> 8.89 €/m² </small> </div>
</article>
'''

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

    # soup = bs(website.content, 'lxml')
    # THIS IS FOR TESTING ONLY!
    soup = bs(html, 'html.parser')

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
