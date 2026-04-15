import { ExternalLink } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

const NAV_LINKS = ['Overview', 'Categories', 'Gallery', 'Social', 'Reviews', 'Contact'];

export default function Footer({ data }: { data: SellerData }) {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-im-green flex items-center justify-center text-white font-bold">
                  {data.sellerName[0]}
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{data.sellerName}</h3>
              </div>
            </div>
            {data.tagline && <p className="text-sm text-background/60 leading-relaxed line-clamp-3">{data.tagline}</p>}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              {NAV_LINKS.map(link => (
                <a key={link} href={`#${link.toLowerCase()}`}
                  className="block text-sm text-background/60 hover:text-background transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="space-y-2">
              {Object.entries(data.socialLinks).map(([platform, url]) =>
                url ? (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors capitalize">
                    <ExternalLink className="w-3.5 h-3.5" /> {platform}
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-background/40">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-im-blue to-im-green flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">IM</span>
            </div>
            Powered by IndiaMART
          </div>
          <p className="text-xs text-background/30">© {new Date().getFullYear()} {data.sellerName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
