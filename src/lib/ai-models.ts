export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  supportsVision: boolean;
  available: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Rápido y equilibrado, excelente para multimodal",
    supportsVision: true,
    available: true,
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Top-tier, razonamiento complejo y contexto largo",
    supportsVision: true,
    available: true,
  },
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    description: "Máxima precisión, multimodal avanzado",
    supportsVision: true,
    available: true,
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    description: "Balance entre velocidad y rendimiento",
    supportsVision: true,
    available: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    description: "Especializado en código y razonamiento",
    supportsVision: false,
    available: false, // Requires API key
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    description: "Acceso a información en tiempo real",
    supportsVision: false,
    available: false, // Requires API key
  },
];

export const getAvailableModels = () => AI_MODELS.filter(m => m.available);
