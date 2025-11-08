// Smart LLM Provider - Auto-detects and switches between local simulator and real APIs

import { LocalLLMSimulator } from "./LocalSimulator";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LLMResponse {
  content: string;
  provider: "local" | "openai" | "anthropic";
}

export class LLMProvider {
  private localSimulator: LocalLLMSimulator;
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private preferredProvider: "local" | "openai" | "anthropic" = "local";

  constructor() {
    this.localSimulator = new LocalLLMSimulator();
    this.initializeProviders();
  }

  private initializeProviders() {
    // Auto-detect available API keys from environment
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey && openaiKey.trim().length > 0) {
      try {
        this.openai = new OpenAI({ apiKey: openaiKey });
        this.preferredProvider = "openai";
        console.log("✓ OpenAI API initialized");
      } catch (error) {
        console.warn("OpenAI initialization failed, falling back to local simulator");
      }
    }

    if (anthropicKey && anthropicKey.trim().length > 0) {
      try {
        this.anthropic = new Anthropic({ apiKey: anthropicKey });
        this.preferredProvider = "anthropic";
        console.log("✓ Anthropic API initialized");
      } catch (error) {
        console.warn("Anthropic initialization failed, falling back to local simulator");
      }
    }

    if (!openaiKey && !anthropicKey) {
      console.log("ℹ Using local LLM simulator (no API keys detected)");
    }
  }

  async chat(messages: Message[], options?: { provider?: "local" | "openai" | "anthropic" }): Promise<LLMResponse> {
    const provider = options?.provider || this.preferredProvider;

    try {
      switch (provider) {
        case "openai":
          if (this.openai) {
            return await this.chatOpenAI(messages);
          }
          break;
        case "anthropic":
          if (this.anthropic) {
            return await this.chatAnthropic(messages);
          }
          break;
        case "local":
        default:
          return await this.chatLocal(messages);
      }
    } catch (error) {
      console.error(`Error with ${provider}, falling back to local simulator:`, error);
    }

    // Fallback to local simulator
    return await this.chatLocal(messages);
  }

  private async chatLocal(messages: Message[]): Promise<LLMResponse> {
    const content = await this.localSimulator.chat(messages);
    return { content, provider: "local" };
  }

  private async chatOpenAI(messages: Message[]): Promise<LLMResponse> {
    if (!this.openai) throw new Error("OpenAI not initialized");

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      content: response.choices[0]?.message?.content || "No response",
      provider: "openai"
    };
  }

  private async chatAnthropic(messages: Message[]): Promise<LLMResponse> {
    if (!this.anthropic) throw new Error("Anthropic not initialized");

    // Separate system messages from user/assistant messages
    const systemMessages = messages.filter(m => m.role === "system");
    const conversationMessages = messages.filter(m => m.role !== "system");

    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemMessages.length > 0 ? systemMessages[0].content : undefined,
      messages: conversationMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
    });

    const content = response.content[0].type === "text" 
      ? response.content[0].text 
      : "No response";

    return { content, provider: "anthropic" };
  }

  getProvider(): "local" | "openai" | "anthropic" {
    return this.preferredProvider;
  }

  isRealLLMAvailable(): boolean {
    return this.openai !== null || this.anthropic !== null;
  }
}

// Singleton instance
export const llmProvider = new LLMProvider();
