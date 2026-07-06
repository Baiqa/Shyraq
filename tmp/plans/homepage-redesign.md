# Homepage Redesign Plan (Layout-only, multi-column grid)

Scope: c:/Shyraq/app/page.tsx and shared components. Keep fonts, blue accent, tokens.

## Diagnosis
- Feed is single-column horizontal cards in max-w-7xl -> ~half width wasted, sparse.
- Hero is two equal cards -> no lead-story hierarchy.
- Suspense fallback is literal "Loading news..." text -> jarring, no skeleton.
- No vertical rhythm / sectioning.

## Changes (opt-in props, backward compatible)
1. HeroCard: variant 'lead' (default, current) | 'secondary' (fills cell, smaller title, no desc).
2. NewsCardClient: variant 'horizontal' (default) | 'vertical' (image top 16:9, content below).
3. NewsCard: pass variant through.
4. NewsFeed: layout 'list' (default) | 'grid' (cols 1/2/3, vertical cards, matching skeleton).
5. page.tsx: hero = 1 lead (2/3, col-span-2) + 2 secondary stacked (1/3); feed layout="grid";
   replace text fallback with skeleton grid.

## Shared-usage safety
- NewsFeed also: search, category, saved -> defaults unchanged.
- HeroCard also: category -> default 'lead' unchanged.
- NewsCard also: article related -> default 'horizontal' unchanged.

## Verify
- npm run lint, npm run build pass.
- Homepage: lead+secondary hero, 3-col feed desktop, skeleton on load.
- Other 4 pages visually unchanged.
