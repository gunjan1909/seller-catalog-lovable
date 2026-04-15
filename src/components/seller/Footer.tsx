import { motion } from 'framer-motion';
import { ExternalLink, ArrowUp } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

const NAV_LINKS = ['Overview', 'Categories', 'Gallery', 'Social', 'Reviews', 'Contact'];

export default function Footer({ data }: { data: SellerData }) {
  return (
    <footer className="relative bg-brand-charcoal text-white/90 pt-16 pb-8 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-bold text-sm text-primary-foreground">
                  {data.sellerName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <h3 className="font-bold text-xl">{data.sellerName}</h3>
            </div>
            {data.tagline && <p className="text-sm text-white/50 leading-relaxed line-clamp-3 max-w-xs">{data.tagline}</p>}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/70 text-sm uppercase tracking-wider">Navigate</h4>
            <div className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  whileHover={{ x: 4 }}
                  className="block text-sm text-white/50 hover:text-white transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/70 text-sm uppercase tracking-wider">Connect</h4>
            <div className="space-y-2.5">
              {Object.entries(data.socialLinks).map(([platform, url]) =>
                url ? (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors capitalize"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> {platform}
                  </motion.a>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} {data.sellerName}. All rights reserved.</p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -3 }}
            className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
