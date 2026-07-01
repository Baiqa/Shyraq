# PULSE — Smoke-тесты (Selenium + Page Object Model)

## Структура

```
pulse_tests/
├── pages/
│   ├── base_page.py     # базовый класс: явные ожидания, общие действия
│   └── home_page.py     # Page Object главной страницы (локаторы + действия)
└── tests/
    ├── conftest.py       # фикстура driver (headless Chrome)
    ├── test_pulse_smoke.py
    └── requirements-test.txt
```

## Принципы

- **Только явные ожидания** (`WebDriverWait` + `expected_conditions`).
  `implicitly_wait()` и `time.sleep()` не используются — это снижает
  стабильность и скорость тестов.
- **Page Object Model**: локаторы и низкоуровневые действия — в `pages/`,
  тесты читаются как сценарии на бизнес-языке.
- **Локаторы**: приоритет CSS-селекторам (быстрее, проще), XPath — точечно,
  где нужен поиск по тексту (`contains(., 'PULSE')`).
- Каждый тест **независим**: открывает страницу заново, не зависит от
  порядка запуска.

## Установка

```bash
pip install -r tests/requirements-test.txt
```

## Запуск

```bash
cd pulse_tests
python -m pytest tests/ -v
```

## Что покрыто

| Тест | Проверяет |
|---|---|
| `test_page_loads_with_correct_title` | Загрузка страницы, title |
| `test_logo_is_visible` | Логотип в хедере |
| `test_all_category_links_are_visible` | Навигация по 5 категориям |
| `test_category_click_navigates_to_correct_url` | Клик → переход на правильный URL |
| `test_news_cards_are_loaded` | Подгрузка новостных карточек |
| `test_language_toggle_is_visible` | Переключатель языка |
| `test_footer_is_visible` | Футер |
| `test_no_severe_console_errors` | Отсутствие критичных JS-ошибок |

## Следующий шаг

Можно добавить `CategoryPage` (Page Object для `/category/*`) и тесты на
фильтрацию новостей по категориям — естественное развитие POM-подхода.
