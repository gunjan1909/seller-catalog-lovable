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
          <button
            key={i}
            onClick={() => handleClick(badge)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              bg-white/10 backdrop-blur-md border border-white/20 text-white
              hover:bg-white/20 hover:border-white/40 hover:scale-105
              transition-all duration-200 cursor-pointer"
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{badge.label}</span>
          </button>
        );
      })}
    </div>
  );
}
