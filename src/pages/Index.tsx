import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import NavBar from '@/components/seller/NavBar';
import HeroSection from '@/components/seller/HeroSection';
import AboutSection from '@/components/seller/AboutSection';
import ProductCatalog from '@/components/seller/ProductCatalog';
// CategoryGrid removed — categories now live as filter chips in ProductCatalog
import MediaGallery from '@/components/seller/MediaGallery';
import SocialPosts from '@/components/seller/SocialPosts';
import ReviewsSection from '@/components/seller/ReviewsSection';
import ContactSidebar from '@/components/seller/ContactSidebar';
import Footer from '@/components/seller/Footer';
import MobileCTA from '@/components/seller/MobileCTA';
import SplashScreen from '@/components/seller/SplashScreen';
import { extractSellerData, extractSellerDataFromRaw } from '@/lib/sellerDataExtractor';
import { loadSellerRawDataByGlid } from '@/lib/sellerDataLoader';

const Index = () => {
  const { glid } = useParams();
  const [rawSellerData, setRawSellerData] = useState<unknown | null>(null);
  const [isLoadingSellerData, setIsLoadingSellerData] = useState(false);
  const [hasDataLoadError, setHasDataLoadError] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const data = useMemo(() => {
    if (rawSellerData) {
      return extractSellerDataFromRaw(rawSellerData);
    }

    return glid ? null : extractSellerData();
  }, [glid, rawSellerData]);

  useEffect(() => {
    let active = true;

    if (!glid) {
      setRawSellerData(null);
      setHasDataLoadError(false);
      setIsLoadingSellerData(false);
      return () => {
        active = false;
      };
    }

    setIsLoadingSellerData(true);
    setHasDataLoadError(false);
    setRawSellerData(null);

    loadSellerRawDataByGlid(glid)
      .then((loadedData) => {
        if (!active) return;
        if (!loadedData) {
          setHasDataLoadError(true);
          return;
        }
        setRawSellerData(loadedData);
      })
      .catch(() => {
        if (active) {
          setHasDataLoadError(true);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingSellerData(false);
        }
      });

    return () => {
      active = false;
    };
  }, [glid]);

  useEffect(() => {
    if (!data) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShowSplash(true);
    const timeout = window.setTimeout(() => setShowSplash(false), reduced ? 600 : 1500);
    return () => window.clearTimeout(timeout);
  }, [data]);

  if (isLoadingSellerData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
        <p className="text-lg text-muted-foreground">Loading seller catalog...</p>
      </div>
    );
  }

  if (hasDataLoadError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Seller not found</h1>
          <p className="mt-2 text-muted-foreground">
            No catalog data found for this GLID.
          </p>
          <Link to="/" className="mt-4 inline-block text-primary underline hover:text-primary/90">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

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
            <ProductCatalog data={data} />
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
