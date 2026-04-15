# IndiaMART Seller Dynamic Catalog Page — JHAS Industries

## Overview

Build a fully dynamic, modern, catchy, responsive, single-page seller profile/catalog page for JHAS Industries using the provided JSON data. The page will be data-driven with no hardcoded seller info, following the complete spec from the uploaded document.

## Data Processing

- Copy the JSON file into the project as a static data source
- Build a data extraction utility (`src/lib/sellerDataExtractor.ts`) that parses the JSON and normalizes all fields: seller identity, contacts, categories, social posts, images, videos, trust badges, reviews, certifications
- Filter categories to exclude business-type labels (Manufacturer, Exporter, LEADER, etc.)
- Select primary Instagram account by highest follower count (jhas_industries with 40 followers)
- Sort social posts by timestamp descending, limit 5 per platform

## Page Sections (all conditionally rendered)

### 1. Sticky Navigation Bar

- IndiaMART logo left, scroll-spy anchor links (Overview | Categories | Gallery | Social | Reviews | Contact)
- "Contact Seller" + "Get Quote" CTAs on right
- Mobile hamburger menu, smooth scroll, active state highlighting

### 2. Hero Section

- Banner: Seller(Jhas Industries) banner from Youtube or facebook or instagram or linkedin, or if not there IndiaMART branded gradient fallback (#1A3A6E → #2B5197) with dark overlay
- Circular avatar from Instagram `profilepicurlhd` (jhas_industries account)
- Business name, tagline from Instagram biography, hero CTAs
- Trust badge strip: IndiaMART Verified, Est. 1949, GSTIN, ISO 9001:2015, Manufacturer, City (Aligarh), product category count — all clickable with proper redirects
- Owner info (Alok Jha), contact details

### 3. About / Business Summary

- Company description from IndiaMART raw data (HTML sanitized)
- Business type chips (Manufacturer, Exporter)
- Year of establishment (1949), certifications (ISO, GSTIN, D&B, SSI)
- Website links, Linktree link

### 4. Contact & CTA Section

- Sticky sidebar on desktop, fixed bottom bar on mobile
- WhatsApp + Call CTAs (phone: 8505579174 — most sources)
- Email: [security@jhas.in](mailto:security@jhas.in)
- Address with Google Maps embed (lat: 27.87137, lng: 78.07276)
- Social media icon row (Instagram, Facebook, YouTube, X/Twitter, LinkedIn)
- Directory links (IndiaMART, JustDial)

### 5. Product Categories

- IndiaMART categories: Bag Seals, Bolt Seals, Cable Seals, Container Seals, etc. (14 product categories)
- Other source categories: Security Seals, Sealing Solutions, Industrial Company
- 3D hover effect cards with glassmorphism, responsive grid (4/3/2/1 cols)
- "View All on IndiaMART" CTA linking to seller's IndiaMART profile

### 6. Media Gallery

- Images tab: Instagram post images, facebook post images, youtube videos/shorts thumbnails from all accounts, deduplicated
- Videos tab: YouTube shorts (3 videos with iframe embeds), Instagram video/reel posts
- Lightbox modal for full-size viewing, source badges on each card
- Broken image handling via onerror → hide card

### 7. Social Posts Section

- Platform toggle: Instagram (primary: jhas_industries, 5 most recent posts) + YouTube (3 shorts)
- Instagram posts rendered as cards with displayurl image, caption (120 char truncated), likes, timestamp
- YouTube videos as thumbnail cards with play button overlay → modal iframe embed
- Secondary Instagram handle shown as "Also follow us" link

### 8. Reviews Section

- IndiaMART rating: 4.52 stars displayed with IndiaMART branding
- Other sources shown separately if available (Facebook rating)
- Collect ratings/reviews and display in cards with good modern UI, separate for IndiaMART reviews and any other sources.
- No blended averages

### 9. Footer

- 3-column layout: Logo + business name, quick links, social icons
- Mobile sticky CTA bar (WhatsApp + Call, full width)
- "Powered by IndiaMART" branding

## Design & UI

- Color palette: Choose best modern practice or else use IndiaMART Green (#2EAB5B), Deep Blue (#1A3A6E), Amber (#F5A623) for ratings
- Font: Inter + Segoe UI fallback stack
- Glassmorphism cards, gradient buttons, hover animations (scale, glow, border effects)
- CSS animations for scroll reveals and section transitions
- Framer Motion for smooth entry animations
- Responsive breakpoints: 7 levels from <360px to ≥1280px
- Skeleton/shimmer loaders for pending sections

## Libraries to Install

- `framer-motion` — scroll animations, page transitions
- `lucide-react` — icons (already available)
- `react-intersection-observer` — scroll-spy and lazy loading

## File Structure

- `src/data/sellerData.json` — raw JSON data
- `src/lib/sellerDataExtractor.ts` — data parsing/normalization
- `src/pages/Index.tsx` — main page orchestrator
- `src/components/seller/` — NavBar, HeroSection, AboutSection, ContactSidebar, CategoryGrid, MediaGallery, SocialPosts, ReviewsSection, Footer, MobileCTA, TrustBadges, LightboxModal, VideoModal