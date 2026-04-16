import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Globe, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrustBadges from './TrustBadges';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function HeroSection({ data }: { data: SellerData }) {
  const initials = data.sellerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden">
      {/* Ken Burns background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {data.bannerUrl ? (
          <img
            src={data.bannerUrl}
            alt=""
            className="w-full h-full object-cover animate-ken-burns"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/60" />
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32"
        style={{ y: textY, opacity }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary to-secondary opacity-40 blur-lg animate-pulse-glow" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt={data.sellerName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.querySelector('.fallback')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`fallback text-white font-bold text-3xl ${data.avatarUrl ? 'hidden' : ''}`}>
                  {initials}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex-1"
          >
            <motion.h1
              className="text-white font-extrabold leading-tight drop-shadow-lg"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
            >
              {data.sellerName}
            </motion.h1>
            {data.tagline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white/80 mt-3 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3"
              >
                {data.tagline}
              </motion.p>
            )}
            {data.ownerName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/60 mt-2 text-sm"
              >
                Founded by <span className="text-white/80 font-medium">{data.ownerName}</span>
              </motion.p>
            )}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <Button asChild className="rounded-full px-6 h-11 bg-white text-foreground hover:bg-white/90 shadow-lg font-semibold">
                <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> View Profile
                </a>
              </Button>
              {data.website && (
                <Button variant="outline" asChild className="rounded-full border-white/30 text-white hover:bg-white/10 px-6 h-11 backdrop-blur-sm">
                  <a href={data.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" /> Website
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-10"
        >
          <TrustBadges badges={data.trustBadges} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/40"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
