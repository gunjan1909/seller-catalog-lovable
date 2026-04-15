import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

const NAV_LINKS = [
  { label: 'Overview', href: '#hero' },
  { label: 'Categories', href: '#categories' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Social', href: '#social' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export default function NavBar({ data }: { data: SellerData }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_LINKS.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const contactHref = `tel:${data.primaryPhone}`;
  const quoteHref = data.email ? `mailto:${data.email}?subject=Quote Request` : `https://wa.me/91${data.primaryPhone}`;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-im-blue to-im-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">IM</span>
            </div>
            <span className={`font-bold text-lg hidden sm:block ${scrolled ? 'text-foreground' : 'text-white'}`}>
              IndiaMART
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? 'bg-im-green text-white shadow-md'
                    : scrolled
                    ? 'text-foreground hover:bg-muted'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild
              className={`rounded-full ${!scrolled ? 'border-white/30 text-white hover:bg-white/10' : ''}`}>
              <a href={contactHref}><Phone className="w-4 h-4 mr-1" /> Contact</a>
            </Button>
            <Button size="sm" asChild className="rounded-full bg-im-green hover:bg-im-green/90 text-white glow-green">
              <a href={quoteHref}><MessageSquare className="w-4 h-4 mr-1" /> Get Quote</a>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
              : <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'bg-im-green text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1 rounded-full">
                  <a href={contactHref}><Phone className="w-4 h-4 mr-1" /> Contact</a>
                </Button>
                <Button size="sm" asChild className="flex-1 rounded-full bg-im-green text-white">
                  <a href={quoteHref}><MessageSquare className="w-4 h-4 mr-1" /> Quote</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
