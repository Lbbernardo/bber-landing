-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor
-- Tabla: retirement_leads (leads de la Calculadora Financiera)

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

  -- Estado CRM
  status                     text DEFAULT 'nuevo' NOT NULL,

  -- JSON completo del resultado de la IA
  ai_result                  jsonb
);

-- Seguridad
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
