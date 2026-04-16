import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, Layers3, Package, ShieldCheck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

const CARD_COLORS = [
  'from-primary/8 to-primary/3',
  'from-secondary/8 to-secondary/3',
  'from-brand-indigo/8 to-brand-indigo/3',
  'from-brand-rose/8 to-brand-rose/3',
  'from-accent/10 to-accent/4',
  'from-primary/6 to-secondary/4',
  'from-secondary/6 to-brand-indigo/4',
  'from-brand-rose/6 to-primary/4',
];

export default function CategoryGrid({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -60]);

  if (!data.indiamartCategories.length && !data.otherCategories.length) return null;

  const featuredCategory = data.indiamartCategories[0];
  const categoryCount = data.indiamartCategories.length + data.otherCategories.length;

  return (
    <section id="categories" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 section-alt">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Layers3 className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">Product Universe</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Product Categories</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Explore our complete range of industrial sealing solutions and security products.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Catalog count</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{categoryCount}</p>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Standout line</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{featuredCategory?.name || 'Security seals'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            {/* Featured card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.65 }}
              className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-card border border-border shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Featured collection</p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{featuredCategory?.name || 'Industrial sealing systems'}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">A curated product showcase featuring our top industrial solutions with premium quality and competitive pricing.</p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-muted/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">IndiaMART listed</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{data.indiamartCategories.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Extended</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{data.otherCategories.length}</p>
                </div>
              </div>

              {data.otherCategories.length > 0 && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Tag className="h-4 w-4 text-secondary" /> Also seen under
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.otherCategories.map((cat) => (
                      <span key={cat.name} className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">{cat.name}</span>
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

            {/* Bento grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {data.indiamartCategories.map((cat, i) => (
                <motion.a
                  key={cat.name}
                  href={data.indiamartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.52, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -6 }}
                  className="group card-3d relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6 bg-card border border-border shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]} opacity-100`} />
                  <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="relative flex h-full flex-col justify-between gap-5 min-h-[140px]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">0{i + 1}</span>
                    </div>

                    <div>
                      <h4 className="max-w-[14rem] font-semibold text-foreground text-base sm:text-lg">{cat.name}</h4>
                      <p className="mt-2 text-xs text-muted-foreground">Tap for product details</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        Supplier listing
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
