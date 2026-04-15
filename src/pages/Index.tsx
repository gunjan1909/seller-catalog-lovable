import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import SplashScreen from '@/components/seller/SplashScreen';
import { extractSellerData } from '@/lib/sellerDataExtractor';

const Index = () => {
  const data = useMemo(() => extractSellerData(), []);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowSplash(false), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="page-shell relative min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen sellerName={data.sellerName} key="splash" />}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
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
            <div className="h-16 md:hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
