import { z } from 'zod';

// Shared primitives
const url = z.string().trim().url().max(500);
const optionalUrl = z.union([url, z.literal('')]).optional();
const phone = z.string().trim().min(7).max(20).regex(/^[0-9+().\-\s]+$/, 'Invalid phone number');

export const artistSubmissionSchema = z.object({
  stageName: z.string().trim().min(2).max(100),
  legalName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: phone.optional().or(z.literal('')),
  whatsapp: phone.optional().or(z.literal('')),
  country: z.string().trim().min(2).max(60),
  city: z.string().trim().max(60).optional().or(z.literal('')),
  genre: z.string().trim().min(2).max(60),
  songTitle: z.string().trim().min(1).max(150),
  officialYoutubeUrl: optionalUrl,
  streamingLinks: z.record(z.string().url()).optional(),
  artistBio: z.string().trim().max(2000).optional().or(z.literal('')),
  socialLinks: z.record(z.string().url()).optional(),
  pressPhotoUrl: optionalUrl,
  demoUploadUrl: optionalUrl,
  rightsOwnershipDeclared: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm you own or represent the rights to this music.' }),
  }),
  promotionalPermissionDeclared: z.literal(true, {
    errorMap: () => ({ message: 'You must grant promotional permission to submit.' }),
  }),
  turnstileToken: z.string().min(1, 'Please complete the verification challenge.'),
  honeypot: z.string().max(0, 'Spam detected.').optional().or(z.literal('')),
});
export type ArtistSubmissionInput = z.infer<typeof artistSubmissionSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(200),
  fullName: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(60).optional().or(z.literal('')),
  preferences: z
    .object({ news: z.boolean(), top10: z.boolean(), diaspora: z.boolean(), events: z.boolean() })
    .partial()
    .optional(),
  turnstileToken: z.string().min(1),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  category: z.enum(['general', 'press', 'artist', 'sponsor', 'technical', 'other']).default('general'),
  subject: z.string().trim().max(150).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(3000),
  turnstileToken: z.string().min(1),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const sponsorInquirySchema = z.object({
  companyName: z.string().trim().min(2).max(150),
  contactName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: phone.optional().or(z.literal('')),
  packageInterest: z.string().trim().max(60).optional().or(z.literal('')),
  budgetRange: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  turnstileToken: z.string().min(1),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});
export type SponsorInquiryInput = z.infer<typeof sponsorInquirySchema>;

export const aiBioRequestSchema = z.object({
  stageName: z.string().trim().min(2).max(100),
  legalName: z.string().trim().max(100).optional(),
  genres: z.array(z.string().trim().max(40)).max(8).optional(),
  country: z.string().trim().max(60).optional(),
  city: z.string().trim().max(60).optional(),
  knownFacts: z.string().trim().max(3000).optional(),
});

export const aiNewsSummarySchema = z.object({
  sourceTitle: z.string().trim().min(2).max(200),
  sourceUrl: z.string().trim().url(),
  sourceText: z.string().trim().min(50).max(8000),
});

export const aiTop10CommentarySchema = z.object({
  entries: z
    .array(
      z.object({
        rank: z.number().int().min(1).max(10),
        title: z.string().min(1).max(150),
        artist: z.string().min(1).max(150),
        previousRank: z.number().int().min(1).max(10).nullable().optional(),
      })
    )
    .min(1)
    .max(10),
});

export const aiCaptionSchema = z.object({
  topic: z.string().trim().min(2).max(300),
  platform: z.enum(['instagram', 'twitter', 'tiktok', 'facebook']),
  context: z.string().trim().min(2).max(2000),
});

export const aiNewsletterSchema = z.object({
  weekOf: z.string().trim().min(2).max(40),
  highlights: z.string().trim().min(10).max(4000),
});

export const aiEventSummarySchema = z.object({
  eventName: z.string().trim().min(2).max(200),
  details: z.string().trim().min(10).max(3000),
});

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
}
