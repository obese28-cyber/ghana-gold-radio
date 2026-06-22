export interface AiGenerationInput {
  /** The task-specific prompt (already includes the source facts to work from). */
  prompt: string;
  /** System-level instructions. Each tool supplies its own; falls back to BASE_SYSTEM_PROMPT. */
  system?: string;
  /** Max output tokens. */
  maxTokens?: number;
  /** Sampling temperature — kept low (<=0.5) by default for factual content. */
  temperature?: number;
}

export interface AiGenerationResult {
  /** The generated text, never auto-published. */
  text: string;
  /** Model/provider used, for audit logging. */
  provider: 'openai' | 'gemini';
  model: string;
  /** Phrases the model itself flagged as uncertain or unverifiable. */
  uncertaintyFlags: string[];
  /** Always true — every AI result requires a human admin to approve before publish. */
  requiresApproval: true;
}

export interface AiProvider {
  name: 'openai' | 'gemini';
  generate(input: AiGenerationInput): Promise<AiGenerationResult>;
}
