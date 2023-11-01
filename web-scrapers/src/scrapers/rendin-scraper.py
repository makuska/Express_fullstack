# https://www.city24.ee/real-estate-search/apartments-for-rent/tallinn-kesklinna-linnaosa,tallinn-kristiine-linnaosa,tallinn-pohja-tallinna-linnaosa/price=eur-400-550/id=1240-city,1535-city,3166-city
# What tf is that url structure lol

# https://kinnisvara24.ee/kinnisvaraotsing?deal_types[]=rent&object_types[]=apartment&page=2&price_max=500&price_min=390&sort_by=price&sort_order=asc&addresses[0][A1]=Harju%20maakond&addresses[0][A2]=Tallinn&addresses[0][A3]=Kesklinna%20linnaosa&addresses[1][A1]=Harju%20maakond&addresses[1][A2]=Tallinn&addresses[1][A3]=Kristiine%20linnaosa&addresses[2][A1]=Harju%20maakond&addresses[2][A2]=Tallinn&addresses[2][A3]=P%C3%B5hja-Tallinna%20linnaosa&addresses[2][A4]=Kalamaja&addresses[3][A1]=Harju%20maakond&addresses[3][A2]=Tallinn&addresses[3][A3]=P%C3%B5hja-Tallinna%20linnaosa

from utils.requests_utils import check_whether_website_can_be_scraped
from bs4 import BeautifulSoup as bs
import requests
import re

html = '''
<div class="flex-grow flex flex-col md:flex md:flex-row">
    <a href="/invite/form/KPNP" class="w-100 h-48 block flex-shrink-0 rounded-lg bg-gray-50 bg-cover bg-center cursor-pointer md:w-64 lazyLoad isLoaded" style="background-image: url(&quot;https://res.cloudinary.com/dmsxfecue/image/upload/w_700,h_520,c_fill/q_auto,f_auto/v1695636672/advertisement/eu2ydgqfklyjqnt1ircc.jpg&quot;);"></a>
    <div class="w-full flex flex-col flex-grow">
        <a href="/invite/form/KPNP" class="">
            <h3 class="text-xl font-bold">
                 Kauba tn 10<span>,</span> Kesklinn, Tallinn
            </h3>
        </a>
        <div class="text-sm sm:grid sm:grid-cols-2 sm:gap-10 lg:max-w-xl">
            <ul>
                <li class="flex justify-between my-4"><span>Tube</span> <span class="font-semibold ml-2">1</span></li>
                <li class="flex justify-between my-4"><span>Ruutmeetreid</span> <span class="font-semibold ml-2">19 m<sup>2</sup></span></li>
                <li class="flex justify-between my-4"><span>Parkimine</span> <span class="font-semibold ml-2">Ei</span></li>
            </ul>
            <ul>
                <li class="flex justify-between my-4"><span>Üürimakse</span> <span class="font-semibold ml-2">410 EUR</span></li>
                <li class="flex justify-between my-4"><span>Tagatisraha</span> <span class="font-semibold ml-2">0 EUR</span></li>
                <li class="flex justify-between my-4"><span>Rendini kuutasu</span> <span class="font-semibold ml-2">10,25 EUR</span></li>
            </ul>
        </div>
    </div>
</div>
'''


def get_parameters_for_request(city_areas: [str], min_price: int = None, max_price: int = None, min_rooms: int = None, max_rooms: int = None):
    parameters = {
        "city": 'Tallinn',
        "districts": city_areas,
    }

    if min_price is not None:
        parameters["priceMin"] = min_price
    if max_price is not None:
        parameters["priceMax"] = max_price

    if min_rooms is not None:
        parameters["roomsMin"] = min_rooms
    if max_rooms is not None:
        parameters["roomsMax"] = max_rooms

    return parameters


header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36"
}


# Sample url
# https://rendin.ee/find-home?city=Tallinn&districts=%5B%22Kesklinn%22,%22Kristiine%22,%22P%C3%B5hja-Tallinn%22%5D&priceMin=350&priceMax=450
def create_url_with_params(base_url: str, params: dict) -> str:
    query_params = []

    for key, value in params.items():
        if isinstance(value, list):
            # If the value is a list, join the elements with commas and encode it
            encoded_value = ','.join(value)
            query_params.append(f"{key}={encoded_value}")
        elif value is not None:
            # Include the parameter only if it's not None
            query_params.append(f"{key}={value}")

    # Join the query parameters with '&' and construct the URL
    query_string = '&'.join(query_params)
    url = f"{base_url}/find-home?{query_string}"
    return url


def find_investments(base_url: str) -> [{}]:
    check_whether_website_can_be_scraped(base_url)
    user_data = get_parameters_for_request(["Kesklinn", "Kristiine", "Pirita"], min_price=250, max_price=600, min_rooms=1)
    formatted_url = create_url_with_params(base_url, user_data)

    website = requests.get(formatted_url, headers=header)

    # soup = bs(website.content, 'lxml')
    # THIS IS FOR TESTING ONLY!
    soup = bs(html, 'html.parser')

    results = soup.find_all('div', class_="flex-grow flex flex-col md:flex md:flex-row")

    found_results = []
    for result in results:
        img_style_attr = result.find('a')['style']
        img_match = re.search(r'url\(&quot;([^&]*)&quot;\)', img_style_attr)
        image_url = img_match.group(1) if img_match else None

        additional_rent = result.find_all('ul')[1].find_all('span', class_='font-semibold ml-2')[1].text
        price = result.find_all('ul')[1].find_all('span', class_='font-semibold ml-2')[0].text
        price = f"{price} + {additional_rent}"
        data = {
            "img_url": image_url,
            "description": result.find('h3').text,
            "rooms": result.find_all('ul')[0].find_all('span', class_='font-semibold ml-2')[0].text,
            "squareM": result.find_all('ul')[0].find_all('span', class_='font-semibold ml-2')[1].text,
            "price": price,
        }
        found_results.append(data)

    return found_results
