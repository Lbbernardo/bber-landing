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
