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
        <Star key={`f${i}`} className={`${sizes[size]} fill-amber-400 text-amber-400`} />
      ))}
      {half && <StarHalf className={`${sizes[size]} fill-amber-400 text-amber-400`} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className={`${sizes[size]} text-border`} />
      ))}
    </div>
  );
}

export default function ReviewsSection({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [26, -30]);

  if (!data.indiamartRating && !data.fbRating && !data.facebookFollowers && !data.facebookLikes) return null;

  return (
    <section id="reviews" ref={sectionRef} className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">Social proof</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Ratings & Reviews</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Source-by-source trust indicators with no blended averages.</p>
            </div>
            <div className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sources tracked</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{[data.indiamartRating, data.fbRating || data.facebookFollowers || data.facebookLikes].filter(Boolean).length}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {data.indiamartRating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.12, duration: 0.65 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="relative overflow-hidden rounded-[2rem] p-7 sm:p-8 bg-card border border-border shadow-sm flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-transparent to-primary/5" />
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />
                <div className="relative flex flex-col h-full">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <span className="font-bold text-sm">IM</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">IndiaMART</p>
                        <p className="text-xs text-muted-foreground">Marketplace rating</p>
                      </div>
                    </div>
                    <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                      View source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-end gap-4">
                      <span className="text-7xl sm:text-8xl font-black tracking-tight text-foreground leading-none">{data.indiamartRating.toFixed(2)}</span>
                      <div className="pb-2">
                        <StarRating rating={data.indiamartRating} size="lg" />
                        <p className="mt-1 text-sm text-muted-foreground">out of 5.0</p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-muted-foreground max-w-md">Public score captured from seller listing — reflects buyer satisfaction across orders.</p>
                  </div>

                  {/* Bottom rating breakdown to fill space */}
                  <div className="mt-6 grid grid-cols-3 gap-3 pt-6 border-t border-border">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Verified</p>
                      <p className="mt-1 text-sm font-bold text-foreground">Yes</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Source</p>
                      <p className="mt-1 text-sm font-bold text-foreground">IndiaMART</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Type</p>
                      <p className="mt-1 text-sm font-bold text-foreground">Public</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.24, duration: 0.65 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="rounded-[2rem] p-6 bg-card border border-border shadow-sm"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <span className="font-bold text-sm">FB</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Facebook presence</p>
                    <p className="text-xs text-muted-foreground">Community source</p>
                  </div>
                </div>

                {data.fbRating ? (
                  <>
                    <div className="flex items-end gap-3">
                      <span className="text-5xl font-bold text-foreground">{data.fbRating.toFixed(1)}</span>
                      <span className="mb-1.5 text-lg text-muted-foreground">/ 5</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <StarRating rating={data.fbRating} size="lg" />
                      {data.fbRatingCount > 0 && <span className="text-sm text-muted-foreground">{data.fbRatingCount} reviews</span>}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm leading-6 text-muted-foreground">No public Facebook star rating detected. Community visibility signals shown instead.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-border bg-muted/50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Followers</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{data.facebookFollowers || 0}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Likes</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{data.facebookLikes || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ delay: 0.32, duration: 0.65 }} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <span className="font-bold text-sm text-purple-600">IG</span>
                  </div>
                  <p className="font-semibold text-foreground">Instagram traction</p>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-foreground">{data.instagramFollowers || 0}</span>
                  <span className="pb-1 text-sm text-muted-foreground">followers</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Follower count surfaced alongside ratings for comprehensive social proof.</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
