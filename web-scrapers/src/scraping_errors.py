class WebsiteScrapingError(Exception):
    """
    Exception raised for errors when scraper attempts to scrape a website.

    Attributes:
        status_code -- websites status code returned when crawled
        message -- explanation of the error
    """
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

