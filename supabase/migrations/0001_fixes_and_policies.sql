-- =====================================================================
-- SnapGain — Phase B.1: surgical fixes + RLS policies on existing schema
--
-- Does NOT drop tables. Cleans up the bugs that block the app:
--   * platform.code / type / base_rate_display had bad string defaults
--   * stores.user_id (FK to auth.users) — stores are global retailers,
--     not user-owned. Drop the column and the broken read policy.
--   * Add slug to stores and platform for human-readable URLs
--   * Add freshness columns to offer tables (last_verified_at, is_active,
--     valid_from/to, conditions)
--   * user_cards was a bare bigint+created_at stub — add the real columns
--     it needs to represent a user-owned card
--   * user_simulations.user_id pointed to public.users (not auth.users) —
--     rewire to auth.users
--   * Add updated_at + trigger to stores, platform, offer tables, user_cards
--
-- Then **fix the broken read policies**:
--   The existing public-read policies use predicates like
--     auth.uid() = stores.id  or  auth.uid() = miles_programs.id
--   which is meaningless (user UUID never matches a row's UUID) and
--   blocks all reads. Replace with proper "authenticated/anon can read
--   active rows" policies. Admin write policies stay untouched.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Drop the broken stores read policy first (it references user_id)
-- ---------------------------------------------------------------------
drop policy if exists "Allow logged in users and admin to read stores" on public.stores;

-- ---------------------------------------------------------------------
-- 2. stores: drop user_id (global retailer catalog, not user-owned)
-- ---------------------------------------------------------------------
alter table public.stores drop constraint if exists stores_user_id_fkey;
alter table public.stores drop column if exists user_id;

-- ---------------------------------------------------------------------
-- 3. platform: drop bad string defaults
-- ---------------------------------------------------------------------
alter table public.platform alter column code              drop default;
alter table public.platform alter column type              drop default;
alter table public.platform alter column base_rate_display drop default;
alter table public.platform alter column country           set  default 'UK';

-- ---------------------------------------------------------------------
-- 4. Slug + is_active + updated_at on stores and platform
-- ---------------------------------------------------------------------
alter table public.stores   add column if not exists slug       text;
alter table public.stores   add column if not exists is_active  boolean not null default true;
alter table public.stores   add column if not exists updated_at timestamptz not null default now();
create unique index if not exists stores_slug_uniq   on public.stores   (slug)   where slug is not null;

alter table public.platform add column if not exists slug       text;
alter table public.platform add column if not exists updated_at timestamptz not null default now();
create unique index if not exists platform_slug_uniq on public.platform (slug)   where slug is not null;

-- ---------------------------------------------------------------------
-- 5. Freshness + activity columns on offer tables
-- ---------------------------------------------------------------------
alter table public.offers          add column if not exists is_active        boolean not null default true;
alter table public.offers          add column if not exists last_verified_at timestamptz default now();
alter table public.offers          add column if not exists valid_from       timestamptz;
alter table public.offers          add column if not exists valid_to         timestamptz;

alter table public.cashback_offers add column if not exists is_active        boolean not null default true;
alter table public.cashback_offers add column if not exists last_verified_at timestamptz default now();
alter table public.cashback_offers add column if not exists valid_from       timestamptz;
alter table public.cashback_offers add column if not exists valid_to         timestamptz;
alter table public.cashback_offers add column if not exists conditions       text;

alter table public.point_offers    add column if not exists is_active        boolean not null default true;
alter table public.point_offers    add column if not exists last_verified_at timestamptz default now();
alter table public.point_offers    add column if not exists valid_from       timestamptz;
alter table public.point_offers    add column if not exists valid_to         timestamptz;
alter table public.point_offers    add column if not exists conditions       text;

alter table public.reward_options  add column if not exists is_active        boolean not null default true;
alter table public.reward_options  add column if not exists last_verified_at timestamptz default now();

-- ---------------------------------------------------------------------
-- 6. user_cards: flesh out the empty stub
-- ---------------------------------------------------------------------
alter table public.user_cards add column if not exists user_id        uuid references auth.users(id) on delete cascade;
alter table public.user_cards add column if not exists card_provider  text;          -- slug, e.g. 'amex-gold'
alter table public.user_cards add column if not exists nickname       text;
alter table public.user_cards add column if not exists last_4         text;
alter table public.user_cards add column if not exists is_active      boolean not null default true;
alter table public.user_cards add column if not exists updated_at     timestamptz not null default now();

create index if not exists user_cards_user_idx on public.user_cards (user_id);

-- ---------------------------------------------------------------------
-- 7. user_simulations.user_id: rewire from public.users → auth.users
-- ---------------------------------------------------------------------
alter table public.user_simulations drop constraint if exists user_simulations_user_id_fkey;
alter table public.user_simulations
  add constraint user_simulations_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- ---------------------------------------------------------------------
-- 8. updated_at trigger function + triggers
-- ---------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stores_set_updated_at          on public.stores;
create trigger stores_set_updated_at          before update on public.stores
  for each row execute function public.tg_set_updated_at();

drop trigger if exists platform_set_updated_at        on public.platform;
create trigger platform_set_updated_at        before update on public.platform
  for each row execute function public.tg_set_updated_at();

drop trigger if exists offers_set_updated_at          on public.offers;
create trigger offers_set_updated_at          before update on public.offers
  for each row execute function public.tg_set_updated_at();

drop trigger if exists cashback_offers_set_updated_at on public.cashback_offers;
create trigger cashback_offers_set_updated_at before update on public.cashback_offers
  for each row execute function public.tg_set_updated_at();

drop trigger if exists point_offers_set_updated_at   on public.point_offers;
create trigger point_offers_set_updated_at    before update on public.point_offers
  for each row execute function public.tg_set_updated_at();

drop trigger if exists user_cards_set_updated_at      on public.user_cards;
create trigger user_cards_set_updated_at      before update on public.user_cards
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------------
-- 9. Replace broken read policies on catalog tables.
--    The existing predicates like auth.uid() = table.id are nonsense
--    (user UUID never matches a catalog row's UUID), so reads are blocked.
--    Keep the existing admin-only insert/update/delete policies.
-- ---------------------------------------------------------------------

-- stores already had its read policy dropped at the top of this file.
drop policy if exists "Authenticated users can view offers"             on public.offers;
drop policy if exists "Authenticated users and Admin can view offers"   on public.cashback_offers;
drop policy if exists "Authenticated and Admin can read cashback_rates" on public.cashback_rates;
drop policy if exists "Allow Admin and users to view miles programs"    on public.miles_programs;
drop policy if exists "Authenticated can read platform"                 on public.platform;
drop policy if exists "Authenticated can read reward_options"           on public.reward_options;

-- New public-read policies (anon + authenticated, active rows only)
create policy stores_public_read on public.stores
  for select to anon, authenticated
  using (is_active);

create policy platform_public_read on public.platform
  for select to anon, authenticated
  using (coalesce(is_active, true));

create policy miles_programs_public_read on public.miles_programs
  for select to anon, authenticated
  using (true);

create policy offers_public_read on public.offers
  for select to anon, authenticated
  using (is_active);

create policy cashback_offers_public_read on public.cashback_offers
  for select to anon, authenticated
  using (is_active);

create policy point_offers_public_read on public.point_offers
  for select to anon, authenticated
  using (is_active);

create policy cashback_rates_public_read on public.cashback_rates
  for select to anon, authenticated
  using (coalesce(is_active, true));

create policy reward_options_public_read on public.reward_options
  for select to anon, authenticated
  using (is_active);

create policy promotions_public_read on public.promotions
  for select to anon, authenticated
  using (expires_at is null or expires_at > now());

create policy rate_history_public_read on public.rate_history
  for select to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 10. Add missing user-scoped policies for tables that had none
-- ---------------------------------------------------------------------

-- user_cards: full owner CRUD (now that user_id exists)
create policy user_cards_owner_select on public.user_cards
  for select using (auth.uid() = user_id);
create policy user_cards_owner_insert on public.user_cards
  for insert with check (auth.uid() = user_id);
create policy user_cards_owner_update on public.user_cards
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_cards_owner_delete on public.user_cards
  for delete using (auth.uid() = user_id);

-- user_sessions: full owner CRUD
create policy user_sessions_owner_select on public.user_sessions
  for select using (auth.uid() = user_id);
create policy user_sessions_owner_insert on public.user_sessions
  for insert with check (auth.uid() = user_id);
create policy user_sessions_owner_update on public.user_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_sessions_owner_delete on public.user_sessions
  for delete using (auth.uid() = user_id);

-- user_profiles: existing policies cover SELECT and UPDATE only — add INSERT and DELETE
create policy user_profiles_owner_insert on public.user_profiles
  for insert with check (auth.uid() = user_id);
create policy user_profiles_owner_delete on public.user_profiles
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 11. Indexes for the comparison hot path
-- ---------------------------------------------------------------------
create index if not exists stores_active_featured_idx
  on public.stores (is_featured desc, name) where is_active;

create index if not exists platform_type_active_idx
  on public.platform (type) where coalesce(is_active, true);

create index if not exists offers_store_active_idx
  on public.offers (store_id) where is_active;

create index if not exists cashback_offers_store_active_idx
  on public.cashback_offers (store_id) where is_active;

create index if not exists point_offers_store_active_idx
  on public.point_offers (store_id) where is_active;

create index if not exists promotions_store_idx
  on public.promotions (store_id);
