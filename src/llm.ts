import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

type JsonSchemaPayload = {
  name: string;
  schema: Record<string, any>;
  strict?: boolean;
};

export type LLMResponse = {
  text: string;
};

export type LLMClient = {
  generate: (prompt: string, jsonMode?: boolean, jsonSchema?: JsonSchemaPayload) => Promise<LLMResponse>;
};

// Google Gemini Client
export const createGeminiClient = (modelName: string = "gemini-2.0-flash"): LLMClient => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  return {
    generate: async (prompt: string, jsonMode: boolean = false) => {
      const response = await client.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: jsonMode ? { responseMimeType: "application/json" } : undefined,
      });
      return { text: response.text ?? "" };
    },
  };
};

// OpenAI Client
export const createOpenAIClient = (modelName: string = "google/gemma-3n-e4b"): LLMClient => {
  console.log(process.env.OPENAI_BASE_URL);
  const openai = new OpenAI({ baseURL: process.env.OPENAI_BASE_URL, apiKey: "not-needed" });
  return {
    generate: async (prompt: string, jsonMode: boolean = false, jsonSchema?: JsonSchemaPayload) => {
      const getResponseFormat = (): OpenAI.Chat.Completions.ChatCompletionCreateParams['response_format'] => {
        if (jsonSchema) {
          return { type: "json_schema", json_schema: jsonSchema };
        }
        if (jsonMode) {
          return { type: "json_object" };
        }
        return { type: "text" };
      };
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        response_format: getResponseFormat(),
      });
      return { text: response.choices[0]?.message?.content || "" };
    },
  };
};


type LLMClientType = "gemini" | "openai";
export const getLLMClient = (clientType: LLMClientType = "gemini"): LLMClient => {
  if (clientType === "gemini") {
    return createGeminiClient();
  } else if (clientType === "openai") {
    return createOpenAIClient();
  } else {
    throw new Error(`Invalid client type: ${clientType}`);
  }
};
