

# Crompton Greaves Catalog — Product-First Revamp

## Summary
The new doc + JSON shifts the page from a generic seller profile to a **product-first catalog** for **Crompton Greaves** (50+ products in `catalog_items[]`). The current code is hard-tuned to the old JHAS JSON shape (`indiamart_normalized`, `instagram_accounts[]`, etc.) and lacks any Product Catalog section. This is a substantial rebuild of the data extractor and section list, while keeping the existing light theme, splash screen, framer-motion animations, and component scaffolding.

## What changes vs current build

### 1. Data layer — full rewrite of `sellerDataExtractor.ts`
The new JSON shape is completely different:
- Top-level: `seller_id`, `company_profile{}`, `catalog_items[]`, `products[]`, `media_assets[]`, `social_profiles[]`, `reviews[]`, `reviews_summary{}`, `social_urls[]`
- `social_profiles[]` is an **array** of `{platform, url, profile_pic_url, banner_url, bio, followers_count, posts[]}` — replaces the old per-platform inline keys
- Each post now has `{type, post_url, thumbnail_url, caption, likes, comments, views, posted_at}`

Replace `sellerData.json` with `Catalog_4_json.json` and rewrite `extractSellerData()` to normalize:
- `sellerName` ← `company_profile.name`
- `phones`, `emails`, `address`, `city`, `website`, `businessType`, `googleLocation`, `ratingValue`, `ratingCount`
- `socialProfiles[]` ← normalized array, with helper lookups by platform
- `bannerUrl` ← YouTube banner → Facebook banner → null (CSS gradient)
- `avatarUrl` ← Instagram pic → YouTube pic → Facebook pic → initials
- `products[]` ← from `catalog_items[]` (preferred) or `products[]`, with normalized price formatting helper
- `categories[]` ← unique `product_category` values with counts (filtered to remove business-type labels)
- `galleryImages[]` ← deduped from `media_assets[]` + `catalog_items[].photo_urls[]` + `primary_photo_url`
- `instagramPosts[]`, `youtubePosts[]` ← sorted by `posted_at` desc, top 5
- `reviewsSummary` ← `{total_rating, no_of_ratings, rating_comments[]}`
- IndiaMART seller URL constructed from `seller_id`

### 2. NEW: Product Catalog Section (primary section)
New components:
- `ProductCatalog.tsx` — section orchestrator, holds category filter state
- `CategoryFilterBar.tsx` — horizontal pill scroller, "All" + each unique `product_category`
- `ProductCard.tsx` — image, name (clamp 2 lines), category chip, sub-type chip, price (handles `price_on_request` / `is_price_range` / `price_single` + currency + `price_unit`), in-stock badge, 100-char description, first 3 tags, Enquire CTA. Click opens detail modal.
- `ProductDetailModal.tsx` — full name, image carousel from `photo_urls[]` (Glide-like behavior via framer or simple carousel), full description, specifications table (excluding nulls), B2B attributes (HSN, GST%, country, brand, MOQ), full tags, buyer persona "Ideal for..." callout, source URL link if present
- Section CTAs: "Enquire About All Products" → wa.me link; "View on IndiaMART" → constructed URL
- Responsive grid via explicit `grid-template-columns`: 4/3/2/1 cols at 1280/1024/768/<768

### 3. Updates to existing components

**HeroSection.tsx**
- Banner priority: YT banner → FB banner → CSS gradient (currently uses different priority)
- Avatar priority: IG → YT → FB → initials
- Hero CTAs: "View on IndiaMART" + "Visit Website" (only if `website` present)
- Inline contact pills: phone, email, address
- Rating display: `rating_value` ★ + `(rating_count)`

**TrustBadges.tsx** — rebuild to spec
- IndiaMART Verified (always) → seller IndiaMART URL
- Rating: N★ → scrolls to #reviews
- N Reviews → #reviews
- City → Google Maps location URL
- Business Type → #about
- N Products → #products
- N Followers (highest across `social_profiles[]`) → #social
- Visit Website → website URL
- Hide any badge with no data; never render broken links

**NavBar.tsx** — add "Products" anchor between Overview and Categories; update scroll-spy section list

**AboutSection.tsx**
- Description: `company_profile.description` → fallback to YT/IG/FB bio
- Business type chip
- Google Maps embed via iframe using `google_location` URL (or fall back to address text)
- Social platform cards (one per `social_profiles[]` with non-null url): icon, followers count, truncated bio, Follow button. Order by `followers_count` desc.

**ContactSidebar.tsx**
- WhatsApp / Call / Email CTAs from `phones[0]` / `emails[0]`
- Maps embed
- Social icon row sourced from `social_profiles[].url` (drop legacy `social_urls[]` parsing)

**MediaGallery.tsx**
- Image priority per spec; 3/2/1 col grid; lightbox unchanged
- Videos tab from `social_profiles[youtube].posts[]` thumbnails + iframe modal

**SocialPosts.tsx**
- Tabs only for platforms with `posts.length > 0` (here: Instagram + YouTube)
- Instagram: blockquote embed via `embed.js` lazy-loaded with IntersectionObserver; placeholder uses `thumbnail_url` + caption + likes/comments/views/`posted_at`. Already partially in place — wire to new data shape.
- YouTube: thumbnail card → modal iframe via `extractYouTubeId()` (handle `watch?v=`, `/shorts/`, `youtu.be/`)
- Profile header per platform (avatar + bio + followers + Follow button)

**ReviewsSection.tsx**
- Aggregate card: large `total_rating` numeric + amber stars + "Based on N ratings" + Google source badge
- Individual reviews from `reviews[]` (empty here) + `rating_comments[]` (empty here) → show "Individual reviews not available" note
- No blended average; stars in `#F59E0B`

**Footer.tsx + MobileCTA.tsx**
- Footer social icons iterate `social_profiles[]` (non-null url only)
- Email line from `emails[0]`
- Mobile sticky CTA: WhatsApp + Call from `phones[0]`

**SplashScreen.tsx** — already uses dynamic initials; keep, ensure ≥1.2s

**Index.tsx** — section order:
NavBar → Hero → About → ProductCatalog (new, primary) → CategoryGrid → MediaGallery → SocialPosts → ReviewsSection → ContactSidebar → Footer → MobileCTA

### 4. Page structure / conditional rendering
Every section hidden if its data is empty (per spec). For Crompton: all sections render except individual reviews list.

### 5. Theme — keep current light theme
Current palette already matches doc spec (Page bg `#FAFAFA`/white, Primary `#1A1A1A`/navy, Green `#10B981`, Star `#F59E0B`). No theme overhaul needed; only minor token tweaks if contrast issues surface.

### 6. Animations & polish (already in place — extend to new components)
- Framer Motion entry animations for ProductCatalog, ProductCard stagger pop-in (scale 0.8→1 + fade)
- ScrollTrigger-style reveals via `whileInView`
- Product card hover: lift + shadow + image zoom
- Detail modal: scale+fade entrance, backdrop blur

## Files

**New**
- `src/data/sellerData.json` (replace contents with Crompton JSON)
- `src/components/seller/ProductCatalog.tsx`
- `src/components/seller/CategoryFilterBar.tsx`
- `src/components/seller/ProductCard.tsx`
- `src/components/seller/ProductDetailModal.tsx`

**Rewrite**
- `src/lib/sellerDataExtractor.ts` (full rewrite for new JSON shape)

**Edit**
- `src/pages/Index.tsx` (add ProductCatalog section, update order)
- `src/components/seller/NavBar.tsx` (add Products anchor)
- `src/components/seller/HeroSection.tsx` (CTA + priority changes)
- `src/components/seller/TrustBadges.tsx` (rebuild badge list per spec)
- `src/components/seller/AboutSection.tsx` (social platform cards, maps embed)
- `src/components/seller/ContactSidebar.tsx` (use `social_profiles[].url`)
- `src/components/seller/MediaGallery.tsx` (new image/video sourcing)
- `src/components/seller/SocialPosts.tsx` (new posts shape, profile headers)
- `src/components/seller/ReviewsSection.tsx` (aggregate-only with "no individual reviews" note)
- `src/components/seller/Footer.tsx` (iterate `social_profiles[]`)
- `src/components/seller/MobileCTA.tsx` (phones[0])

