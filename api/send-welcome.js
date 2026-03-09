export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  const year = new Date().getFullYear()

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#000000;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="background:#7C3AED;width:44px;height:44px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px;">
        <span style="color:#fff;font-weight:900;font-size:20px;line-height:1;">B</span>
      </div>
      <div style="color:#fff;font-weight:900;font-size:24px;letter-spacing:-0.5px;">BBER</div>
    </div>

    <!-- Card -->
    <div style="background:#0F0F0F;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
      <!-- Barra superior -->
      <div style="height:4px;background:linear-gradient(90deg,#7C3AED 0%,#A78BFA 50%,#FACC15 100%);"></div>

      <div style="padding:36px 32px;">

        <!-- Encabezado -->
        <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 8px 0;line-height:1.2;">
          ¡Bienvenido/a, ${name}! 🎉
        </h1>
        <p style="color:#B3B3B3;font-size:15px;margin:0 0 28px 0;line-height:1.6;">
          Ya eres parte de la comunidad BBER. Tu acceso gratuito está confirmado.
        </p>

        <!-- Ebook -->
        <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.25);border-radius:14px;padding:20px;margin-bottom:14px;">
          <div style="display:flex;gap:14px;">
            <div style="font-size:28px;line-height:1;flex-shrink:0;">📗</div>
            <div>
              <div style="color:#A78BFA;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Descarga gratuita</div>
              <div style="color:#ffffff;font-weight:800;font-size:15px;margin-bottom:5px;">"La Guía Financiera del Latino en EE.UU."</div>
              <div style="color:#B3B3B3;font-size:13px;line-height:1.5;">Más de 60 páginas de contenido práctico para tomar el control total de tu dinero desde hoy.</div>
            </div>
          </div>
        </div>

        <!-- Clase en vivo -->
        <div style="background:rgba(250,204,21,0.06);border:1px solid rgba(250,204,21,0.2);border-radius:14px;padding:20px;margin-bottom:28px;">
          <div style="display:flex;gap:14px;">
            <div style="font-size:28px;line-height:1;flex-shrink:0;">🎥</div>
            <div>
              <div style="color:#FACC15;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Próxima clase en vivo</div>
              <div style="color:#ffffff;font-weight:800;font-size:15px;margin-bottom:5px;">"Masterclass: Finanzas Personales para Latinos"</div>
              <div style="color:#B3B3B3;font-size:13px;line-height:1.5;">Recibirás un correo aparte con la fecha, hora y el link de acceso a la sesión en vivo.</div>
            </div>
          </div>
        </div>

        <!-- Lo que aprenderás -->
        <div style="margin-bottom:28px;">
          <div style="color:#ffffff;font-weight:700;font-size:14px;margin-bottom:12px;">Con BBER aprenderás a:</div>
          ${[
            'Crear un presupuesto que realmente funciona',
            'Eliminar deudas con métodos probados',
            'Invertir por primera vez en EE.UU.',
            'Construir tu crédito desde cero',
            'Planificar tu retiro con 401(k) e IRA',
          ].map(item => `
          <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">
            <div style="color:#FACC15;font-size:14px;flex-shrink:0;margin-top:1px;">✓</div>
            <div style="color:#B3B3B3;font-size:13px;line-height:1.5;">${item}</div>
          </div>`).join('')}
        </div>

        <!-- CTA WhatsApp -->
        <div style="text-align:center;margin-bottom:20px;">
          <a href="https://wa.me/16304154252?text=Hola%2C%20acabo%20de%20registrarme%20en%20BBER%20%F0%9F%91%8B"
             style="display:inline-block;background:#FACC15;color:#000000;font-weight:900;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:-0.3px;">
            Escríbenos por WhatsApp →
          </a>
        </div>

        <p style="color:#666666;font-size:12px;text-align:center;margin:0;">
          ¿Tienes preguntas? Contáctanos al
          <a href="https://wa.me/16304154252" style="color:#A78BFA;text-decoration:none;">+1 (630) 415-4252</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;line-height:1.8;">
        © ${year} BBER · Educación financiera para latinos en EE.UU.<br>
        Recibiste este correo porque te registraste en nuestro sitio web.
      </p>
    </div>

  </div>
</body>
</html>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'BBER <onboarding@resend.dev>',
        to: email,
        subject: `¡Bienvenido/a a BBER, ${name}! Tu acceso gratuito está listo 🎉`,
        html,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Resend error:', err)
      return res.status(500).json({ error: 'Error al enviar email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ error: 'Error interno' })
  }
}
