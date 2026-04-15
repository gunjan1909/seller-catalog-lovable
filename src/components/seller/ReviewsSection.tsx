import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, StarHalf, ExternalLink } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className={`${sizes[size]} text-accent fill-accent`} />
      ))}
      {half && <StarHalf className={`${sizes[size]} text-accent fill-accent`} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className={`${sizes[size]} text-muted-foreground/20`} />
      ))}
    </div>
  );
}

export default function ReviewsSection({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  if (!data.indiamartRating && !data.fbRating) return null;

  return (
    <section id="reviews" ref={sectionRef} className="py-20 sm:py-28 bg-muted/20 relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <Star className="w-5 h-5 text-accent fill-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Ratings & Reviews</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {data.indiamartRating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-xl transition-shadow duration-300"
                style={{ y: cardY }}
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">IM</span>
                  </div>
                  <span className="font-semibold text-foreground">IndiaMART</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-bold text-gradient">{data.indiamartRating.toFixed(1)}</span>
                  <span className="text-lg text-muted-foreground mb-1.5">/ 5</span>
                </div>
                <StarRating rating={data.indiamartRating} size="lg" />
                <a
                  href={data.indiamartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View on IndiaMART <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            )}

            {data.fbRating && data.fbRating > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="rounded-2xl border border-border/50 bg-card p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white font-bold text-xs">fb</span>
                  </div>
                  <span className="font-semibold text-foreground">Facebook</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-bold text-foreground">{data.fbRating.toFixed(1)}</span>
                  <span className="text-lg text-muted-foreground mb-1.5">/ 5</span>
                </div>
                <StarRating rating={data.fbRating} size="lg" />
                {data.fbRatingCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-3">{data.fbRatingCount} reviews</p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
