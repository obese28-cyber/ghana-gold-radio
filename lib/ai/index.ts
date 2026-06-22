import type { AiProvider, AiGenerationInput, AiGenerationResult } from './types';
import { OpenAiProvider } from './openai-provider';
import { GeminiProvider } from './gemini-provider';

export * from './types';
export * from './prompts';

/**
 * Configurable AI provider abstraction. Reads AI_PROVIDER env var
 * ('openai' | 'gemini'). Swap providers without touching call sites.
 */
function getProvider(): AiProvider {
  const providerName = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (providerName === 'gemini') return new GeminiProvider();
  return new OpenAiProvider();
}

/**
 * Generate AI content. Every result is a draft (`requiresApproval: true`)
 * and must be persisted with `ai_review_status = 'draft'` until an admin
 * approves it via the admin AI tools dashboard.
 */
export async function generateAiContent(input: AiGenerationInput): Promise<AiGenerationResult> {
  const provider = getProvider();
  try {
    return await provider.generate(input);
  } catch (err) {
    throw new Error(
      `AI generation failed via ${provider.name}: ${err instanceof Error ? err.message : 'unknown error'}`
    );
  }
}
