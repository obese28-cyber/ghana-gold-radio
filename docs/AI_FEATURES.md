# AI Features — Ghana Gold Radio

## Provider abstraction

`lib/ai/index.ts` exposes a single `generateAiContent(input)` function. The active provider is chosen via the `AI_PROVIDER` environment variable (`openai` or `gemini`); swapping providers — or adding a third — requires no changes at any call site, only a new class implementing the `AiProvider` interface in `lib/ai/types.ts`.

## The seven tools

Each tool has a dedicated, admin/editor-only API route under `app/api/ai/*`, a prompt builder in `lib/ai/prompts.ts`, and a Zod input schema in `lib/validation/schemas.ts`. All seven are reachable from a single interface at `/admin/ai-tools`.

The **artist bio generator** (`bio-generator`) drafts a 120–180 word bio from supplied facts only. The **artist spotlight generator** (`spotlight`) drafts a longer 200–300 word feature. The **news summarizer** (`summarizer`) condenses a source article into 100–150 words with mandatory source attribution preserved. The **Top 10 commentary generator** (`top10-commentary`) writes chart commentary strictly from rank-movement data, never inventing sales or streaming figures. The **social caption generator** (`caption-generator`) produces platform-appropriate captions (Instagram/Twitter/TikTok/Facebook) with correct length constraints. The **newsletter generator** (`newsletter-generator`) drafts the weekly email from supplied highlights. The **event summary generator** (`event-summarizer`) writes Diaspora Updates copy from event details provided by staff.

## Safety rules (non-negotiable, enforced in the prompt and the data model)

1. **Never invent facts.** The shared `BASE_SYSTEM_PROMPT` instructs the model to use only facts present in the prompt and to write `[UNCERTAIN: ...]` inline rather than guess.
2. **Flag uncertainty explicitly.** Every response ends with an `UNCERTAINTY_FLAGS:` line, parsed server-side (`extractUncertaintyFlags` in each provider) into a structured `uncertaintyFlags[]` array surfaced prominently in the admin UI.
3. **Require admin approval before publishing.** Every `AiGenerationResult` carries `requiresApproval: true`. Nothing the AI produces is auto-saved to a publishable table — staff must copy the draft into the relevant content form, review the flags, and explicitly publish. Content tables persist this state via `ai_review_status` (`draft → flagged → approved/rejected → published`) and `is_ai_generated` / `bio_ai_generated` booleans, so AI-authored content is always distinguishable from human-authored content, including to end users (public pages render an "AI-assisted, reviewed by our editorial team" disclosure wherever `is_ai_generated`/`bio_ai_generated` is true).

## Rate limiting

AI routes share a per-staff-user rate-limit bucket (`ai-tools`) distinct from public-form buckets, capped between 20–60 requests/hour depending on the tool, to control API cost and prevent runaway usage.

## Extending

To add an eighth tool: add a Zod schema to `lib/validation/schemas.ts`, a prompt builder to `lib/ai/prompts.ts`, a route under `app/api/ai/<name>/route.ts` following the existing pattern (staff auth → rate limit → validate → `generateAiContent` → return with `requiresApproval: true`), and a button/placeholder pair in `/admin/ai-tools`.
