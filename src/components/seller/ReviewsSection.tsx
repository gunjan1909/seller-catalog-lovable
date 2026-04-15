import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, StarHalf } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className={`${sizes[size]} text-im-amber fill-im-amber`} />
      ))}
      {half && <StarHalf className={`${sizes[size]} text-im-amber fill-im-amber`} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className={`${sizes[size]} text-muted-foreground/30`} />
      ))}
    </div>
  );
}

export default function ReviewsSection({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  if (!data.indiamartRating && !data.fbRating) return null;

  return (
    <section id="reviews" ref={ref} className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Star className="w-7 h-7 text-im-amber fill-im-amber" />
            Ratings & Reviews
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {/* IndiaMART Rating */}
            {data.indiamartRating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 }}
                className="card-3d rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-im-blue to-im-green flex items-center justify-center">
                    <span className="text-white font-bold text-xs">IM</span>
                  </div>
                  <span className="font-semibold text-foreground">IndiaMART</span>
                </div>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-foreground">{data.indiamartRating.toFixed(1)}</span>
                  <span className="text-lg text-muted-foreground mb-1">/ 5</span>
                </div>
                <StarRating rating={data.indiamartRating} size="lg" />
                <a
                  href={data.indiamartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-im-blue hover:underline"
                >
                  View on IndiaMART →
                </a>
              </motion.div>
            )}

            {/* Facebook Rating */}
            {data.fbRating && data.fbRating > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="card-3d rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white font-bold text-xs">fb</span>
                  </div>
                  <span className="font-semibold text-foreground">Facebook</span>
                </div>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-foreground">{data.fbRating.toFixed(1)}</span>
                  <span className="text-lg text-muted-foreground mb-1">/ 5</span>
                </div>
                <StarRating rating={data.fbRating} size="lg" />
                {data.fbRatingCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{data.fbRatingCount} reviews</p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
