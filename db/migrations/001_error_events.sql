-- Jalankan sekali di Neon SQL Editor.
-- Tabel ini HANYA berisi data teknis error; jangan pernah menyimpan input pengguna di sini.
create table if not exists error_events (
  id          bigserial primary key,
  fingerprint text        not null,
  message     text        not null,
  stack       text,
  path        text,
  release     text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists error_events_created_at_idx on error_events (created_at desc);
create index if not exists error_events_fingerprint_idx on error_events (fingerprint);
