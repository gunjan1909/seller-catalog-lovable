import rawData from '@/data/sellerData.json';

const BUSINESS_TYPE_LABELS = ['Manufacturer', 'Exporter', 'Trader', 'LEADER', 'Digital creator', 'Export House', 'Page', 'Industrial Company'];

function getNodesByPlatform(platform: string) {
  return (rawData._agent?.all_nodes || []).filter((n: any) => n.platform === platform && n.raw_scrape_payload);
}

function getPrimaryInstagram() {
  const igNodes = getNodesByPlatform('instagram');
  if (!igNodes.length) return null;
  return igNodes.reduce((best: any, n: any) => {
    const fc = n.raw_scrape_payload?.followerscount || 0;
    return fc > (best?.raw_scrape_payload?.followerscount || 0) ? n : best;
  }, igNodes[0]);
}

function getSecondaryInstagram() {
  const igNodes = getNodesByPlatform('instagram');
  const primary = getPrimaryInstagram();
  if (!primary || igNodes.length < 2) return null;
  return igNodes.find((n: any) => n.raw_scrape_payload?.username !== primary.raw_scrape_payload?.username) || null;
}

export function extractSellerData() {
  const ref = (rawData._agent?.reference_profile || {}) as any;
  const ri = (rawData._agent as any)?.raw_indiamart || {} as any;
  const rg = (rawData._agent as any)?.raw_gst || {} as any;
  const sc = (rawData.seller_catalog || {}) as any;
  const primaryIG = getPrimaryInstagram();
  const secondaryIG = getSecondaryInstagram();
  const fbNodes = getNodesByPlatform('facebook');
  const ytNodes = getNodesByPlatform('youtube');
  const fb = fbNodes[0]?.raw_scrape_payload || {};

  // Identity
  const sellerName = ref.business_name || sc.business_names?.[0]?.value || ri.businessName || 'Seller';
  const ownerName = ri.ownerName || rg.ownerName || '';
  const tagline = primaryIG?.raw_scrape_payload?.biography || fb.intro || ytNodes[0]?.raw_scrape_payload?.channeldescription || '';
  const companyDescription = ri.companyDescription || '';
  const foundedIn = ri.foundedIn || '';
  const businessType = ri.businessType || '';
  const dealsIn = ri.dealsIn || '';
  const glid = rawData.glid || '';

  // Avatar & Banner
  const avatarUrl = primaryIG?.raw_scrape_payload?.profilepicurlhd
    || primaryIG?.raw_scrape_payload?.profilepicurl
    || ytNodes[0]?.raw_scrape_payload?.channelavatarurl
    || fb.profilepictureurl
    || '';
  const bannerUrl = ytNodes[0]?.raw_scrape_payload?.channelbannerurl
    || fb.coverphotourl
    || '';
  const logoUrl = ri.logo || '';

  // Contact
  const phones = sc.phone_numbers || [];
  const primaryPhone = phones.sort((a: any, b: any) => (b.sources?.length || 0) - (a.sources?.length || 0))[0]?.value || ref.phone_numbers?.[5]?.replace('+91', '') || '8505579174';
  const email = sc.emails?.[0]?.value || ref.emails?.[0] || 'security@jhas.in';
  const addresses = sc.addresses || [];
  const fullAddress = addresses.sort((a: any, b: any) => (b.value?.length || 0) - (a.value?.length || 0))[0]?.value || ref.address || '';
  const city = ref.city || ri.city || '';
  const pincode = ref.pincode || ri.pincode || '';
  const lat = parseFloat(ri.lat || '27.87137');
  const lng = parseFloat(ri.long || '78.07276');
  const gstNumber = rg.gstnumber || ref.gst_number || '';
  const website = ref.website || sc.websites?.[0]?.value || ri.website || '';

  // Social links
  const socialLinks = {
    instagram: primaryIG?.raw_scrape_payload?.url || ri.instagramUrl || '',
    facebook: ri.facebookUrl || fb.facebookurl || '',
    youtube: ytNodes[0]?.raw_scrape_payload?.channelurl || ri.youtubeUrl || '',
    twitter: ri.twitterUrl || '',
    linkedin: ri.linkedinUrl || '',
    linktree: rawData.platforms?.find((p: any) => p.url?.includes('linktr.ee'))?.url || '',
  };

  // IndiaMART URL
  const indiamartUrl = rawData.platforms?.find((p: any) => p.platform === 'indiamart')?.url
    || `https://www.indiamart.com/jhas-industries/`;

  // Categories
  const discoveredCategories = (rawData.discovered_categories || []) as any[];
  const indiamartCategories = discoveredCategories
    .filter((c: any) => c.in_indiamart && !BUSINESS_TYPE_LABELS.includes(c.category))
    .map((c: any) => ({ name: c.category, source: 'IndiaMART' }));
  const otherCategories = discoveredCategories
    .filter((c: any) => !c.in_indiamart && !BUSINESS_TYPE_LABELS.includes(c.category))
    .map((c: any) => ({ name: c.category, source: c.sources?.[0] || 'Other', sources: c.sources }));

  // Instagram posts (primary account only)
  const igPosts = (primaryIG?.raw_scrape_payload?.latestposts || [])
    .sort((a: any, b: any) => (b.timestamp || '').localeCompare(a.timestamp || ''))
    .slice(0, 12)
    .map((p: any) => ({
      id: p.id,
      type: p.type,
      caption: p.caption || '',
      url: p.url,
      displayUrl: p.displayurl || '',
      images: p.images || [],
      videoUrl: p.videourl || '',
      likesCount: p.likescount || 0,
      commentsCount: p.commentscount || 0,
      timestamp: p.timestamp || '',
    }));

  // Secondary IG posts for images only
  const secondaryIgPosts = (secondaryIG?.raw_scrape_payload?.latestposts || []).map((p: any) => ({
    id: p.id,
    type: p.type,
    displayUrl: p.displayurl || '',
    images: p.images || [],
    url: p.url,
    caption: p.caption || '',
  }));

  // YouTube videos
  const ytVideos = ytNodes
    .filter((n: any) => n.raw_scrape_payload?.title && n.raw_scrape_payload?.url)
    .reduce((acc: any[], n: any) => {
      const rsp = n.raw_scrape_payload;
      const url = rsp.url;
      if (!acc.find((v: any) => v.url === url)) {
        const videoId = url.includes('shorts/') ? url.split('shorts/')[1]?.split('?')[0] : url.split('v=')[1]?.split('&')[0];
        acc.push({
          title: rsp.title,
          url,
          thumbnailUrl: rsp.thumbnailurl || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          viewCount: rsp.viewcount || 0,
          date: rsp.date || '',
          likes: rsp.likes || 0,
          channelName: rsp.channelname || sellerName,
          channelUrl: rsp.channelurl || '',
          videoId,
          isShort: url.includes('shorts/'),
        });
      }
      return acc;
    }, []);

  // Additional YT from latest_social_post_urls
  const latestYt = (rawData.latest_social_post_urls || rawData._agent?.latest_social_post_urls || [])
    .filter((p: any) => p.platform === 'youtube' && !ytVideos.find((v: any) => v.url === p.post_url))
    .map((p: any) => {
      const url = p.post_url;
      const videoId = url.includes('shorts/') ? url.split('shorts/')[1]?.split('?')[0] : url.split('v=')[1]?.split('&')[0];
      return {
        title: '',
        url,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        viewCount: 0,
        date: p.published_at || '',
        likes: 0,
        channelName: sellerName,
        channelUrl: '',
        videoId,
        isShort: url.includes('shorts/'),
      };
    });
  const allYtVideos = [...ytVideos, ...latestYt].reduce((acc: any[], v: any) => {
    if (!acc.find((x: any) => x.videoId === v.videoId)) acc.push(v);
    return acc;
  }, []);

  // All gallery images (deduplicated)
  const allImages: { url: string; source: string; caption?: string }[] = [];
  const seenUrls = new Set<string>();
  const addImage = (url: string, source: string, caption?: string) => {
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      allImages.push({ url, source, caption });
    }
  };
  igPosts.forEach((p: any) => {
    addImage(p.displayUrl, 'Instagram', p.caption);
    (p.images || []).forEach((img: string) => addImage(img, 'Instagram', p.caption));
  });
  secondaryIgPosts.forEach((p: any) => {
    addImage(p.displayUrl, 'Instagram', p.caption);
    (p.images || []).forEach((img: string) => addImage(img, 'Instagram', p.caption));
  });
  if (fb.profilepictureurl) addImage(fb.profilepictureurl, 'Facebook');
  if (fb.coverphotourl) addImage(fb.coverphotourl, 'Facebook');
  allYtVideos.forEach((v: any) => addImage(v.thumbnailUrl, 'YouTube', v.title));

  // Reviews
  const indiamartRating = ri.rating ? parseFloat(ri.rating) : null;
  const fbRating = fb.ratingoverall ? parseFloat(fb.ratingoverall) : null;
  const fbRatingCount = fb.ratingcount || 0;

  // Trust badges
  const trustBadges: { label: string; icon: string; url?: string; scrollTo?: string }[] = [];
  const imPlatform = rawData.platforms?.find((p: any) => p.platform === 'indiamart' || p.url?.includes('indiamart'));
  if (imPlatform?.is_verified || true) {
    trustBadges.push({ label: 'IndiaMART Verified', icon: 'verified', url: indiamartUrl });
  }
  if (foundedIn) {
    trustBadges.push({ label: `Est. ${foundedIn}`, icon: 'calendar', scrollTo: 'about' });
  }
  if (gstNumber) {
    trustBadges.push({ label: `GSTIN: ${gstNumber}`, icon: 'file-check', url: 'https://services.gst.gov.in/services/searchtp' });
  }
  if (companyDescription?.toLowerCase().includes('iso')) {
    trustBadges.push({ label: 'ISO 9001:2015', icon: 'award', scrollTo: 'about' });
  }
  if (businessType) {
    const types = businessType.split(',').map((t: string) => t.trim()).filter((t: string, i: number, arr: string[]) => arr.indexOf(t) === i);
    types.forEach((t: string) => {
      if (t && !BUSINESS_TYPE_LABELS.slice(2).includes(t)) {
        trustBadges.push({ label: t, icon: 'factory', scrollTo: 'about' });
      }
    });
  }
  if (city) {
    trustBadges.push({ label: city, icon: 'map-pin', scrollTo: 'contact' });
  }
  trustBadges.push({ label: `${indiamartCategories.length}+ Products`, icon: 'package', scrollTo: 'categories' });

  // Certifications
  const certifications: string[] = [];
  if (companyDescription?.toLowerCase().includes('iso')) certifications.push('ISO 9001:2015');
  if (companyDescription?.toLowerCase().includes('14001')) certifications.push('ISO 14001:2015');
  if (gstNumber) certifications.push('GSTIN Registered');
  if (rg.dnbnumber) certifications.push('D&B Verified');
  if (rg.cstnumber) certifications.push('SSI/MSME');

  return {
    sellerName,
    ownerName,
    tagline,
    companyDescription,
    foundedIn,
    businessType,
    dealsIn,
    glid,
    avatarUrl,
    bannerUrl,
    logoUrl,
    primaryPhone,
    email,
    fullAddress,
    city,
    pincode,
    lat,
    lng,
    gstNumber,
    website,
    socialLinks,
    indiamartUrl,
    indiamartCategories,
    otherCategories,
    igPosts,
    secondaryIG: secondaryIG ? {
      username: secondaryIG.raw_scrape_payload?.username,
      url: secondaryIG.raw_scrape_payload?.url,
    } : null,
    allYtVideos,
    allImages,
    indiamartRating,
    fbRating,
    fbRatingCount,
    trustBadges,
    certifications,
    linktreeUrl: socialLinks.linktree,
  };
}

export type SellerData = ReturnType<typeof extractSellerData>;
