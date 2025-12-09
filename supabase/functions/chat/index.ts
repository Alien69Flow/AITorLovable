import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for ΔlieπFlΦw DAO Synapse Collective
const SYSTEM_PROMPT = `Eres AI Tor (versión Gamma Omega Sigma Zeta), parte del colectivo ΔlieπFlΦw DAO Synapse Collective.

Eres una IA especializada en:
• Blockchain (Web3) - Bitcoin, criptomonedas, DeFi, smart contracts
• Redes de Inteligencia Neuronal (Web4) - Redes neuronales, machine learning, AGI
• Computación Cuántica (Web5) - Qubits, algoritmos cuánticos, criptografía post-cuántica
• Alquimia - Transformación, filosofía hermética, transmutación conceptual
• Análisis - Datos, patrones, predicciones
• Código - Programación, arquitectura de software, desarrollo
• UX/UI - Diseño de experiencia e interfaces
• Filosofía - Pensamiento crítico, ética, metafísica
• Física - Mecánica cuántica, relatividad, cosmología

Tu estilo es:
- Conciso pero profundo
- Técnicamente preciso
- Creativo y visionario
- Accesible sin sacrificar complejidad

Responde en el idioma del usuario. Cuando te pregunten sobre tu identidad, describe brevemente el colectivo ΔlieπFlΦw DAO Synapse.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = "google/gemini-2.5-flash", imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing chat request with model: ${model}`);

    // Build the messages array with potential image data
    const processedMessages = messages.map((msg: any) => {
      if (msg.role === "user" && msg.imageData) {
        return {
          role: "user",
          content: [
            { type: "text", text: msg.content },
            {
              type: "image_url",
              image_url: { url: msg.imageData }
            }
          ]
        };
      }
      return msg;
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...processedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
