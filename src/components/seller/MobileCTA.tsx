import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function MobileCTA({ data }: { data: SellerData }) {
  const whatsappUrl = `https://wa.me/91${data.primaryPhone.replace(/\D/g, '')}`;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-2xl border-t border-border/50 p-2.5"
    >
      <div className="flex gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-lg active:scale-95 transition-transform"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </a>
        <a
          href={`tel:${data.primaryPhone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg active:scale-95 transition-transform"
        >
          <Phone className="w-5 h-5" /> Call
        </a>
      </div>
    </motion.div>
  );
}
