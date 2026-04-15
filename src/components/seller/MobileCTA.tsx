import { Phone, MessageCircle } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function MobileCTA({ data }: { data: SellerData }) {
  const whatsappUrl = `https://wa.me/91${data.primaryPhone.replace(/\D/g, '')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border p-2">
      <div className="flex gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </a>
        <a
          href={`tel:${data.primaryPhone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-im-blue text-white font-semibold text-sm"
        >
          <Phone className="w-5 h-5" /> Call
        </a>
      </div>
    </div>
  );
}
