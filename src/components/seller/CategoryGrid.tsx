import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Package, ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

const CATEGORY_COLORS = [
  'from-blue-500/10 to-cyan-500/10 border-blue-200 hover:border-blue-400',
  'from-green-500/10 to-emerald-500/10 border-green-200 hover:border-green-400',
  'from-purple-500/10 to-pink-500/10 border-purple-200 hover:border-purple-400',
  'from-amber-500/10 to-orange-500/10 border-amber-200 hover:border-amber-400',
  'from-rose-500/10 to-red-500/10 border-rose-200 hover:border-rose-400',
  'from-teal-500/10 to-cyan-500/10 border-teal-200 hover:border-teal-400',
  'from-indigo-500/10 to-blue-500/10 border-indigo-200 hover:border-indigo-400',
  'from-lime-500/10 to-green-500/10 border-lime-200 hover:border-lime-400',
];

export default function CategoryGrid({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  if (!data.indiamartCategories.length && !data.otherCategories.length) return null;

  return (
    <section id="categories" ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Package className="w-7 h-7 text-im-blue" />
            Product Categories
          </h2>
          <p className="text-muted-foreground mb-8">Explore our range of products</p>

          {/* IndiaMART Categories */}
          {data.indiamartCategories.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-im-green" />
                IndiaMART Products ({data.indiamartCategories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                {data.indiamartCategories.map((cat, i) => (
                  <motion.a
                    key={cat.name}
                    href={data.indiamartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className={`card-3d group relative rounded-2xl border bg-gradient-to-br p-5 cursor-pointer
                      ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <Package className="w-8 h-8 text-im-blue mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="font-semibold text-foreground text-sm">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">View on IndiaMART →</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </>
          )}

          {/* Other Categories */}
          {data.otherCategories.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-im-amber" />
                Other Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {data.otherCategories.map((cat, i) => (
                  <div
                    key={cat.name}
                    className="card-3d rounded-2xl border bg-card p-5"
                  >
                    <h4 className="font-semibold text-foreground text-sm">{cat.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Source: {cat.source}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="text-center">
            <Button asChild className="rounded-full bg-im-green hover:bg-im-green/90 text-white px-8">
              <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> View All on IndiaMART
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
