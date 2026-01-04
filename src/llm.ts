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
  generate: (prompt: string, jsonSchema: JsonSchemaPayload) => Promise<LLMResponse>;
};

// OpenAI Client
export const createOpenAIClient = (modelName: string = "google/gemma-3n-e4b"): LLMClient => {
  console.log(process.env.OPENAI_BASE_URL);
  const openai = new OpenAI({ baseURL: process.env.OPENAI_BASE_URL, apiKey: "not-needed" });
  return {
    generate: async (prompt: string, jsonSchema: JsonSchemaPayload) => {
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_schema", json_schema: jsonSchema },
      });
      return { text: response.choices[0]?.message?.content || "" };
    },
  };
};


type LLMClientType = "openai";
export const getLLMClient = (clientType: LLMClientType = "openai"): LLMClient => {
  if (clientType === "openai") {
    return createOpenAIClient();
  } else {
    throw new Error(`Invalid client type: ${clientType}`);
  }
};
