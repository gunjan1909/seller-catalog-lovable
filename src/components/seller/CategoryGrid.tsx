import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Package, ExternalLink, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

const CARD_GRADIENTS = [
  'from-orange-500/8 to-amber-500/8 hover:from-orange-500/15 hover:to-amber-500/15',
  'from-teal-500/8 to-emerald-500/8 hover:from-teal-500/15 hover:to-emerald-500/15',
  'from-violet-500/8 to-purple-500/8 hover:from-violet-500/15 hover:to-purple-500/15',
  'from-rose-500/8 to-pink-500/8 hover:from-rose-500/15 hover:to-pink-500/15',
  'from-sky-500/8 to-cyan-500/8 hover:from-sky-500/15 hover:to-cyan-500/15',
  'from-lime-500/8 to-green-500/8 hover:from-lime-500/15 hover:to-green-500/15',
  'from-fuchsia-500/8 to-pink-500/8 hover:from-fuchsia-500/15 hover:to-pink-500/15',
  'from-amber-500/8 to-yellow-500/8 hover:from-amber-500/15 hover:to-yellow-500/15',
];

const ICONS = ['🔒', '🔩', '📦', '🏷️', '⚡', '🛡️', '🔗', '💎', '🔧', '📋', '🔐', '⭐', '🏭', '🎯', '💼', '🌐'];

export default function CategoryGrid({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  if (!data.indiamartCategories.length && !data.otherCategories.length) return null;

  return (
    <section id="categories" ref={sectionRef} className="py-20 sm:py-28 relative overflow-hidden">
      {/* Parallax decorative bg */}
      <motion.div style={{ y: bgY }} className="absolute -left-32 top-20 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary to-accent" />
      </motion.div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Product Categories
            </h2>
          </div>
          <p className="text-muted-foreground mb-10 ml-[52px]">Explore our comprehensive range of products</p>

          {data.indiamartCategories.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Featured Products <span className="text-muted-foreground font-normal">({data.indiamartCategories.length})</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
                {data.indiamartCategories.map((cat, i) => (
                  <motion.a
                    key={cat.name}
                    href={data.indiamartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 25, scale: 0.95 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className={`group relative rounded-2xl bg-gradient-to-br border border-border/50 p-5 cursor-pointer transition-all duration-300
                      hover:shadow-[0_20px_50px_-15px_hsl(var(--brand-warm)/0.15)] hover:border-primary/20
                      ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}
                  >
                    <span className="text-2xl mb-3 block">{ICONS[i % ICONS.length]}</span>
                    <h4 className="font-semibold text-foreground text-sm leading-tight">{cat.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 group-hover:text-primary transition-colors">
                      Explore <ExternalLink className="w-3 h-3" />
                    </p>
                  </motion.a>
                ))}
              </div>
            </>
          )}

          {data.otherCategories.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <Tag className="w-4 h-4 text-accent" />
                <h3 className="text-base font-semibold text-foreground">Other Categories</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                {data.otherCategories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-3"
                  >
                    <div className="w-2 h-8 rounded-full bg-gradient-to-b from-accent to-secondary shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{cat.name}</h4>
                      <p className="text-[11px] text-muted-foreground">via {typeof cat.source === 'string' ? cat.source.replace(/https?:\/\//, '').split('/')[0] : 'External'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-warm">
              <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> View All Products
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
