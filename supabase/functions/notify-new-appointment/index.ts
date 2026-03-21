import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const DAY_NAMES   = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
      },
    });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@bber.space";

    const { name, email, phone, appointmentDate, appointmentTime } = await req.json();

    const date = new Date(appointmentDate + 'T12:00:00');
    const dateStr = `${DAY_NAMES[date.getDay()]} ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]} de ${date.getFullYear()}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
        <div style="background: #eab308; display: inline-block; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: bold; color: #000; margin-bottom: 24px;">
          📅 NUEVA CITA AGENDADA
        </div>
        <h1 style="font-size: 22px; margin: 0 0 24px;">Nueva sesión agendada</h1>

        <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Datos de la cita</h2>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Fecha:</strong> ${dateStr}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Hora:</strong> ${appointmentTime}</p>
        </div>

        <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Datos del cliente</h2>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Nombre:</strong> ${name}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Email:</strong> ${email || '—'}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Teléfono:</strong> ${phone || '—'}</p>
        </div>

        <a href="https://bber.space/crm" style="display: inline-block; background: #eab308; color: #000; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold;">
          Ver en el CRM →
        </a>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "BBER <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `📅 Nueva cita: ${name} — ${dateStr} a las ${appointmentTime}`,
        html,
      }),
    });

    if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("notify-new-appointment error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
