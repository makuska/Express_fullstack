import logging


class MyHandler(logging.StreamHandler):
    """
        Custom logging handler that formats log messages with timestamps, filenames, and log levels.

        Usage:
        To use this custom logging handler, add an instance of MyHandler to your logger. Example:

        logger = logging.getLogger()

        logger.setLevel(logging.INFO)

        logger.addHandler(MyHandler())

        Attributes:
            None

        Methods:
            __init__(): Initializes the MyHandler instance with a custom log message format.

        Format:
        The log message format includes the following components:
        - Timestamp: The time at which the log message was created in the format 'YYYY-MM-DDTHH:MM:SSUTC'.
        - Filename: The name of the source file where the log message originated.
        - Log Level: The severity level of the log message (e.g., INFO, WARNING, DEBUG).
        - Message: The actual log message content.

        Example Log Message:
        '2023-10-29T11:55:52UTC server.py          INFO    : connection open.'
        """
    def __init__(self):
        logging.StreamHandler.__init__(self)
        fmt = '%(asctime)s %(filename)-18s %(levelname)-8s: %(message)s'
        fmt_date = '%Y-%m-%dT%T%Z'
        formatter = logging.Formatter(fmt, fmt_date)
        self.setFormatter(formatter)
