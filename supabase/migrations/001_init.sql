-- Articles cache table
create table articles (
  id text primary key,
  title text not null,
  description text,
  content text,
  image_url text,
  source_url text not null,
  source_name text not null,
  category text not null,
  published_at timestamptz not null,
  language text not null default 'en',
  ai_summary text,
  created_at timestamptz default now()
);

create index idx_articles_category on articles(category);
create index idx_articles_published_at on articles(published_at desc);

-- Saved articles (user + article relation)
create table saved_articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  article_id text references articles(id) on delete cascade not null,
  note text,
  saved_at timestamptz default now(),
  unique(user_id, article_id)
);

create index idx_saved_articles_user on saved_articles(user_id);

-- Row Level Security
alter table articles enable row level security;
alter table saved_articles enable row level security;

-- Articles: anyone can read, only service role can write
create policy "Articles are viewable by everyone"
  on articles for select
  using (true);

create policy "Only service role can insert articles"
  on articles for insert
  with check (false); -- inserts only via server-side service role key, bypasses RLS

-- Saved articles: users can only see/modify their own
create policy "Users can view their own saved articles"
  on saved_articles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved articles"
  on saved_articles for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved articles"
  on saved_articles for delete
  using (auth.uid() = user_id);
