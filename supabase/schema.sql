-- ============================================================
-- TrafficSaarthi — Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- Enable UUID extension (already enabled by default in Supabase)
create extension if not exists "uuid-ossp";

-- ── INCIDENTS ────────────────────────────────────────────────
create table if not exists public.incidents (
  id                   text primary key,
  cause                text not null,
  corridor             text not null,
  junction             text not null default '',
  address              text default '',
  lat                  float8 default 12.9716,
  lng                  float8 default 77.5946,
  priority             text not null default 'Medium',
  status               text not null default 'active',
  requires_road_closure boolean default false,
  vehicle_type         text default '',
  vehicle_number       text default '',
  breakdown_reason     text default '',
  description          text default '',
  direction            text default '',
  time_of_incident     timestamptz,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now(),
  resolved_at          timestamptz,
  resolution_time_min  int,
  impact_score         int default 50,
  impact_level         text default 'Medium',
  officer_notes        jsonb default '[]'::jsonb
);

-- Allow public read and insert (no auth needed for MVP)
alter table public.incidents enable row level security;

create policy "public read incidents"
  on public.incidents for select using (true);

create policy "public insert incidents"
  on public.incidents for insert with check (true);

create policy "public update incidents"
  on public.incidents for update using (true);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger incidents_updated_at
  before update on public.incidents
  for each row execute procedure public.handle_updated_at();

-- ── EVENTS ───────────────────────────────────────────────────
create table if not exists public.events (
  id                   text primary key,
  name                 text not null,
  type                 text not null default 'other',
  venue                text default '',
  lat                  float8 default 12.9716,
  lng                  float8 default 77.5946,
  date                 text not null,          -- stored as YYYY-MM-DD string
  start_time           text not null default '09:00',
  end_time             text not null default '18:00',
  crowd_size           text default 'Medium',
  affected_corridors   text[] default '{}',
  status               text default 'planned',
  impact_level         text default 'Medium',
  predicted_score      int default 50,
  officers_deployed    int default 0,
  planned_officers     int default 0,
  predicted_delay_str  text default '',
  predicted_barricades int default 0,
  congestion_window    jsonb,
  actual_officers      int,
  actual_incidents     int,
  actual_delay_mins    int,
  created_at           timestamptz default now()
);

alter table public.events enable row level security;

create policy "public read events"
  on public.events for select using (true);

create policy "public insert events"
  on public.events for insert with check (true);

create policy "public update events"
  on public.events for update using (true);

-- ── INDEXES (for performance) ─────────────────────────────────
create index if not exists incidents_status_idx on public.incidents(status);
create index if not exists incidents_corridor_idx on public.incidents(corridor);
create index if not exists incidents_created_at_idx on public.incidents(created_at desc);
create index if not exists events_date_idx on public.events(date);
create index if not exists events_status_idx on public.events(status);
