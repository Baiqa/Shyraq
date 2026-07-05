# Graph Report - c:\Shyraq  (2026-07-01)

## Corpus Check
- Corpus is ~9,315 words - fits in a single context window. You may not need a graph.

## Summary
- 214 nodes · 374 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Routes|App Routes]]
- [[_COMMUNITY_Homepage Test POM|Homepage Test POM]]
- [[_COMMUNITY_Dependencies and Packages|Dependencies and Packages]]
- [[_COMMUNITY_Card Components|Card Components]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Article Summaries|Article Summaries]]
- [[_COMMUNITY_Smoke Test Suite|Smoke Test Suite]]
- [[_COMMUNITY_Layout and Header|Layout and Header]]
- [[_COMMUNITY_Auth and Save Controls|Auth and Save Controls]]
- [[_COMMUNITY_Pytest Fixtures|Pytest Fixtures]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]

## God Nodes (most connected - your core abstractions)
1. `HomePage` - 21 edges
2. `compilerOptions` - 18 edges
3. `Article` - 14 edges
4. `TestPulseSmoke` - 12 edges
5. `createClient()` - 11 edges
6. `BasePage` - 11 edges
7. `createClient()` - 9 edges
8. `mergeFeeds()` - 8 edges
9. `getTimeDifference()` - 8 edges
10. `sortArticlesByDate()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `SavedPage()` --calls--> `createClient()`  [EXTRACTED]
  app/saved/page.tsx → lib/supabase/server.ts
- `POST()` --calls--> `createServiceRoleClient()`  [EXTRACTED]
  app/api/articles/sync/route.ts → lib/supabase/server.ts
- `ArticlePage()` --calls--> `getTimeDifference()`  [EXTRACTED]
  app/article/[id]/page.tsx → lib/mergeFeeds.ts
- `GET()` --calls--> `createClient()`  [EXTRACTED]
  app/auth/callback/route.ts → lib/supabase/server.ts
- `LoginPageContent()` --calls--> `createClient()`  [EXTRACTED]
  app/auth/login/LoginPageContent.tsx → lib/supabase/client.ts

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "App Routes"
Cohesion: 0.12
Nodes (25): categoryLabels, CategoryPage(), getArticles(), syncArticles(), validCategories, getArticles(), Home(), syncArticles() (+17 more)

### Community 1 - "Homepage Test POM"
Cohesion: 0.10
Nodes (10): HomePage, Страница открывается, title содержит 'PULSE, Логотип PULSE отображается в хедере, Все ссылки навигации по категориям видимы, Клик по категории 'Tech' переводит на /category/technology, На главной странице загружено минимум 5 новостных карточек, Переключатель языка (EN) виден на странице, Футер отображается на странице (+2 more)

### Community 2 - "Dependencies and Packages"
Cohesion: 0.08
Nodes (23): dependencies, @anthropic-ai/sdk, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, description (+15 more)

### Community 3 - "Card Components"
Cohesion: 0.21
Nodes (13): FreshnessBar(), FreshnessBarProps, HeroCard(), HeroCardProps, NewsCard(), NewsCardProps, NewsCardClient(), NewsCardClientProps (+5 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, incremental, isolatedModules, jsx, lib (+13 more)

### Community 5 - "Article Summaries"
Cohesion: 0.18
Nodes (12): anthropic, GET(), POST(), ArticlePage(), GET(), AISummary(), AISummaryProps, Supabase auth (+4 more)

### Community 6 - "Smoke Test Suite"
Cohesion: 0.11
Nodes (9): Smoke tests, pulse_tests/README.md, BasePage, Базовый класс для всех Page Object'ов. Содержит обёртки над явными ожиданиями (, Дождаться появления элемента в DOM и вернуть его., Дождаться появления хотя бы одного элемента и вернуть список., Дождаться кликабельности элемента и кликнуть по нему., Page Object для главной страницы PULSE. Все локаторы вынесены в class-level кон (+1 more)

### Community 7 - "Layout and Header"
Cohesion: 0.16
Nodes (10): inter, interMono, metadata, playfair, Header(), LanguageToggle(), SearchBar(), ThemeToggle() (+2 more)

### Community 8 - "Auth and Save Controls"
Cohesion: 0.38
Nodes (6): LoginPageContent(), AuthButton(), SaveButton(), SaveButtonProps, useUser(), createClient()

## Knowledge Gaps
- **56 isolated node(s):** `anthropic`, `validCategories`, `categoryLabels`, `playfair`, `inter` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HomePage` connect `Homepage Test POM` to `Smoke Test Suite`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `BasePage` connect `Smoke Test Suite` to `Homepage Test POM`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Article` connect `Card Components` to `App Routes`, `Article Summaries`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `HomePage` (e.g. with `BasePage` and `TestPulseSmoke`) actually correct?**
  _`HomePage` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `anthropic`, `validCategories`, `categoryLabels` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.11561561561561562 - nodes in this community are weakly interconnected._
- **Should `Homepage Test POM` be split into smaller, more focused modules?**
  _Cohesion score 0.09788359788359788 - nodes in this community are weakly interconnected._