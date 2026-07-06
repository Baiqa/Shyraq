"""
Smoke-тесты главной страницы PULSE (https://shyraq-one.vercel.app).

Принципы:
- Только явные ожидания (WebDriverWait) — никакого time.sleep().
- Page Object Model: все локаторы и действия живут в pages/home_page.py,
  сам тест читается как сценарий, а не как набор селекторов.
- Каждый тест быстрый и независимый — открывает страницу заново.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from selenium.webdriver.support.ui import WebDriverWait

from pages.home_page import HomePage


class TestPulseSmoke:

    def test_page_loads_with_correct_title(self, driver):
        """Страница открывается, title содержит 'PULSE'"""
        page = HomePage(driver).open_home()
        assert "PULSE" in page.get_title()

    def test_logo_is_visible(self, driver):
        """Логотип PULSE отображается в хедере"""
        page = HomePage(driver).open_home()
        assert page.is_logo_visible()

    def test_all_category_links_are_visible(self, driver):
        """Все ссылки навигации по категориям видимы"""
        page = HomePage(driver).open_home()
        category_locators = [
            page.NAV_LINK_TECH,
            page.NAV_LINK_BUSINESS,
            page.NAV_LINK_SPORTS,
            page.NAV_LINK_WORLD,
            page.NAV_LINK_SCIENCE,
        ]
        for locator in category_locators:
            assert page.is_visible(locator), f"Категория {locator} не видна"

    def test_category_click_navigates_to_correct_url(self, driver):
        """Клик по категории 'Tech' переводит на /category/technology"""
        page = HomePage(driver).open_home()
        page.click_category(page.NAV_LINK_TECH)
        page.wait_for_url_contains("category/technology")
        assert "category/technology" in page.get_current_url()

    def test_news_cards_are_loaded(self, driver):
        """На главной странице загружено минимум 5 новостных карточек"""
        page = HomePage(driver).open_home()
        cards = page.get_news_cards()
        assert len(cards) >= 5, f"Найдено только {len(cards)} карточек"

    def test_footer_is_visible(self, driver):
        """Футер отображается на странице"""
        page = HomePage(driver).open_home()
        assert page.is_footer_visible()

    def test_no_severe_console_errors(self, driver):
        """В консоли браузера отсутствуют критичные (SEVERE) ошибки"""
        page = HomePage(driver).open_home()
        page.find(page.LOGO_TEXT_FALLBACK)  # ждём, что страница реально отрендерилась
        logs = driver.get_log("browser")
        severe_errors = [log for log in logs if log["level"] == "SEVERE"]
        assert not severe_errors, f"Найдены критичные ошибки: {severe_errors}"

    def test_switch_themes(self, driver):
        page = HomePage(driver).open_home()
        initial_theme = page.get_current_theme()
        expected_theme = "dark" if initial_theme == "light" else "light"

        page.click(page.THEME_TOGGLE)

        WebDriverWait(driver, 10).until(
            lambda d: page.get_current_theme() == expected_theme
        )

        assert page.get_current_theme() == expected_theme, (
            f"Ожидали тему '{expected_theme}', получили '{page.get_current_theme()}'"
        )
