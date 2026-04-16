import { motion } from 'framer-motion';
import { BadgeCheck, Calendar, FileCheck, Award, Factory, MapPin, Package } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  verified: BadgeCheck,
  calendar: Calendar,
  'file-check': FileCheck,
  award: Award,
  factory: Factory,
  'map-pin': MapPin,
  package: Package,
};

interface Badge {
  label: string;
  icon: string;
  url?: string;
  scrollTo?: string;
}

export default function TrustBadges({ badges }: { badges: Badge[] }) {
  const handleClick = (badge: Badge) => {
    if (badge.url) {
      window.open(badge.url, '_blank', 'noopener,noreferrer');
    } else if (badge.scrollTo) {
      document.getElementById(badge.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, i) => {
        const Icon = ICON_MAP[badge.icon] || BadgeCheck;
        return (
          <motion.button
            key={i}
            onClick={() => handleClick(badge)}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.06 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium
              bg-white/15 backdrop-blur-xl border border-white/20 text-white/95
              hover:bg-white/25 hover:border-white/40
              transition-colors duration-300 cursor-pointer shadow-sm"
          >
            <Icon className="w-3.5 h-3.5 text-accent" />
            <span className="whitespace-nowrap">{badge.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
