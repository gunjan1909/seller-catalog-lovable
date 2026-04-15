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
  const cardY = useTransform(scrollYProgress, [0, 1], [26, -30]);

  if (!data.indiamartRating && !data.fbRating && !data.facebookFollowers && !data.facebookLikes) return null;

  return (
    <section id="reviews" ref={sectionRef} className="py-20 sm:py-28 bg-muted/20 relative overflow-hidden">
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }} className="pointer-events-none absolute right-0 top-8 h-[340px] w-[340px] rounded-full opacity-[0.12] blur-3xl">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-accent/25 to-transparent" />
      </motion.div>
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                </div>
                <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">Social proof</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Ratings & Reviews</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Source-by-source trust indicators with no blended averages, so every platform keeps its own credibility signal.</p>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
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
                className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-8"
                style={{ y: cardY }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-accent/10" />
                <div className="relative">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        <span className="font-bold text-sm">IM</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">IndiaMART</p>
                        <p className="text-xs text-muted-foreground">Marketplace rating</p>
                      </div>
                    </div>
                    <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                      View source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-end gap-4">
                    <span className="text-6xl font-black tracking-tight text-gradient">{data.indiamartRating.toFixed(2)}</span>
                    <span className="pb-2 text-lg text-muted-foreground">/ 5 verified rating</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <StarRating rating={data.indiamartRating} size="lg" />
                    <span className="text-sm text-muted-foreground">Public score captured from seller listing</span>
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
                className="glass rounded-[2rem] p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/14 text-secondary">
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
                    <p className="text-sm leading-6 text-muted-foreground">No public Facebook star rating was detected in the imported dataset, but the page still provides community visibility signals.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Followers</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{data.facebookFollowers || 0}</p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Likes</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{data.facebookLikes || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ delay: 0.32, duration: 0.65 }} className="rounded-[2rem] border border-border/70 bg-card/70 p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Instagram traction</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-4xl font-bold text-foreground">{data.instagramFollowers || 0}</span>
                  <span className="pb-1 text-sm text-muted-foreground">followers</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">The latest feed and follower count are now surfaced alongside ratings so trust remains visible even when some platforms do not publish review stars.</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
