import { motion } from 'framer-motion';
import { ExternalLink, ArrowUp } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

const NAV_LINKS = ['Overview', 'Categories', 'Gallery', 'Social', 'Reviews', 'Contact'];

export default function Footer({ data }: { data: SellerData }) {
  const initials = data.sellerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <footer className="relative bg-foreground text-background pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
                <span className="font-bold text-sm text-primary-foreground">{initials}</span>
              </div>
              <h3 className="font-bold text-xl">{data.sellerName}</h3>
            </div>
            {data.tagline && <p className="text-sm opacity-50 leading-relaxed line-clamp-3 max-w-xs">{data.tagline}</p>}
          </div>

          <div>
            <h4 className="font-semibold mb-4 opacity-60 text-sm uppercase tracking-wider">Navigate</h4>
            <div className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  whileHover={{ x: 4 }}
                  className="block text-sm opacity-50 hover:opacity-100 transition-opacity"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 opacity-60 text-sm uppercase tracking-wider">Connect</h4>
            <div className="space-y-2.5">
              {Object.entries(data.socialLinks).map(([platform, url]) =>
                url ? (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity capitalize"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> {platform}
                  </motion.a>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-30">© {new Date().getFullYear()} {data.sellerName}. All rights reserved.</p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ y: -3 }}
            className="flex items-center gap-2 text-xs opacity-30 hover:opacity-60 transition-opacity"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
