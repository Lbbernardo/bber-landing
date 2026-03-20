-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor

-- 1. Tabla de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text NOT NULL,
  status     text DEFAULT 'nuevo' NOT NULL
);

-- 2. Activar Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Visitantes del landing pueden insertar (formulario)
CREATE POLICY "Permitir inserción pública" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);

-- 4. Solo admins autenticados pueden leer / editar / borrar
CREATE POLICY "Admins pueden leer" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins pueden actualizar" ON public.leads
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins pueden borrar" ON public.leads
  FOR DELETE TO authenticated USING (true);

-- ─────────────────────────────────────────
-- 5. Tabla de leads de Calculadora Financiera
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.retirement_leads (
  id                         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at                 timestamptz DEFAULT now() NOT NULL,

  -- Contacto
  name                       text NOT NULL,
  email                      text,
  phone                      text,

  -- Inputs del formulario
  age                        integer NOT NULL,
  retirement_age             integer NOT NULL,
  monthly_desired_income     numeric(12,2) NOT NULL,
  monthly_savings            numeric(12,2) NOT NULL,
  discipline                 text NOT NULL CHECK (discipline IN ('low', 'medium', 'high')),

  -- Resultados numéricos
  years_to_retirement        integer NOT NULL,
  projected_capital          numeric(15,2) NOT NULL,
  monthly_retirement_income  numeric(12,2) NOT NULL,
  annual_rate                numeric(5,4) NOT NULL,
  scenario                   text NOT NULL,

  -- Estado CRM (mismo sistema que leads)
  status                     text DEFAULT 'nuevo' NOT NULL,

  -- JSON completo del resultado
  ai_result                  jsonb
);

ALTER TABLE public.retirement_leads ENABLE ROW LEVEL SECURITY;

-- Visitantes de la calculadora pueden insertar
CREATE POLICY "Calculadora inserción pública" ON public.retirement_leads
  FOR INSERT TO anon WITH CHECK (true);

-- Solo admins autenticados pueden leer / editar / borrar
CREATE POLICY "Admins leen retirement_leads" ON public.retirement_leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins actualizan retirement_leads" ON public.retirement_leads
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins borran retirement_leads" ON public.retirement_leads
  FOR DELETE TO authenticated USING (true);

-- ─────────────────────────────────────────
-- 6. Tabla de citas agendadas
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       timestamptz DEFAULT now() NOT NULL,

  -- Contacto
  name             text NOT NULL,
  email            text,
  phone            text,

  -- Cita
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,

  -- Estado
  status           text DEFAULT 'pendiente' NOT NULL
    CHECK (status IN ('pendiente', 'confirmada', 'cancelada', 'completada'))
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Visitantes pueden insertar su cita
CREATE POLICY "Citas inserción pública" ON public.appointments
  FOR INSERT TO anon WITH CHECK (true);

-- Solo admins pueden leer / editar / borrar
CREATE POLICY "Admins leen appointments" ON public.appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins actualizan appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins borran appointments" ON public.appointments
  FOR DELETE TO authenticated USING (true);
