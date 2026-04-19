import rawData from '@/data/sellerData.json';

export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'whatsapp';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  type: string;
  url: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: number;
  views: number | null;
  postedAt: string;
}

export interface SocialProfile {
  platform: SocialPlatform;
  url: string;
  profilePic: string;
  bannerUrl: string;
  bio: string;
  followers: number;
  posts: SocialPost[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  subType: string;
  domain: string;
  segment: string;
  buyerPersona: string;
  tags: string[];
  brand: string;
  hsnCode: string;
  gstPercent: number | null;
  countryOfOrigin: string;
  certifications: string[];
  moq: number | null;
  moqUnit: string;
  priceUnit: string;
  priceSingle: number | null;
  priceMin: number | null;
  priceMax: number | null;
  isPriceRange: boolean;
  priceOnRequest: boolean;
  currency: string;
  primaryPhoto: string;
  photos: string[];
  inStock: boolean;
  sourceUrl: string;
  specifications: Record<string, string | number>;
}

const PLATFORMS: SocialPlatform[] = ['instagram', 'facebook', 'youtube', 'twitter', 'linkedin'];

function classifyUrl(url: string): SocialPlatform | null {
  if (!url) return null;
  const u = url.toLowerCase();
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('facebook.com') || u.includes('fb.com')) return 'facebook';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('twitter.com') || u.includes('x.com/')) return 'twitter';
  if (u.includes('linkedin.com')) return 'linkedin';
  if (u.includes('wa.me') || u.includes('whatsapp.com')) return 'whatsapp';
  return null;
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  if (url.includes('shorts/')) return url.split('shorts/')[1]?.split(/[?&#]/)[0] || '';
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
  if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0] || '';
  return '';
}

function normalizePost(raw: any, platform: SocialPlatform, idx: number): SocialPost {
  return {
    id: raw.post_url || `${platform}-${idx}`,
    platform,
    type: raw.type || 'post',
    url: raw.post_url || '',
    thumbnailUrl: raw.thumbnail_url || '',
    caption: raw.caption || '',
    likes: raw.likes || 0,
    comments: raw.comments || 0,
    views: raw.views ?? null,
    postedAt: raw.posted_at || '',
  };
}

export function extractSellerData() {
  const cp = (rawData as any).company_profile || {};
  const sellerId = String((rawData as any).seller_id || '');
  const sellerName = cp.name || 'Seller';
  const phones: string[] = (cp.phones || []).map((p: string) => String(p).replace(/^\+91/, '').replace(/\D/g, '')).filter(Boolean);
  const primaryPhone = phones[0] || '';
  const emails: string[] = cp.emails || [];
  const email = emails[0] || '';
  const fullAddress = cp.address || '';
  const city = cp.city || '';
  const website = cp.website || '';
  const businessType = cp.business_type || '';
  const googleLocation = cp.google_location || '';
  const ratingValue = typeof cp.rating_value === 'number' ? cp.rating_value : (cp.rating_value ? parseFloat(cp.rating_value) : null);
  const ratingCount = cp.rating_count || 0;
  const description = cp.description || '';

  // Build authoritative social profile list (one per platform)
  const profilesByPlatform: Record<string, SocialProfile> = {};
  const rawProfiles = (rawData as any).social_profiles || [];
  for (const p of rawProfiles) {
    const platform = (p.platform || '').toLowerCase() as SocialPlatform;
    if (!PLATFORMS.includes(platform)) continue;
    if (!p.url) continue;
    const profile: SocialProfile = {
      platform,
      url: p.url,
      profilePic: p.profile_pic_url || '',
      bannerUrl: p.banner_url || '',
      bio: p.bio || '',
      followers: typeof p.followers_count === 'number' ? p.followers_count : 0,
      posts: (p.posts || []).map((rp: any, i: number) => normalizePost(rp, platform, i)),
    };
    // Sort posts by postedAt desc, top 6
    profile.posts.sort((a, b) => new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime());
    profile.posts = profile.posts.slice(0, 6);
    profilesByPlatform[platform] = profile;
  }

  // Augment with social_urls (fallback for platforms missing in social_profiles)
  const socialUrls: string[] = [...(cp.social_urls || []), ...((rawData as any).social_urls || [])];
  for (const u of socialUrls) {
    const platform = classifyUrl(u);
    if (!platform || platform === 'whatsapp') continue;
    if (!profilesByPlatform[platform]) {
      profilesByPlatform[platform] = {
        platform,
        url: u,
        profilePic: '',
        bannerUrl: '',
        bio: '',
        followers: 0,
        posts: [],
      };
    }
  }

  const socialProfiles = Object.values(profilesByPlatform);

  // WhatsApp link from cp.facebook fallback (per JSON the WA link is in social_urls)
  const whatsappUrl = (socialUrls.find(u => /wa\.me|whatsapp/i.test(u)) || '');

  // Banner / Avatar priority
  const yt = profilesByPlatform.youtube;
  const fb = profilesByPlatform.facebook;
  const ig = profilesByPlatform.instagram;
  const bannerUrl = yt?.bannerUrl || fb?.bannerUrl || '';
  const avatarUrl = ig?.profilePic || yt?.profilePic || fb?.profilePic || '';

  // Tagline (used by hero/footer)
  const tagline = description || yt?.bio || ig?.bio || fb?.bio || '';

  // Products from catalog_items
  const catalogItems = (rawData as any).catalog_items || [];
  const products: CatalogProduct[] = catalogItems
    .filter((c: any) => c.clean_name)
    .map((c: any, i: number) => ({
      id: c.fingerprint || String(i),
      name: c.clean_name,
      description: c.description || '',
      category: c.product_category || 'Other',
      subType: c.product_sub_type || '',
      domain: c.top_level_domain || '',
      segment: c.industry_segment || '',
      buyerPersona: c.buyer_persona || '',
      tags: Array.isArray(c.tags) ? c.tags : [],
      brand: c.b2b_attributes?.brand || '',
      hsnCode: c.b2b_attributes?.hsn_code || '',
      gstPercent: c.b2b_attributes?.gst_percent ?? null,
      countryOfOrigin: c.b2b_attributes?.country_of_origin || '',
      certifications: c.b2b_attributes?.certifications || [],
      moq: c.b2b_attributes?.moq ?? null,
      moqUnit: c.b2b_attributes?.moq_unit || '',
      priceUnit: c.b2b_attributes?.price_unit || c.price_unit || '',
      priceSingle: c.price_single ?? null,
      priceMin: c.price_min ?? null,
      priceMax: c.price_max ?? null,
      isPriceRange: !!c.is_price_range,
      priceOnRequest: !!c.price_on_request,
      currency: c.currency || 'INR',
      primaryPhoto: c.primary_photo_url || c.photo_urls?.[0] || '',
      photos: (c.photo_urls || []).filter(Boolean),
      inStock: c.in_stock !== false,
      sourceUrl: c.source_url || '',
      specifications: c.specifications || {},
    }));

  // Categories (unique with counts)
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Gallery images (deduped)
  const galleryImages: { url: string; source: string; caption?: string }[] = [];
  const seen = new Set<string>();
  const addImg = (url: string, source: string, caption?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    galleryImages.push({ url, source, caption });
  };
  products.forEach(p => {
    addImg(p.primaryPhoto, 'Catalog', p.name);
    p.photos.forEach(ph => addImg(ph, 'Catalog', p.name));
  });
  ((rawData as any).media_assets || []).forEach((m: any) => addImg(m.url, 'Catalog', m.product_name));
  ig?.posts.forEach(p => addImg(p.thumbnailUrl, 'Instagram', p.caption));
  yt?.posts.forEach(p => addImg(p.thumbnailUrl, 'YouTube', p.caption));

  // Reviews summary
  const rs = (rawData as any).reviews_summary || {};
  const reviewsSummary = {
    totalRating: rs.total_rating ?? ratingValue ?? null,
    noOfRatings: rs.no_of_ratings ?? ratingCount ?? 0,
    ratingComments: rs.rating_comments || [],
  };
  const individualReviews = ((rawData as any).reviews || []).map((r: any) => ({
    author: r.author || r.name || 'Anonymous',
    rating: r.rating || 0,
    text: r.text || r.comment || '',
    date: r.date || r.posted_at || '',
  }));

  // IndiaMART URL (constructed from seller_id)
  const indiamartUrl = sellerId
    ? `https://www.indiamart.com/seller/${sellerId}/`
    : `https://www.indiamart.com/`;

  // Highest follower count across platforms
  const topFollowers = socialProfiles.reduce((max, p) => Math.max(max, p.followers || 0), 0);

  // Trust badges per spec
  const trustBadges: { label: string; icon: string; url?: string; scrollTo?: string }[] = [];
  trustBadges.push({ label: 'IndiaMART Verified', icon: 'verified', url: indiamartUrl });
  if (ratingValue && reviewsSummary.noOfRatings > 0) {
    trustBadges.push({ label: `${ratingValue.toFixed(1)}★ Rated`, icon: 'award', scrollTo: 'reviews' });
    trustBadges.push({ label: `${reviewsSummary.noOfRatings} Reviews`, icon: 'file-check', scrollTo: 'reviews' });
  }
  if (city) {
    trustBadges.push({ label: city, icon: 'map-pin', url: googleLocation || undefined, scrollTo: googleLocation ? undefined : 'contact' });
  }
  if (businessType) {
    trustBadges.push({ label: businessType, icon: 'factory', scrollTo: 'about' });
  }
  if (products.length > 0) {
    trustBadges.push({ label: `${products.length} Products`, icon: 'package', scrollTo: 'products' });
  }
  if (topFollowers > 0) {
    trustBadges.push({ label: `${formatCount(topFollowers)} Followers`, icon: 'verified', scrollTo: 'social' });
  }
  if (website) {
    trustBadges.push({ label: 'Website', icon: 'globe', url: website });
  }

  return {
    sellerId,
    sellerName,
    tagline,
    description,
    businessType,
    phones,
    primaryPhone,
    emails,
    email,
    fullAddress,
    city,
    website,
    googleLocation,
    ratingValue,
    ratingCount,
    avatarUrl,
    bannerUrl,
    indiamartUrl,
    whatsappUrl,
    socialProfiles,
    products,
    categories,
    galleryImages,
    reviewsSummary,
    individualReviews,
    trustBadges,
    topFollowers,
  };
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export function formatPrice(p: CatalogProduct): string {
  if (p.priceOnRequest) return 'Price on request';
  const sym = p.currency === 'INR' ? '₹' : (p.currency || '');
  const fmt = (n: number) => sym + n.toLocaleString('en-IN');
  const unit = p.priceUnit ? ` / ${p.priceUnit}` : '';
  if (p.isPriceRange && p.priceMin != null && p.priceMax != null) {
    return `${fmt(p.priceMin)} – ${fmt(p.priceMax)}${unit}`;
  }
  if (p.priceSingle != null) return `${fmt(p.priceSingle)}${unit}`;
  if (p.priceMin != null) return `${fmt(p.priceMin)}${unit}`;
  return 'Price on request';
}

export type SellerData = ReturnType<typeof extractSellerData>;
