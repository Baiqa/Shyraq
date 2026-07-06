"""
Page Object для главной страницы PULSE.
Все локаторы вынесены в class-level константы — главные инструменты:
CSS-селекторы (быстрее и стабильнее) и XPath (когда нужен текстовый поиск).
"""

from selenium.webdriver.common.by import By
from pages.base_page import BasePage

BASE_URL = "https://shyraq-one.vercel.app"


class HomePage(BasePage):
    # --- Локаторы ---
    LOGO = (By.CSS_SELECTOR, "a[href='/']")
    LOGO_TEXT_FALLBACK = (By.XPATH, "//a[contains(., 'PULSE')]")

    NAV_LINK_TECH = (By.CSS_SELECTOR, "a[href='/category/technology']")
    NAV_LINK_BUSINESS = (By.CSS_SELECTOR, "a[href='/category/business']")
    NAV_LINK_SPORTS = (By.CSS_SELECTOR, "a[href='/category/sports']")
    NAV_LINK_WORLD = (By.CSS_SELECTOR, "a[href='/category/general']")
    NAV_LINK_SCIENCE = (By.CSS_SELECTOR, "a[href='/category/science']")

    SEARCH_BUTTON = (By.CSS_SELECTOR, "button[aria-label*='search' i], button[class*='search' i]")

    THEME_TOGGLE = (By.CSS_SELECTOR, "button[title*='Switch to']")

    NEWS_CARD_LINKS = (
        By.XPATH,
        "//main//a[contains(@href, 'http') and not(contains(@href, 'shyraq-one'))]",
    )

    FOOTER = (By.TAG_NAME, "footer")

    # --- Действия ---
    def open_home(self):
        return self.open(BASE_URL)

    def click_category(self, category_locator):
        self.click(category_locator)
        return self

    def get_news_cards(self):
        return self.find_all(self.NEWS_CARD_LINKS)

    def is_logo_visible(self) -> bool:
        return self.is_visible(self.LOGO) or self.is_visible(self.LOGO_TEXT_FALLBACK)

    def is_footer_visible(self) -> bool:
        return self.is_visible(self.FOOTER)

    def get_current_theme(self):
        html_element = self.driver.find_element(By.TAG_NAME, "html")
        classes = html_element.get_attribute("class")
        return "dark" if "dark" in classes else "light"
