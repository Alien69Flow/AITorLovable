// DeepSeek API integration for AI chat
import { useState, useCallback } from "react";
import { AI_MODELS, type AIModel } from "@/lib/ai-models";

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepSeekResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
}

export function useDeepSeek() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDeepSeekModels = useCallback((): AIModel[] => {
    return AI_MODELS.filter(m => m.provider === "DeepSeek" && m.available);
  }, []);

  const sendMessage = useCallback(async (
    messages: DeepSeekMessage[],
    modelId: string = "deepseek-chat",
    apiKey?: string
  ): Promise<string> => {
    const model = AI_MODELS.find(m => m.id === modelId);
    
    if (!model) {
      throw new Error("DeepSeek model not found");
    }

    if (!apiKey) {
      // Use environment variable or throw error
      apiKey = import.meta.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error("DeepSeek API key not configured. Add DEEPSEEK_API_KEY to Supabase Secrets.");
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(model.apiBase + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.modelId,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          stream: false,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `DeepSeek API error: ${response.status}`);
      }

      const data: DeepSeekResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from DeepSeek");
      }

      return data.choices[0].message.content;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get DeepSeek response";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const streamMessage = useCallback(async function* (
    messages: DeepSeekMessage[],
    modelId: string = "deepseek-chat",
    apiKey?: string
  ): AsyncGenerator<string> {
    const model = AI_MODELS.find(m => m.id === modelId);
    
    if (!model) {
      throw new Error("DeepSeek model not found");
    }

    if (!apiKey) {
      apiKey = import.meta.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error("DeepSeek API key not configured");
      }
    }

    const response = await fetch(model.apiBase + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `DeepSeek API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if ( {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }, []);

  return {
    isLoading,
    error,
    models: getDeepSeekModels(),
    sendMessage,
    streamMessage,
  };
}
