-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.registros_fotos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  guest_name text,
  file_url text NOT NULL,
  status text DEFAULT 'pendiente'::text,
  is_favorite boolean DEFAULT false,
  device_info text,
  browser_info text,
  file_size_kb integer,
  user_agent_raw text,
  CONSTRAINT registros_fotos_pkey PRIMARY KEY (id)
);