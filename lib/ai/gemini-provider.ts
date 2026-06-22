import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AiProvider, AiGenerationInput, AiGenerationResult } from './types';
import { BASE_SYSTEM_PROMPT } from './prompts';

function extractUncertaintyFlags(text: string): { cleanText: string; flags: string[] } {
  const match = text.match(/UNCERTAINTY_FLAGS:\s*(.*)$/im);
  if (!match || !match[1]) return { cleanText: text.trim(), flags: [] };
  const flagsRaw = match[1].trim();
  const flags = flagsRaw.toLowerCase() === 'none' ? [] : flagsRaw.split('|').map((f) => f.trim()).filter(Boolean);
  const cleanText = text.replace(match[0], '').trim();
  return { cleanText, flags };
}

export class GeminiProvider implements AiProvider {
  name = 'gemini' as const;
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  }

  async generate(input: AiGenerationInput): Promise<AiGenerationResult> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      systemInstruction: input.system ?? BASE_SYSTEM_PROMPT,
      generationConfig: {
        temperature: input.temperature ?? 0.4,
        maxOutputTokens: input.maxTokens ?? 600,
      },
    });

    const result = await model.generateContent(input.prompt);
    const raw = result.response.text();
    const { cleanText, flags } = extractUncertaintyFlags(raw);

    return {
      text: cleanText,
      provider: 'gemini',
      model: this.modelName,
      uncertaintyFlags: flags,
      requiresApproval: true,
    };
  }
}
