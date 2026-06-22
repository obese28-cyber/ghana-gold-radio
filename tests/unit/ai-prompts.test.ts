import { buildBioPrompt, buildTop10CommentaryPrompt, BASE_SYSTEM_PROMPT } from '@/lib/ai/prompts';

describe('AI prompt builders', () => {
  it('embeds the fact-safety system prompt rules', () => {
    expect(BASE_SYSTEM_PROMPT).toMatch(/NEVER invent/i);
    expect(BASE_SYSTEM_PROMPT).toMatch(/UNCERTAINTY_FLAGS/);
  });

  it('builds a bio prompt containing only supplied facts', () => {
    const prompt = buildBioPrompt({ stageName: 'Ama Diaspora', genres: ['Gospel'], country: 'Ghana' });
    expect(prompt).toContain('Ama Diaspora');
    expect(prompt).toContain('Gospel');
    expect(prompt).not.toContain('undefined');
  });

  it('builds a top10 commentary prompt with rank movement', () => {
    const prompt = buildTop10CommentaryPrompt({
      entries: [{ rank: 1, title: 'Song A', artist: 'Artist A', previousRank: 3 }],
    });
    expect(prompt).toContain('#1');
    expect(prompt).toContain('was #3');
  });
});
