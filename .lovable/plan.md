

# v7-updated-2: Remove IndiaMART, Swap to GPX Data, Polish

## Scope
The doc's central rule: **"NOT affiliated with any marketplace... All links/CTAs come exclusively from the Catalog JSON — no platform URLs are constructed or assumed."** Plus refinements from Pages 41-43 and a new product-count badge spec. Also swap data file to GPX Diamonds (`122074094_Catalog_2.json`) which was uploaded previously but never replaced in the project.

## Changes

### 1. Remove ALL IndiaMART references (doc-mandated standalone)
- **`sellerDataExtractor.ts`**: delete `indiamartUrl` field + the constructed `https://www.indiamart.com/seller/...` URL. Remove `IndiaMART Verified` trust badge entirely.
- **`HeroSection.tsx`**: Replace "View on IndiaMART" CTA with **"Contact Seller"** (WhatsApp → tel → email). Keep "Visit Website" if `website` exists.
- **`ProductCatalog.tsx`**: Remove "View on IndiaMART" secondary CTA. Keep only "Enquire About All Products" (WhatsApp / mailto fallback). Update `enquireFor()` fallback chain to drop IndiaMART URL — fall back to phone tel: link if no email.
- **`ContactSidebar.tsx`**: Remove "IndiaMART Profile" link entirely.
- **`ReviewsSection.tsx`**: Replace `data.indiamartUrl` fallbacks with `data.googleLocation` only; if neither, hide the "View source" / "Read on source" links.
- **`SellerData` type**: drop `indiamartUrl` field across all consumers.

### 2. Swap data to GPX Diamonds
- Replace `src/data/sellerData.json` contents with the previously uploaded `122074094_Catalog_2.json` (GPX Diamonds — 18 products, 4 social platforms, 45 ratings, rich YouTube banner + bio).

### 3. New product-count trust badge logic
- **`sellerDataExtractor.ts`**: compute `totalProducts = json.products?.length || 0` and `showcasedItems = json.catalog_items?.length || totalProducts`. 
- **`TrustBadges.tsx`**: badge label = `"Showing X of Y Products"` when showcased < total, else `"Y Products"`. Add tooltip via `title` attribute. Click → scroll to `#products`.
- Also update Followers badge label to include platform name (e.g. `"732 YouTube Followers"`).

### 4. Refinements (Pages 42-43)
- **Hero overlay**: confirm dark gradient max opacity ≤ 0.85.
- **Buttons**: standardize all variants in `button.tsx` with 0.2-0.25s transitions, scale 1.02, `translateY(-2px)`, soft shadow, focus ring.
- **Product grid (`index.css`)**: ensure `repeat(4, minmax(0,1fr))` ≥1280px; `repeat(3, minmax(0,1fr))` 1024-1279px; `repeat(2, ...)` 640-1023px; `1fr` <640px. Prevents 1920px stretching.
- **ProductCard images**: `object-fit: cover`, fixed `aspect-ratio: 4/3`, skeleton shimmer placeholder, fade-in on load, `onerror` collapses image area.
- **Social tabs**: confirm tab bar only renders platforms with `posts.length > 0` and is horizontally scrollable. IG cards: `max-height` + `overflow:hidden`, padding 8-12px, border-radius 8-12px. YT cards: `aspect-ratio: 16/9` thumbnail.
- **Rating card**: rebalanced large-numeric layout (already done in prior pass — verify no empty zones for GPX 5.0 / 45 ratings).
- **Hamburger menu**: verify all 7 anchors smooth-scroll with 80px offset, ≥44px tap targets.

### 5. Hero CTA contrast fix
With IndiaMART CTA gone, primary hero CTA becomes "Contact Seller" — use solid `Button` (dark on light or accent) for high contrast over the banner; secondary "Visit Website" stays as `glass` variant.

## Files

**Replace**
- `src/data/sellerData.json` (← GPX Diamonds JSON)

**Edit**
- `src/lib/sellerDataExtractor.ts` (remove `indiamartUrl`, add `totalProducts`/`showcasedItems`, update trust badges)
- `src/components/seller/HeroSection.tsx` (Contact Seller CTA replaces IndiaMART)
- `src/components/seller/ProductCatalog.tsx` (drop IndiaMART CTA + fallback)
- `src/components/seller/ContactSidebar.tsx` (drop IndiaMART link)
- `src/components/seller/ReviewsSection.tsx` (use googleLocation only)
- `src/components/seller/TrustBadges.tsx` (new product-count badge text + tooltip)
- `src/components/ui/button.tsx` (consistent transitions/focus)
- `src/components/seller/ProductCard.tsx` (skeleton shimmer + cover aspect)
- `src/index.css` (grid minmax + shimmer keyframes)

**Verify only (no edits expected)**
- `NavBar.tsx`, `SocialPosts.tsx`, `MediaGallery.tsx`, `AboutSection.tsx`, `Footer.tsx`, `MobileCTA.tsx`

