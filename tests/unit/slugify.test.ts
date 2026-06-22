import { slugify } from '@/lib/utils/slugify';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Kwame Star')).toBe('kwame-star');
  });

  it('strips special characters', () => {
    expect(slugify("Yaa's Song! (Remix)")).toBe('yaas-song-remix');
  });

  it('collapses multiple spaces/hyphens', () => {
    expect(slugify('Highlife   Legends -- 90s')).toBe('highlife-legends-90s');
  });
});
