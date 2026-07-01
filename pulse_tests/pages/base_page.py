"""
Базовый класс для всех Page Object'ов.
Содержит обёртки над явными ожиданиями (WebDriverWait) —
никакого time.sleep() и implicitly_wait в проекте не используется.
"""

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DEFAULT_TIMEOUT = 10


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, DEFAULT_TIMEOUT)

    def open(self, url: str):
        self.driver.get(url)
        return self

    def find(self, locator):
        """Дождаться появления элемента в DOM и вернуть его."""
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_all(self, locator):
        """Дождаться появления хотя бы одного элемента и вернуть список."""
        return self.wait.until(EC.presence_of_all_elements_located(locator))

    def click(self, locator):
        """Дождаться кликабельности элемента и кликнуть по нему."""
        element = self.wait.until(EC.element_to_be_clickable(locator))
        element.click()
        return element

    def is_visible(self, locator) -> bool:
        try:
            return self.wait.until(EC.visibility_of_element_located(locator)).is_displayed()
        except Exception:
            return False

    def wait_for_url_contains(self, fragment: str):
        self.wait.until(EC.url_contains(fragment))

    def get_title(self) -> str:
        return self.wait.until(lambda driver: driver.title.strip() if driver.title and driver.title.strip() else False)

    def get_current_url(self) -> str:
        return self.driver.current_url
