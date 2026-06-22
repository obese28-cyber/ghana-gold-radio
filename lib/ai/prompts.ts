/**
 * Shared safety rules injected into every AI generation call.
 * Hard requirements from the product spec:
 *  - Never invent facts.
 *  - Flag uncertainty explicitly.
 *  - Output is always a draft pending admin approval.
 */
export const BASE_SYSTEM_PROMPT = `You are an editorial assistant for Ghana Gold Radio, a Ghanaian music and diaspora culture platform.

STRICT RULES:
1. Only use facts explicitly provided in the prompt's source material. NEVER invent biographical details, dates, chart positions, quotes, statistics, or events.
2. If a needed fact is missing or ambiguous, write "[UNCERTAIN: <what is missing>]" inline rather than guessing.
3. At the end of your response, add a line starting with "UNCERTAINTY_FLAGS:" followed by a pipe-separated list of every uncertain claim you flagged (or "none" if there were none).
4. Never claim a song or artist has obtained streaming or distribution rights unless the source material says so explicitly.
5. Keep tone warm, professional, and culturally respectful of Ghanaian music traditions.
6. This output is a DRAFT. It will be reviewed by a human editor before publishing. Do not claim it has already been published or fact-checked.`;

export function buildBioPrompt(facts: {
  stageName: string;
  legalName?: string;
  genres?: string[];
  country?: string;
  city?: string;
  knownFacts?: string;
}) {
  return `Write a 120-180 word artist bio for Ghana Gold Radio using ONLY these facts:
Stage name: ${facts.stageName}
${facts.legalName ? `Legal name: ${facts.legalName}` : ''}
${facts.genres?.length ? `Genres: ${facts.genres.join(', ')}` : ''}
${facts.country ? `Country: ${facts.country}` : ''}
${facts.city ? `City: ${facts.city}` : ''}
${facts.knownFacts ? `Additional known facts: ${facts.knownFacts}` : ''}

If genre, hometown, or career details beyond what's listed are not provided, do not invent them — flag as uncertain instead.`;
}

export function buildSpotlightPrompt(facts: { artistName: string; knownFacts: string }) {
  return `Write a 200-300 word "Artist Spotlight" feature for Ghana Gold Radio about ${facts.artistName}, using ONLY the facts below. Highlight what makes their sound distinctive based on the provided info.

Known facts:
${facts.knownFacts}`;
}

export function buildNewsSummaryPrompt(facts: { sourceTitle: string; sourceUrl: string; sourceText: string }) {
  return `Summarize the following Ghana music news article in 100-150 words for Ghana Gold Radio's news section. Preserve factual accuracy; do not add opinions or unstated facts. Always retain attribution.

Source title: ${facts.sourceTitle}
Source URL: ${facts.sourceUrl}
Source text:
"""
${facts.sourceText}
"""

End your summary with: "Source: ${facts.sourceTitle}".`;
}

export function buildTop10CommentaryPrompt(facts: { entries: Array<{ rank: number; title: string; artist: string; previousRank?: number | null }> }) {
  const list = facts.entries
    .map((e) => `#${e.rank} — "${e.title}" by ${e.artist}${e.previousRank ? ` (was #${e.previousRank})` : ' (new entry)'}`)
    .join('\n');
  return `Write engaging 150-250 word commentary for this week's Ghana Gold Radio Top 10 chart, based ONLY on the chart movement data below. Mention notable rises, falls, and new entries. Do not speculate about sales figures, streaming numbers, or unstated reasons for chart movement.

Chart:
${list}`;
}

export function buildCaptionPrompt(facts: { topic: string; platform: 'instagram' | 'twitter' | 'tiktok' | 'facebook'; context: string }) {
  const limits: Record<string, string> = {
    twitter: 'under 280 characters',
    instagram: 'under 2200 characters, include 3-5 relevant hashtags',
    tiktok: 'under 150 characters, punchy and trend-aware',
    facebook: 'under 400 characters',
  };
  return `Write a ${facts.platform} caption (${limits[facts.platform]}) for Ghana Gold Radio about: ${facts.topic}.
Context/facts to use:
${facts.context}`;
}

export function buildNewsletterPrompt(facts: { weekOf: string; highlights: string }) {
  return `Draft the Ghana Gold Radio weekly newsletter for the week of ${facts.weekOf}. Use ONLY the highlights provided below. Structure with a short intro, then sections for Top 10 movement, news, and diaspora updates as applicable. Keep it warm and community-focused, 250-400 words.

Highlights:
${facts.highlights}`;
}

export function buildEventSummaryPrompt(facts: { eventName: string; details: string }) {
  return `Write a 100-180 word community update for Ghana Gold Radio's Diaspora Updates section about the event "${facts.eventName}", using ONLY the details given. Include date/location/organizer only if explicitly provided.

Details:
${facts.details}`;
}
