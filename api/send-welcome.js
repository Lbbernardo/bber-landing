export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email } = req.body
  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <div style="background:#7C3AED;width:48px;height:48px;border-radius:12px;display:inline-block;line-height:48px;text-align:center;margin-bottom:10px;">
        <span style="color:#fff;font-weight:900;font-size:22px;">B</span>
      </div>
      <div style="color:#ffffff;font-weight:900;font-size:24px;letter-spacing:-0.5px;">BBER</div>
      <div style="color:#B3B3B3;font-size:13px;margin-top:4px;">Educación financiera para latinos en EE.UU.</div>
    </div>

    <div style="background:#0F0F0F;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
      <div style="height:4px;background:linear-gradient(90deg,#7C3AED 0%,#A78BFA 50%,#FACC15 100%);"></div>
      <div style="padding:36px 32px;">

        <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 10px 0;line-height:1.2;">
          ¡Bienvenido/a, ${name}! 🎉
        </h1>
        <p style="color:#B3B3B3;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
          Ya eres parte de la comunidad <strong style="color:#ffffff;">BBER</strong>.
          Tu acceso gratuito está confirmado.
        </p>

        <div style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.25);border-radius:14px;padding:20px;margin-bottom:14px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="44" style="vertical-align:top;padding-right:14px;font-size:28px;line-height:1;">📗</td>
            <td>
              <div style="color:#A78BFA;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Descarga gratuita</div>
              <div style="color:#ffffff;font-weight:800;font-size:15px;margin-bottom:6px;">"La Guía Financiera del Latino en EE.UU."</div>
              <div style="margin-top:10px;">
                <a href="https://bber.space/ebook.html" style="display:inline-block;background:#7C3AED;color:#fff;font-weight:700;font-size:13px;padding:10px 20px;border-radius:8px;text-decoration:none;">
                  Descargar Ebook →
                </a>
              </div>
            </td>
          </tr></table>
        </div>

        <div style="background:rgba(250,204,21,0.06);border:1px solid rgba(250,204,21,0.2);border-radius:14px;padding:20px;margin-bottom:28px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="44" style="vertical-align:top;padding-right:14px;font-size:28px;line-height:1;">🎥</td>
            <td>
              <div style="color:#FACC15;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Próxima clase en vivo</div>
              <div style="color:#ffffff;font-weight:800;font-size:15px;margin-bottom:6px;">"Masterclass: Finanzas Personales para Latinos"</div>
              <div style="color:#B3B3B3;font-size:13px;line-height:1.6;">Te enviaremos los detalles de la próxima clase en un correo aparte.</div>
            </td>
          </tr></table>
        </div>

        <div style="text-align:center;margin-bottom:20px;">
          <a href="https://wa.me/16304154252?text=Hola%2C%20acabo%20de%20registrarme%20en%20BBER"
             style="display:inline-block;background:#FACC15;color:#000000;font-weight:900;font-size:15px;padding:15px 36px;border-radius:12px;text-decoration:none;">
            Escríbenos por WhatsApp →
          </a>
        </div>

        <p style="color:#555555;font-size:12px;text-align:center;margin:0;">
          ¿Tienes dudas? <a href="https://wa.me/16304154252" style="color:#A78BFA;text-decoration:none;">+1 (630) 415-4252</a>
        </p>
      </div>
    </div>

    <div style="text-align:center;margin-top:28px;">
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;line-height:1.9;">
        © ${new Date().getFullYear()} BBER · bber.space<br/>
        Recibiste este correo porque te registraste en nuestro sitio web.
      </p>
    </div>
  </div>
</body>
</html>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BBER <info@bber.space>',
        to: email,
        subject: `Hola ${name}, tu cuenta en BBER está lista`,
        html,
        text: `Hola ${name},\n\nBienvenido/a a BBER. Tu acceso está confirmado.\n\nDescarga tu ebook gratuito aquí: https://bber.space/ebook.html\n\n¿Tienes dudas? Escríbenos por WhatsApp: https://wa.me/16304154252\n\n© ${new Date().getFullYear()} BBER · bber.space\nRecibiste este correo porque te registraste en nuestro sitio web.`,
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@bber.space>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend error:', JSON.stringify(data))
      return res.status(500).json({ error: data })
    }

    return res.status(200).json({ success: true, id: data.id })
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
