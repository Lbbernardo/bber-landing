export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

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
        template_id: 'b1f2cb5c-4cb1-4806-a478-41a9b7234c59',
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
