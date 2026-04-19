import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, Layers3, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

const CARD_COLORS = [
  'from-primary/8 to-primary/3',
  'from-secondary/8 to-secondary/3',
  'from-amber-200/30 to-transparent',
  'from-rose-200/25 to-transparent',
  'from-indigo-200/30 to-transparent',
  'from-emerald-200/30 to-transparent',
];

export default function CategoryGrid({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const sectionRef = useRef<HTMLElement>(null);

  if (!data.categories.length) return null;

  const featured = data.categories[0];
  const remaining = data.categories.slice(1);

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" ref={sectionRef} className="relative overflow-hidden py-20 sm:py-28 section-alt">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Layers3 className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">Browse by category</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Product Categories</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{data.categories.length} categories spanning {data.products.length} products. Tap to filter the catalog.</p>
            </div>
          </div>

          {/* Featured */}
          <motion.button
            type="button"
            onClick={scrollToProducts}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.65 }}
            whileHover={{ y: -4 }}
            className="block w-full text-left relative overflow-hidden rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-lg transition-all mb-6 group"
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-8 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Top category</p>
                  </div>
                  <h3 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[2.5rem]">{featured.name}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                    {featured.count} product{featured.count > 1 ? 's' : ''} in this category. Filter the catalog instantly.
                  </p>
                </div>
                <div>
                  <Button asChild size="lg" className="rounded-full px-7">
                    <a onClick={(e) => { e.preventDefault(); scrollToProducts(); }} href="#products">
                      Browse catalog <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 content-start">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total products</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{data.products.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/5 to-transparent p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Categories</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{data.categories.length}</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-border bg-muted/40 p-5">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">All categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.categories.map((c) => (
                      <span key={c.name} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground font-medium">
                        {c.name} <span className="text-muted-foreground">({c.count})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.button>

          {remaining.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {remaining.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  type="button"
                  onClick={scrollToProducts}
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="card-3d relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-card border border-border shadow-sm hover:shadow-lg transition-all flex flex-col gap-4 min-h-[170px] text-left"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]} opacity-60`} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">0{i + 2}</span>
                  </div>
                  <div className="relative mt-auto">
                    <h4 className="font-bold text-foreground text-base sm:text-lg leading-snug line-clamp-2">{cat.name}</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">{cat.count} product{cat.count > 1 ? 's' : ''}</span>
                      <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
