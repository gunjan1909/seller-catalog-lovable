import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  const initials = data.sellerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-2xl shadow-[0_1px_12px_-4px_rgba(0,0,0,0.08)] border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-2.5 shrink-0 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md"
            >
              <span className="text-primary-foreground font-bold text-sm">{initials}</span>
            </motion.div>
            <span className={`font-bold text-lg hidden sm:block transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}>
              {data.sellerName.split(' ')[0]}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 bg-card/60 backdrop-blur-lg rounded-full p-1 border border-border/60 shadow-sm">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-primary-foreground'
                    : scrolled
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-primary shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild
              className={`rounded-full transition-all duration-300 ${!scrolled ? 'border-white/30 text-white hover:bg-white/10' : ''}`}>
              <a href={contactHref}><Phone className="w-4 h-4 mr-1" /> Contact</a>
            </Button>
            <Button size="sm" asChild className="rounded-full">
              <a href={quoteHref}><MessageSquare className="w-4 h-4 mr-1" /> Get Quote</a>
            </Button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
              : <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            }
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-card/98 backdrop-blur-2xl border-t border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="sm" asChild className="flex-1 rounded-full">
                  <a href={contactHref}><Phone className="w-4 h-4 mr-1" /> Contact</a>
                </Button>
                <Button size="sm" asChild className="flex-1 rounded-full">
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
