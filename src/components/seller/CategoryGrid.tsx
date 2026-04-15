import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, Layers3, Package, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

const CARD_TONES = [
  'from-primary/18 via-primary/6 to-transparent',
  'from-secondary/18 via-secondary/8 to-transparent',
  'from-accent/16 via-accent/6 to-transparent',
  'from-brand-rose/18 via-brand-rose/8 to-transparent',
  'from-primary/12 via-secondary/8 to-transparent',
  'from-secondary/14 via-accent/6 to-transparent',
  'from-accent/14 via-primary/6 to-transparent',
  'from-brand-rose/14 via-accent/6 to-transparent',
];

const ICONS = ['🔒', '🔩', '📦', '🏷️', '⚡', '🛡️', '🔗', '💎', '🔧', '📋', '🔐', '⭐', '🏭', '🎯', '💼', '🌐'];
const SPANS = ['sm:col-span-2 sm:row-span-2', 'sm:col-span-1', 'sm:col-span-1', 'sm:col-span-2', 'sm:col-span-1', 'sm:col-span-1 sm:row-span-2', 'sm:col-span-2', 'sm:col-span-1'];

export default function CategoryGrid({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -60]);

  if (!data.indiamartCategories.length && !data.otherCategories.length) return null;

  const featuredCategory = data.indiamartCategories[0];
  const categoryCount = data.indiamartCategories.length + data.otherCategories.length;

  return (
    <section id="categories" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28">
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute -left-20 top-16 h-[420px] w-[420px] rounded-full opacity-[0.16] blur-3xl">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-secondary/35 to-transparent" />
      </motion.div>
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 60]) }} className="pointer-events-none absolute right-0 top-1/3 h-[360px] w-[360px] rounded-full opacity-[0.12] blur-3xl">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/35 to-transparent" />
      </motion.div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/15 to-accent/10">
                  <Layers3 className="h-5 w-5 text-secondary" />
                </div>
                <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">Product Universe</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Product Categories</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">A sharper, editorial view of JHAS Industries&rsquo; sealing range with premium hierarchy and stronger mobile scanning.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Catalog count</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{categoryCount}</p>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Standout line</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{featuredCategory?.name || 'Security seals'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.08, duration: 0.65 }} className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Featured collection</p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{featuredCategory?.name || 'Industrial sealing systems'}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">Built to feel less like a plain grid and more like a curated product showcase with depth, contrast, and stronger CTA visibility.</p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">IndiaMART listed</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{data.indiamartCategories.length}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Extended taxonomy</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{data.otherCategories.length}</p>
                </div>
              </div>

              {data.otherCategories.length > 0 && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Tag className="h-4 w-4 text-accent" /> Also seen under
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.otherCategories.map((cat) => (
                      <span key={cat.name} className="rounded-full border border-border/70 bg-muted/45 px-3 py-1.5 text-xs text-muted-foreground">{cat.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-7">
                  <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer">Explore full catalog <ArrowUpRight className="h-4 w-4" /></a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                  <a href="#contact">Request product guidance</a>
                </Button>
              </div>
            </motion.div>

            <div className="grid auto-rows-[minmax(150px,1fr)] grid-cols-1 gap-4 sm:grid-cols-2">
              {data.indiamartCategories.map((cat, i) => {
                const isHeroTile = i === 0;
                return (
                  <motion.a
                    key={cat.name}
                    href={data.indiamartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 25, scale: 0.96 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.52, ease: [0.25, 0.1, 0.25, 1] }}
                    whileHover={{ y: -8, rotateX: 1.5, rotateY: -1.5 }}
                    className={`group glass card-3d relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6 ${SPANS[i % SPANS.length]}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${CARD_TONES[i % CARD_TONES.length]} opacity-100 transition-opacity duration-300`} />
                    <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="relative flex h-full flex-col justify-between gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-background/45 text-2xl ${isHeroTile ? 'sm:h-14 sm:w-14 sm:text-3xl' : ''}`}>{ICONS[i % ICONS.length]}</span>
                        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">0{i + 1}</span>
                      </div>

                      <div>
                        <h4 className={`max-w-[14rem] font-semibold text-foreground ${isHeroTile ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>{cat.name}</h4>
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                          <Sparkles className="h-3.5 w-3.5 text-accent" />
                          <span>Tap through for product details</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground">
                          <Package className="h-3.5 w-3.5 text-primary" /> Supplier listing
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
