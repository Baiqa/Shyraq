# Per-category темы + живые виджеты

## Контекст

Сейчас все 6 категорий (`all, technology, business, sports, general, science`) рендерятся идентичным шаблоном в `app/category/[slug]/page.tsx` и `app/page.tsx` — отличается только заголовок `<h1>`. Пользователь хочет, чтобы каждая категория ощущалась уникально: свой акцентный цвет/иконка + свой "живой" виджет с данными, характерными для темы (биржевые графики для Business, счёт событий для Sports и т.д.).

Изначально пользователь также просил убрать редирект на оригинальный сайт при открытии новости и показывать полный текст на своём сайте. **Эта часть отложена пользователем** — в базе почти нет полного текста статей (NewsAPI free tier обрезает `content` до ~200 символов, Guardian вообще не запрашивает body), а у NewsAPI/Guardian в ToS обычно требуется кликабельная атрибуция источника. Это отдельная задача на будущее, в текущий план не входит — `HeroCard.tsx` и ссылка "Read full article on {source}" в `app/article/[id]/page.tsx` не трогаем.

## Подтверждённые решения (после уточняющих вопросов)

| Категория | Источник данных | Виджет | Расположение |
|---|---|---|---|
| Business | Twelve Data API (800 req/day, 8/min) — нужен API-ключ от пользователя | `StockTickerWidget` — line-график (Recharts) | sidebar |
| Sports | API-Football / API-Sports (100 req/day) — нужен API-ключ от пользователя | `LiveScoresWidget` — счёт популярных матчей | top-banner |
| Technology | GitHub Search API, без ключа (60 req/hr) | `TrendingReposWidget` — трендовые репозитории за неделю | sidebar |
| Science | arXiv API, без ключа | `LatestPapersWidget` — последние статьи | below-hero |
| General | Собственные уже загруженные статьи, без внешнего API | `BreakingTicker` — бегущая лента заголовков | top-banner |
| All | без изменений (нейтральный `accent`, без виджета) | — | — |

Архитектура: **один параметризованный `CategoryPage`** с конфигом темы на категорию, а не 5 отдельных файлов-страниц — иначе задублируется fetch/sync-логика (`getArticles`, `syncArticles`, `revalidate`, `generateStaticParams`), одинаковая для всех категорий. Разный визуал достигается через: акцентный цвет, иконку (lucide-react), уникальный виджет и его расположение (sidebar / top-banner / below-hero). Варианты карточек статей (`NewsCard`) под категорию — отложены на потом, в этой итерации не делаем.

## Новые файлы

**`lib/categories.ts`** — единый источник правды по категориям (заменяет задублированные списки в `app/category/[slug]/page.tsx` и `components/CategoryNav.tsx`):
```ts
export type WidgetPlacement = 'sidebar' | 'top-banner' | 'below-hero';

export interface CategoryTheme {
  slug: Category;
  label: string;
  pageTitle: string;
  accentClass: string;       // литеральные Tailwind-классы (JIT не умеет в bg-${var}-500)
  accentBorderClass: string;
  accentBgClass: string;
  icon: LucideIcon;
  widget: ComponentType | null;
  widgetPlacement: WidgetPlacement | null;
}

export const categories: CategoryTheme[];
export function getCategoryTheme(slug: Category): CategoryTheme | undefined;
```
Цвета (light/dark, литеральные классы, т.к. Tailwind JIT не подхватывает динамически собранные строки вида `bg-${cat}-500`): business `emerald-600/400`, sports `orange-600/400`, technology `violet-600/400`, science `sky-600/400`, general `rose-600/400`, all — текущий `accent` (`#2563EB`).

**Виджет-фетчеры** (`lib/widgets/`) — server-only, повторяют паттерн устойчивости из `lib/newsapi.ts` (try/catch → `console.error` → безопасный пустой fallback, никогда не бросают, `fetch(url, { next: { revalidate } })`):
- `twelveData.ts` — `fetchStockSnapshot(symbols=['SPY','QQQ','AAPL'])`, `TWELVE_DATA_API_KEY`, revalidate 300s. Один batched-запрос на все символы (Twelve Data считает каждый символ в батче отдельным credit) — держать список коротким.
- `apiFootball.ts` — `fetchLiveFixtures()`, `API_FOOTBALL_KEY`, revalidate 1800s (30 мин — с запасом от теоретического минимума ~14 мин/запрос, т.к. ISR revalidate не гарантирует строгий single-flight под нагрузкой).
- `github.ts` — `fetchTrendingRepos()`, без ключа, `search/repositories?q=created:>{date7d}&sort=stars`, revalidate 3600s.
- `arxiv.ts` — `fetchLatestPapers()`, без ключа, Atom XML → парсить простым regex-извлечением `<entry>` (без новой XML-зависимости), revalidate 1800s.
- `breakingTicker.ts` — чистая функция `getBreakingTickerItems(articles, limit=8)` поверх уже загруженного `articles` на странице, без отдельного fetch/revalidate.

Все фетчеры возвращают `null`/`[]` при ошибке или отсутствующем ключе — виджет должен показать красивое "недоступно", а не упасть.

**UI-компоненты** (`components/widgets/`): `StockTickerWidget.tsx` (Server Component + `StockChart.tsx` — `'use client'` тонкая обёртка над Recharts `<LineChart>`, получает данные пропом, ключ никогда не уходит в браузер), `LiveScoresWidget.tsx`, `TrendingReposWidget.tsx`, `LatestPapersWidget.tsx`, `BreakingTicker.tsx` (CSS-анимация через существующий паттерн `keyframes`/`animation` в `tailwind.config.ts`, без JS-тикер-библиотеки). Каждый — свой fallback-стейт в духе существующего "No articles found" в `NewsFeed.tsx`.

## Изменяемые файлы

- **`app/category/[slug]/page.tsx`** — заменить `validCategories`/`categoryLabels` на `categories`/`getCategoryTheme` из `lib/categories.ts`. Добавить рендер виджета по `theme.widgetPlacement`: `sidebar` → обернуть feed-секцию в `grid lg:grid-cols-[1fr_320px]`, `top-banner` → секция сразу под `<h1>`, `below-hero` → секция между hero и feed. `getArticles`/`syncArticles`/`revalidate`/`generateStaticParams` не трогаем.
- **`components/CategoryNav.tsx`** — брать категории из `lib/categories.ts`, рендерить `theme.icon` рядом с лейблом, активный пункт подсвечивать `theme.accentClass`/`accentBorderClass` вместо общего `text-accent`.
- **`.env.local.example`** — добавить `TWELVE_DATA_API_KEY=` и `API_FOOTBALL_KEY=` (без `NEXT_PUBLIC_` — читаются только на сервере).
- **`package.json`** — добавить `recharts` (график для Business) и `lucide-react` (иконки категорий).
- **`CLAUDE.md`** — короткая заметка про `lib/categories.ts` как единый источник правды по категориям и про конвенцию кэширования виджетов, чтобы список категорий больше не дублировался.

`app/page.tsx` (псевдокатегория "all") не меняем — остаётся нейтральной, без виджета.

## Обязательное действие пользователя

Business и Sports виджеты не покажут реальные данные, пока пользователь сам не зарегистрируется на twelvedata.com и api-football.com (RapidAPI или api-sports.io) и не пришлёт ключи для `.env.local`. До этого — корректный fallback "данные недоступны", это ожидаемо. GitHub и arXiv виджеты заработают сразу, без ключей.

## Кэширование / лимиты (см. таблицу в контексте)

Business 300s, Sports 1800s, Technology 3600s, Science 1800s, General — на кэше самой страницы (300s). Если в логах появятся 429 от Twelve Data/API-Football — увеличивать эти значения, а не переписывать логику.

## Проверка

1. `npm run build` — все 6 `generateStaticParams`, нет TS-ошибок по новым типам.
2. `npm run dev`, вручную открыть `/`, `/category/business`, `/category/sports`, `/category/technology`, `/category/science`, `/category/general`, переключить `ThemeToggle` — проверить акценты/иконки/виджеты в light и dark.
3. Без ключей в `.env.local` — Business/Sports показывают fallback, не падают. С ключами — реальные данные. Tech/Science работают сразу.
4. Проверить `sidebar`-расположение (Business, Technology) на мобильной ширине — должно стекаться, не ломать layout.
5. Не затронуты: `/search`, `/saved`, `/article/[id]` — открыть и убедиться, что работают как раньше.
6. `CategoryNav` корректно подсвечивает активную категорию на каждом роуте.
7. Прогнать `cd pulse_tests && python -m pytest tests/ -v` на запущенном `npm run dev` — без регрессий.

## После одобрения плана

Скопировать этот файл в `tmp/plans/` проекта (`c:\Shyraq\tmp\plans\`) согласно правилам работы с планами.
