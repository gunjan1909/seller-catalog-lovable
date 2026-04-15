import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrustBadges from './TrustBadges';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function HeroSection({ data }: { data: SellerData }) {
  const initials = data.sellerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {data.bannerUrl ? (
          <img
            src={data.bannerUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,58%,27%)] to-[hsl(218,58%,18%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {/* Decorative orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-im-green/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-im-blue/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="shrink-0"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl bg-im-blue flex items-center justify-center">
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
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <h1 className="text-white font-extrabold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}>
              {data.sellerName}
            </h1>
            {data.tagline && (
              <p className="text-white/80 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed line-clamp-3">
                {data.tagline}
              </p>
            )}
            {data.ownerName && (
              <p className="text-white/60 mt-2 text-sm">
                Owner: <span className="text-white/80 font-medium">{data.ownerName}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-5">
              <Button asChild className="rounded-full bg-im-green hover:bg-im-green/90 text-white glow-green px-6">
                <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> View on IndiaMART
                </a>
              </Button>
              {data.website && (
                <Button variant="outline" asChild className="rounded-full border-white/30 text-white hover:bg-white/10 px-6">
                  <a href={data.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" /> Visit Website
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <TrustBadges badges={data.trustBadges} />
        </motion.div>
      </div>
    </section>
  );
}
