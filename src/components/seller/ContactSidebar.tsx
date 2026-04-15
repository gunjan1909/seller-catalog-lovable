import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData } from '@/lib/sellerDataExtractor';

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  if (!url) return null;
  const labels: Record<string, string> = {
    instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube',
    twitter: 'X / Twitter', linkedin: 'LinkedIn',
  };
  const colors: Record<string, string> = {
    instagram: 'hover:text-pink-500', facebook: 'hover:text-[#1877F2]',
    youtube: 'hover:text-red-500', twitter: 'hover:text-foreground', linkedin: 'hover:text-[#0A66C2]',
  };
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground ${colors[platform] || ''} hover:border-current transition-colors`}
      title={labels[platform] || platform}
    >
      <span className="text-xs font-bold uppercase">{platform.slice(0, 2)}</span>
    </a>
  );
}

export default function ContactSidebar({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const whatsappUrl = `https://wa.me/91${data.primaryPhone.replace(/\D/g, '')}?text=Hi, I found your profile on IndiaMART and I'm interested in your products.`;

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Phone className="w-7 h-7 text-im-blue" />
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="space-y-5">
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white h-12 text-base">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </a>
                </Button>
                <Button asChild className="flex-1 rounded-full bg-im-blue hover:bg-im-blue-light text-white h-12 text-base">
                  <a href={`tel:${data.primaryPhone}`}>
                    <Phone className="w-5 h-5 mr-2" /> Call Now
                  </a>
                </Button>
              </div>

              <div className="glass rounded-2xl p-6 space-y-4">
                {data.primaryPhone && (
                  <a href={`tel:${data.primaryPhone}`} className="flex items-center gap-3 text-foreground hover:text-im-blue transition-colors">
                    <Phone className="w-5 h-5 text-im-green shrink-0" />
                    <span className="text-sm">+91 {data.primaryPhone}</span>
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-foreground hover:text-im-blue transition-colors">
                    <Mail className="w-5 h-5 text-im-green shrink-0" />
                    <span className="text-sm">{data.email}</span>
                  </a>
                )}
                {data.fullAddress && (
                  <div className="flex items-start gap-3 text-foreground">
                    <MapPin className="w-5 h-5 text-im-green shrink-0 mt-0.5" />
                    <span className="text-sm">{data.fullAddress}{data.city ? `, ${data.city}` : ''}{data.pincode ? ` - ${data.pincode}` : ''}</span>
                  </div>
                )}
                {data.website && (
                  <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-im-blue transition-colors">
                    <Globe className="w-5 h-5 text-im-green shrink-0" />
                    <span className="text-sm">{data.website.replace(/https?:\/\//, '').replace(/\/$/, '')}</span>
                  </a>
                )}
              </div>

              {/* Social */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.socialLinks).map(([platform, url]) => (
                  <SocialIcon key={platform} platform={platform} url={url} />
                ))}
              </div>

              {/* Directory links */}
              <div className="flex flex-wrap gap-2">
                <a href={data.indiamartUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-border hover:border-im-green hover:text-im-green transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> IndiaMART Profile
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border h-80 md:h-auto min-h-[300px]">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${data.lng}!3d${data.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
