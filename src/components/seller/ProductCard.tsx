import { motion } from 'framer-motion';
import { ImageIcon, MessageCircle, CheckCircle2 } from 'lucide-react';
import { type CatalogProduct, formatPrice } from '@/lib/sellerDataExtractor';

interface Props {
  product: CatalogProduct;
  onOpen: () => void;
  enquireHref: string;
}

export default function ProductCard({ product, onOpen, enquireHref }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
        {product.primaryPhoto ? (
          <img
            src={product.primaryPhoto}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              t.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`fallback absolute inset-0 flex items-center justify-center text-muted-foreground ${product.primaryPhoto ? 'hidden' : ''}`}>
          <ImageIcon className="w-10 h-10" />
        </div>

        {/* Stock badge */}
        {product.inStock && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3" /> In stock
          </span>
        )}
        {/* Category chip */}
        <span className="absolute top-3 right-3 rounded-full bg-card/90 backdrop-blur border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-bold text-foreground leading-snug line-clamp-2 min-h-[2.6em]">{product.name}</h3>

        {product.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {product.description.length > 110 ? product.description.slice(0, 110) + '…' : product.description}
          </p>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-semibold">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Price</p>
            <p className="font-bold text-foreground text-sm leading-tight">{formatPrice(product)}</p>
          </div>
          <a
            href={enquireHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3.5 py-2 text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Enquire
          </a>
        </div>
      </div>
    </motion.article>
  );
}
