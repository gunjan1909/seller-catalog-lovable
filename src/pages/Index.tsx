import { useMemo } from 'react';
import NavBar from '@/components/seller/NavBar';
import HeroSection from '@/components/seller/HeroSection';
import AboutSection from '@/components/seller/AboutSection';
import CategoryGrid from '@/components/seller/CategoryGrid';
import MediaGallery from '@/components/seller/MediaGallery';
import SocialPosts from '@/components/seller/SocialPosts';
import ReviewsSection from '@/components/seller/ReviewsSection';
import ContactSidebar from '@/components/seller/ContactSidebar';
import Footer from '@/components/seller/Footer';
import MobileCTA from '@/components/seller/MobileCTA';
import { extractSellerData } from '@/lib/sellerDataExtractor';

const Index = () => {
  const data = useMemo(() => extractSellerData(), []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar data={data} />
      <HeroSection data={data} />
      <AboutSection data={data} />
      <CategoryGrid data={data} />
      <MediaGallery data={data} />
      <SocialPosts data={data} />
      <ReviewsSection data={data} />
      <ContactSidebar data={data} />
      <Footer data={data} />
      <MobileCTA data={data} />
      {/* Spacer for mobile CTA */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Index;
