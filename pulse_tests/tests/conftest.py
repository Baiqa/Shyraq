"""
Общие фикстуры pytest.
Driver создаётся один раз на тест (function scope) — это чуть медленнее,
чем session scope, но гарантирует изоляцию тестов друг от друга
(никакие cookies/состояние не "утекают" между тестами).
"""

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


@pytest.fixture(scope="function")
def driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

    service = Service(ChromeDriverManager().install())
    drv = webdriver.Chrome(service=service, options=options)

    # Важно: НЕ используем driver.implicitly_wait().
    # Все ожидания — явные (WebDriverWait), это надёжнее и предсказуемее:
    # implicitly_wait применяется глобально и плохо сочетается
    # с явными ожиданиями (могут давать неожиданные суммарные таймауты).

    yield drv
    drv.quit()
