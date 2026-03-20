import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SCENARIO_LABELS: Record<string, string> = {
  low: "conservador", medium: "moderado", high: "optimista",
};

const DISCIPLINE_LABELS: Record<string, string> = {
  low: "conservadora", medium: "moderada", high: "alta",
};

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function buildFallback(name: string, age: number, years: number, capital: number, income: number,
  savings: number, desiredIncome: number, scenario: string, toolName: string) {

  const gap = desiredIncome - income;
  const ratio = desiredIncome / (income || 1);
  const savingsNeeded = Math.round(savings * ratio);
  const isUnrealistic = ratio > 10;

  let p1: string, p2: string, p3: string;
  const steps: string[] = [];

  if (isUnrealistic) {
    p1 = `${name}, con un ahorro de ${fmt(savings)} al mes durante ${years} años, tu proyección ${SCENARIO_LABELS[scenario] || scenario} es de ${fmt(capital)} en capital y ${fmt(income)} de ingreso mensual en el retiro. Eso significa que hay una brecha importante de ${fmt(gap)} al mes respecto a tu meta de ${fmt(desiredIncome)}.`;
    p2 = `Para alcanzar esa meta, necesitarías ahorrar aproximadamente ${fmt(savingsNeeded)} al mes — un ajuste significativo. Esto no significa que tu meta sea imposible, pero sí que necesitas una estrategia clara: aumentar ingresos, reducir gastos, o combinar ambas cosas con las herramientas financieras correctas.`;
    p3 = `Antes de definir un plan, lo más valioso que puedes hacer es hablar con un asesor de World Financial Group. Con ${years} años por delante, hay tiempo real para construir algo sólido — pero el plan debe ser personalizado a tu situación. Agenda tu sesión gratuita hoy y da el primer paso concreto.`;
    steps.push(
      `Revisa tu presupuesto mensual: identifica cuánto podrías aumentar tu ahorro hoy, aunque sea de ${fmt(savings)} a ${fmt(savings * 2)}.`,
      `Habla con un asesor para diseñar un plan realista que combine ahorro, inversión y protección.`,
      `Evalúa instrumentos como ${toolName || "una IUL"} que ofrecen crecimiento indexado al mercado con ventajas fiscales.`
    );
  } else if (gap > 0) {
    const increase = savingsNeeded - savings;
    p1 = `${name}, con ${fmt(savings)} al mes durante ${years} años, tu proyección ${SCENARIO_LABELS[scenario] || scenario} te da un capital de ${fmt(capital)} y un ingreso de ${fmt(income)} al mes en el retiro.`;
    p2 = `Para cerrar la brecha de ${fmt(gap)} y llegar a tu meta de ${fmt(desiredIncome)}, necesitarías aumentar tu aporte a ${fmt(savingsNeeded)} — es decir, ${fmt(increase)} más al mes. Con ${years} años de plazo, incluso incrementos graduales hacen una diferencia enorme gracias al interés compuesto.`;
    p3 = `Un asesor de World Financial Group puede ayudarte a elegir el instrumento correcto — como ${toolName || "una IUL"} — que combine crecimiento, protección y ventajas fiscales. Agenda tu sesión gratuita y convierte esta proyección en un plan real.`;
    steps.push(
      `Aumenta tu aporte de ${fmt(savings)} a ${fmt(Math.round(savings + increase / 3))} en los próximos 3 meses como primer paso.`,
      `Automatiza el ahorro el mismo día que recibes tu sueldo, antes de cualquier gasto.`,
      `Agenda una sesión para abrir una cuenta con ${toolName || "una IUL"} y proteger tu capital con beneficios fiscales.`
    );
  } else {
    p1 = `${name}, tu plan actual es sólido: con ${fmt(savings)} al mes durante ${years} años, proyectas un capital de ${fmt(capital)} y un ingreso de ${fmt(income)} al mes — superando tu meta de ${fmt(desiredIncome)} en ${fmt(-gap)}.`;
    p2 = `Ese margen extra es tu colchón de seguridad para imprevistos o para retirarte antes de lo planeado. La clave ahora es mantener la constancia y proteger ese capital con el instrumento correcto.`;
    p3 = `Un asesor puede ayudarte a estructurar ese ahorro en ${toolName || "una IUL"} para que crezca con ventajas fiscales y protección. Agenda tu sesión gratuita y asegura que tu plan resista cualquier imprevisto.`;
    steps.push(
      `Mantén tu aporte de ${fmt(savings)} al mes sin interrupciones — la constancia es lo más valioso que tienes.`,
      `Evalúa con un asesor si parte del capital puede ir a un instrumento con protección como ${toolName || "una IUL"}.`,
      `Revisa tu meta cada año: si tus ingresos crecen, aumenta el aporte y acelera tu libertad financiera.`
    );
  }

  return { narrative: `${p1}\n\n${p2}\n\n${p3}`, steps };
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

  // Leer body una sola vez antes de cualquier try/catch
  const body = await req.json();
  const { name, age, retirementAge, desiredIncome, savings, discipline, years, capital, income, scenario, toolName } = body;

  try {

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY not set");

    const gap = desiredIncome - income;
    const ratio = desiredIncome / (income || 1);
    const isUnrealistic = ratio > 10;

    const situationNote = isUnrealistic
      ? `ALERTA: La meta de ${fmt(desiredIncome)}/mes es muy ambiciosa vs el ingreso proyectado de ${fmt(income)}/mes (brecha de ${fmt(gap)}). Sé honesto — no digas que es "completamente alcanzable". Di que con ${fmt(savings)}/mes no es suficiente y que necesita una estrategia diferente. Recomienda agendar una cita.`
      : gap > 0
      ? `Hay una brecha de ${fmt(gap)}/mes. Sugiere concretamente aumentar el aporte a ${fmt(Math.round(savings * ratio))}/mes para cerrarla.`
      : `El plan supera la meta en ${fmt(-gap)}/mes. Refuerza mantener la estrategia y proteger el capital.`;

    const prompt = `Eres un asesor financiero de World Financial Group — honesto, directo y empático. Hablas español neutro (no mexicanismos). Tu trabajo es dar un análisis REAL, no frases motivacionales genéricas.

DATOS DEL CLIENTE:
- Nombre: ${name}
- Edad: ${age} años → retiro a los ${retirementAge} años (${years} años de plazo)
- Ahorro mensual actual: ${fmt(savings)}
- Capital proyectado: ${fmt(capital)} (escenario ${SCENARIO_LABELS[scenario] || scenario})
- Ingreso mensual estimado en retiro: ${fmt(income)} (tasa 4%)
- Meta de ingreso mensual: ${fmt(desiredIncome)}
- Brecha: ${fmt(gap)} al mes
- Compromiso: ${DISCIPLINE_LABELS[discipline] || discipline}
- Herramienta recomendada: ${toolName || "IUL (Vida Universal Indexada)"}

ANÁLISIS DE SITUACIÓN:
${situationNote}

INSTRUCCIONES:
- Escribe exactamente 3 párrafos, máximo 220 palabras en total
- Párrafo 1: Resume la situación con los números reales — sin suavizar
- Párrafo 2: Da una recomendación concreta y específica para este cliente
- Párrafo 3: Menciona ${toolName || "la IUL"} y termina recomendando agendar la sesión gratuita
- USA solo los números dados, NUNCA inventes cifras
- Tono: asesor profesional que respeta al cliente siendo honesto
- Si la meta es poco realista con el ahorro actual, dilo claramente y redirige

Responde SOLO con este JSON sin markdown:
{"narrative": "3 párrafos aquí", "steps": ["paso específico 1", "paso específico 2", "paso específico 3"]}

Los pasos deben ser acciones CONCRETAS para este cliente específico.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) throw new Error("Empty Anthropic response");

    const parsed = JSON.parse(content);
    const fallback = buildFallback(name, age, years, capital, income, savings, desiredIncome, scenario, toolName);

    return new Response(JSON.stringify({
      narrative: parsed.narrative || fallback.narrative,
      steps:     parsed.steps     || fallback.steps,
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    const fallback = buildFallback(name, age, years, capital, income, savings, desiredIncome, scenario, toolName);
    return new Response(JSON.stringify({ ...fallback, fallback: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
