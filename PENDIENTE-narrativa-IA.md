# Pendiente: Calculadora Financiera — Tareas

---

## ✅ Completado

- [x] Edge Function actualizada para usar Claude (Anthropic) en lugar de OpenAI
- [x] Fallback mejorado con datos reales del cliente (análisis personalizado sin IA)
- [x] Prompt mejorado: respuestas como asesor financiero real (honesto con metas poco realistas)
- [x] API key de Anthropic configurada en Supabase
- [x] `npx supabase link` ejecutado
- [x] `npx supabase secrets set ANTHROPIC_API_KEY=...` ejecutado
- [x] `npx supabase functions deploy retirement-narrative --no-verify-jwt` ejecutado
- [x] Tabla `retirement_leads` creada en Supabase
- [x] Tabla `appointments` creada en Supabase
- [x] Herramienta recomendada movida al primer lugar en la pantalla de resultados

---

## 🔲 Pendiente — Emails

### Tarea 1 — Email con la proyección al cliente
Cuando el usuario termina la calculadora y ve sus resultados, enviarle un correo con su resumen financiero.

**Qué debe incluir el email:**
- Nombre del cliente
- Capital proyectado, ingreso mensual estimado, años al retiro
- La narrativa personalizada (los 3 párrafos del asesor)
- Los próximos pasos
- La herramienta recomendada
- Botón para agendar cita

**Cómo implementar:**
1. Crear Edge Function `send-projection-email` en `supabase/functions/send-projection-email/index.ts`
2. Llamarla desde `CalculadoraFinanciera.jsx` después de generar el resultado (solo si el cliente puso email)
3. Usar Resend (ya está configurado en el proyecto) para enviar el correo

---

### Tarea 2 — Email de confirmación de cita
Cuando el cliente agenda una cita desde la calculadora, enviarle un correo de confirmación.

**Qué debe incluir el email:**
- Nombre del cliente
- Fecha y hora de la cita
- Mensaje de confirmación y qué esperar en la sesión
- Datos de contacto de World Financial Group

**Cómo implementar:**
1. Crear Edge Function `send-appointment-email` en `supabase/functions/send-appointment-email/index.ts`
2. Llamarla desde `AppointmentScheduler` en `CalculadoraFinanciera.jsx` después de confirmar la cita
3. Usar Resend para enviar el correo

---

## Archivos relevantes

- Edge Function narrativa: `supabase/functions/retirement-narrative/index.ts`
- Calculadora: `src/pages/CalculadoraFinanciera.jsx`
- Referencia emails existentes: `supabase/functions/send-welcome-email/` (ya usa Resend)
