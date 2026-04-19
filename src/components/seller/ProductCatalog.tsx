import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShoppingBag, MessageCircle, ExternalLink } from 'lucide-react';
import CategoryFilterBar from './CategoryFilterBar';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import type { SellerData, CatalogProduct } from '@/lib/sellerDataExtractor';

export default function ProductCatalog({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.04 });
  const [activeCat, setActiveCat] = useState<string>('All');
  const [selected, setSelected] = useState<CatalogProduct | null>(null);

  const filtered = useMemo(() => {
    if (activeCat === 'All') return data.products;
    return data.products.filter(p => p.category === activeCat);
  }, [activeCat, data.products]);

  if (!data.products.length) return null;

  const enquireBase = data.whatsappUrl
    ? `${data.whatsappUrl}${data.whatsappUrl.includes('?') ? '&' : '?'}text=`
    : data.primaryPhone
      ? `https://wa.me/91${data.primaryPhone}?text=`
      : '';

  const enquireAll = enquireBase
    ? `${enquireBase}${encodeURIComponent(`Hi ${data.sellerName}, I'm interested in your product range. Please share more details.`)}`
    : data.email ? `mailto:${data.email}?subject=Product%20Enquiry` : data.indiamartUrl;

  const enquireFor = (p: CatalogProduct) => enquireBase
    ? `${enquireBase}${encodeURIComponent(`Hi ${data.sellerName}, I would like to enquire about: ${p.name}`)}`
    : data.email ? `mailto:${data.email}?subject=Enquiry: ${encodeURIComponent(p.name)}` : data.indiamartUrl;

  return (
    <section id="products" ref={ref} className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.04),transparent_40%),radial-gradient(circle_at_90%_80%,hsl(var(--accent)/0.05),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Catalog
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Our Products</h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
              Browse {data.products.length} products across {data.categories.length} categories. Tap any product for full specifications.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={enquireAll}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Enquire all
            </a>
            <a
              href={data.indiamartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all"
            >
              <ExternalLink className="w-4 h-4" /> View on IndiaMART
            </a>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <CategoryFilterBar
            categories={data.categories}
            active={activeCat}
            onChange={setActiveCat}
            totalCount={data.products.length}
          />
        </motion.div>

        {/* Grid */}
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={() => setSelected(p)}
              enquireHref={enquireFor(p)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No products in this category.</p>
        )}
      </div>

      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
        enquireHref={selected ? enquireFor(selected) : ''}
      />
    </section>
  );
}
