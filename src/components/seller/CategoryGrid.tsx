import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, Layers3, Package, ShieldCheck, Tag, Sparkles } from 'lucide-react';
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

  if (!data.indiamartCategories.length && !data.otherCategories.length) return null;

  const featuredCategory = data.indiamartCategories[0];
  const remainingCategories = data.indiamartCategories.slice(1);
  const categoryCount = data.indiamartCategories.length + data.otherCategories.length;

  return (
    <section id="categories" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 section-alt">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Layers3 className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">Product Universe</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Product Categories</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Explore our complete range of industrial sealing solutions and security products.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Catalog count</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{categoryCount}</p>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Standout line</p>
                <p className="mt-1 text-sm font-semibold text-foreground line-clamp-1 max-w-[10rem]">{featuredCategory?.name || 'Security seals'}</p>
              </div>
            </div>
          </div>

          {/* Featured banner — full width, no empty space */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="relative overflow-hidden rounded-[2rem] bg-card border border-border shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] mb-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-8 p-6 sm:p-8 lg:p-10">
              {/* Left: Featured info */}
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Featured collection</p>
                  </div>
                  <h3 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[2.5rem]">{featuredCategory?.name || 'Industrial sealing systems'}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">A curated product showcase featuring our top industrial solutions with premium quality and competitive pricing.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="rounded-full px-7">
                    <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer">Explore full catalog <ArrowUpRight className="h-4 w-4" /></a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                    <a href="#contact">Request guidance</a>
                  </Button>
                </div>
              </div>

              {/* Right: Stats grid filling the empty space */}
              <div className="grid grid-cols-2 gap-3 content-start">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">IndiaMART listed</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{data.indiamartCategories.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/5 to-transparent p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary mb-3">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Extended</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{data.otherCategories.length}</p>
                </div>
                {data.otherCategories.length > 0 && (
                  <div className="col-span-2 rounded-2xl border border-border bg-muted/40 p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Tag className="h-4 w-4 text-secondary" /> Also seen under
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.otherCategories.slice(0, 6).map((cat) => (
                        <span key={cat.name} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">{cat.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bento grid — full width, balanced */}
          {remainingCategories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {remainingCategories.map((cat, i) => (
                <motion.a
                  key={cat.name}
                  href={data.indiamartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.52, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -6 }}
                  className="group card-3d relative overflow-hidden rounded-[1.5rem] p-5 sm:p-6 bg-card border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full min-h-[180px]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]}`} />
                  <div className="relative flex h-full flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">0{i + 2}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground text-base sm:text-lg leading-snug line-clamp-2">{cat.name}</h4>
                      <p className="mt-1.5 text-xs text-muted-foreground">Tap for product details</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        Supplier listing
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
