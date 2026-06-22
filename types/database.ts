// Legacy application data types. Prisma models in prisma/schema.prisma are
// the authoritative database contract.
// and reconcile any drift with this file.

export type UserRole = 'admin' | 'editor' | 'moderator' | 'listener';
export type SubmissionStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'published' | 'withdrawn';
export type PermissionStatus = 'unknown' | 'requested' | 'granted' | 'denied' | 'expired';
export type PostStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type PostCategoryType =
  | 'news' | 'diaspora_update' | 'event' | 'highlife' | 'gospel' | 'afrobeats_hiplife' | 'general';
export type AiContentType =
  | 'artist_bio' | 'artist_spotlight' | 'news_summary' | 'top10_commentary'
  | 'social_caption' | 'newsletter' | 'event_summary';
export type AiReviewStatus = 'draft' | 'flagged' | 'approved' | 'rejected' | 'published';
export type SponsorInquiryStatus = 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost';

export interface AppUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Artist {
  id: string;
  stage_name: string;
  legal_name: string | null;
  slug: string;
  bio: string | null;
  bio_ai_generated: boolean;
  genres: string[];
  country: string | null;
  city: string | null;
  press_photo_url: string | null;
  social_links: Record<string, string>;
  is_featured: boolean;
  permission_status: PermissionStatus;
  permission_id: string | null;
  verified: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Song {
  id: string;
  title: string;
  slug: string;
  artist_id: string;
  genre: string | null;
  category_id: string | null;
  release_date: string | null;
  official_youtube_url: string | null;
  streaming_links: Record<string, string>;
  cover_art_url: string | null;
  ai_summary: string | null;
  permission_status: PermissionStatus;
  permission_id: string | null;
  is_active: boolean;
  play_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Top10Chart {
  id: string;
  week_start_date: string;
  week_end_date: string;
  title: string;
  ai_commentary: string | null;
  ai_review_status: AiReviewStatus;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Top10ChartItem {
  id: string;
  chart_id: string;
  song_id: string;
  rank: number;
  previous_rank: number | null;
  weeks_on_chart: number;
  note: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  category_id: string | null;
  post_type: PostCategoryType;
  featured_image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  is_ai_generated: boolean;
  ai_content_type: AiContentType | null;
  ai_uncertainty_flags: string[];
  ai_review_status: AiReviewStatus;
  status: PostStatus;
  published_at: string | null;
  author_id: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ArtistSubmission {
  id: string;
  stage_name: string;
  legal_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  country: string;
  city: string | null;
  genre: string;
  song_title: string;
  official_youtube_url: string | null;
  streaming_links: Record<string, string>;
  artist_bio: string | null;
  social_links: Record<string, string>;
  press_photo_url: string | null;
  demo_upload_url: string | null;
  rights_ownership_declared: boolean;
  promotional_permission_declared: boolean;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  full_name: string | null;
  country: string | null;
  preferences: { news: boolean; top10: boolean; diaspora: boolean; events: boolean };
  is_confirmed: boolean;
  unsubscribed_at: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: PostCategoryType;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SponsorInquiry {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  package_interest: string | null;
  budget_range: string | null;
  message: string | null;
  status: SponsorInquiryStatus;
  created_at: string;
}
