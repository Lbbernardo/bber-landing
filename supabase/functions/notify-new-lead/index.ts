import "jsr:@supabase/functions-js/edge-runtime.d.ts";

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

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

    const { name, email, phone, age, retirementAge, savings, desiredIncome, capital, income, scenario } = await req.json();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
        <div style="background: #7c3aed; display: inline-block; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: bold; margin-bottom: 24px;">
          🔔 NUEVO LEAD — CALCULADORA
        </div>
        <h1 style="font-size: 22px; margin: 0 0 24px;">Nuevo cliente interesado</h1>

        <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #a78bfa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Datos de contacto</h2>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Nombre:</strong> ${name}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Email:</strong> ${email || '—'}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Teléfono:</strong> ${phone || '—'}</p>
        </div>

        <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #a78bfa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Proyección financiera</h2>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Edad actual:</strong> ${age} años → retiro a los ${retirementAge}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Ahorro mensual:</strong> ${fmt(savings)}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Meta de retiro:</strong> ${fmt(desiredIncome)}/mes</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Capital proyectado:</strong> ${fmt(capital)}</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Ingreso estimado:</strong> ${fmt(income)}/mes</p>
          <p style="margin: 4px 0; color: #ccc;"><strong style="color: #fff;">Escenario:</strong> ${scenario}</p>
        </div>

        <a href="https://bber.space/crm" style="display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold;">
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
        subject: `🔔 Nuevo lead: ${name} — Calculadora Financiera`,
        html,
      }),
    });

    if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("notify-new-lead error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
