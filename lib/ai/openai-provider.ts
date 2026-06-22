import OpenAI from 'openai';
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

export class OpenAiProvider implements AiProvider {
  name = 'openai' as const;
  private client: OpenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.');
    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generate(input: AiGenerationInput): Promise<AiGenerationResult> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: input.temperature ?? 0.4,
      max_tokens: input.maxTokens ?? 600,
      messages: [
        { role: 'system', content: input.system ?? BASE_SYSTEM_PROMPT },
        { role: 'user', content: input.prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    const { cleanText, flags } = extractUncertaintyFlags(raw);

    return {
      text: cleanText,
      provider: 'openai',
      model: this.model,
      uncertaintyFlags: flags,
      requiresApproval: true,
    };
  }
}
