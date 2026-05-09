-- =====================================================================
-- SnapGain — Phase B.2: user-state tables
--
-- Adds 5 new tables that back the user-facing features the app needs:
--   * saved_strategies        — saved comparison routes (replacing localStorage)
--   * recent_searches         — search history (replacing localStorage)
--   * user_favourites         — favourited stores (composite PK)
--   * user_miles_programs     — which airline programs the user has + balance
--   * user_cashback_platforms — which cashback platforms the user has + balance
--
-- Notes:
--   * Existing stores.id and platform.id are uuid; FKs use uuid.
--   * Frontend will resolve slug -> uuid before saving, and join on uuid
--     when reading.
--   * RLS: only owner can do anything with their own rows.
-- =====================================================================

-- ---------------------------------------------------------------------
-- saved_strategies — replaces snapgain_saved_strategies in localStorage
-- ---------------------------------------------------------------------
create table public.saved_strategies (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id)      on delete cascade,
  store_id    uuid          references public.stores(id)   on delete set null,
  platform_id uuid          references public.platform(id) on delete set null,
  amount      numeric,
  nickname    text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index saved_strategies_user_idx
  on public.saved_strategies (user_id, created_at desc);

drop trigger if exists saved_strategies_set_updated_at on public.saved_strategies;
create trigger saved_strategies_set_updated_at
  before update on public.saved_strategies
  for each row execute function public.tg_set_updated_at();

alter table public.saved_strategies enable row level security;

create policy saved_strategies_owner_select on public.saved_strategies
  for select using (auth.uid() = user_id);
create policy saved_strategies_owner_insert on public.saved_strategies
  for insert with check (auth.uid() = user_id);
create policy saved_strategies_owner_update on public.saved_strategies
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy saved_strategies_owner_delete on public.saved_strategies
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- recent_searches — replaces snapgain_recent_searches in localStorage
-- ---------------------------------------------------------------------
create table public.recent_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  query       text not null,
  searched_at timestamptz not null default now()
);
create index recent_searches_user_idx
  on public.recent_searches (user_id, searched_at desc);

alter table public.recent_searches enable row level security;

create policy recent_searches_owner_select on public.recent_searches
  for select using (auth.uid() = user_id);
create policy recent_searches_owner_insert on public.recent_searches
  for insert with check (auth.uid() = user_id);
create policy recent_searches_owner_delete on public.recent_searches
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- user_favourites — favourited stores
-- ---------------------------------------------------------------------
create table public.user_favourites (
  user_id    uuid not null references auth.users(id)    on delete cascade,
  store_id   uuid not null references public.stores(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, store_id)
);
create index user_favourites_user_idx
  on public.user_favourites (user_id);

alter table public.user_favourites enable row level security;

create policy user_favourites_owner_select on public.user_favourites
  for select using (auth.uid() = user_id);
create policy user_favourites_owner_insert on public.user_favourites
  for insert with check (auth.uid() = user_id);
create policy user_favourites_owner_delete on public.user_favourites
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- user_miles_programs — programs the user is enrolled in + balance
-- ---------------------------------------------------------------------
create table public.user_miles_programs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id)             on delete cascade,
  miles_program_id uuid not null references public.miles_programs(id)  on delete cascade,
  balance          numeric not null default 0,
  account_number   text,
  is_active        boolean not null default true,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, miles_program_id)
);
create index user_miles_programs_user_idx
  on public.user_miles_programs (user_id);

drop trigger if exists user_miles_programs_set_updated_at on public.user_miles_programs;
create trigger user_miles_programs_set_updated_at
  before update on public.user_miles_programs
  for each row execute function public.tg_set_updated_at();

alter table public.user_miles_programs enable row level security;

create policy user_miles_programs_owner_select on public.user_miles_programs
  for select using (auth.uid() = user_id);
create policy user_miles_programs_owner_insert on public.user_miles_programs
  for insert with check (auth.uid() = user_id);
create policy user_miles_programs_owner_update on public.user_miles_programs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_miles_programs_owner_delete on public.user_miles_programs
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- user_cashback_platforms — cashback platforms the user uses + balance
-- ---------------------------------------------------------------------
create table public.user_cashback_platforms (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id)      on delete cascade,
  platform_id uuid not null references public.platform(id) on delete cascade,
  balance     numeric not null default 0,
  is_active   boolean not null default true,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, platform_id)
);
create index user_cashback_platforms_user_idx
  on public.user_cashback_platforms (user_id);

drop trigger if exists user_cashback_platforms_set_updated_at on public.user_cashback_platforms;
create trigger user_cashback_platforms_set_updated_at
  before update on public.user_cashback_platforms
  for each row execute function public.tg_set_updated_at();

alter table public.user_cashback_platforms enable row level security;

create policy user_cashback_platforms_owner_select on public.user_cashback_platforms
  for select using (auth.uid() = user_id);
create policy user_cashback_platforms_owner_insert on public.user_cashback_platforms
  for insert with check (auth.uid() = user_id);
create policy user_cashback_platforms_owner_update on public.user_cashback_platforms
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_cashback_platforms_owner_delete on public.user_cashback_platforms
  for delete using (auth.uid() = user_id);
