import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Globe, Instagram, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SellerData, SocialPlatform } from '@/lib/sellerDataExtractor';

const PLATFORM_META: Record<SocialPlatform, { icon: any; gradient: string }> = {
  instagram: { icon: Instagram, gradient: 'from-purple-500 via-pink-500 to-orange-400' },
  facebook: { icon: Facebook, gradient: 'from-blue-600 to-blue-500' },
  youtube: { icon: Youtube, gradient: 'from-red-600 to-red-500' },
  twitter: { icon: Twitter, gradient: 'from-gray-800 to-gray-700' },
  linkedin: { icon: Linkedin, gradient: 'from-blue-700 to-blue-600' },
  whatsapp: { icon: MessageCircle, gradient: 'from-green-500 to-emerald-400' },
};

export default function ContactSidebar({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const sectionRef = useRef<HTMLElement>(null);

  const whatsappUrl = data.whatsappUrl
    || (data.primaryPhone ? `https://wa.me/91${data.primaryPhone}?text=${encodeURIComponent(`Hi, I'm interested in your products.`)}` : '');

  return (
    <section id="contact" ref={sectionRef} className="py-20 sm:py-28 section-alt relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Get in Touch</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-5"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {whatsappUrl && (
                  <Button asChild size="lg"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                    </a>
                  </Button>
                )}
                {data.primaryPhone && (
                  <Button asChild size="lg" className="flex-1 rounded-2xl h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                    <a href={`tel:${data.primaryPhone}`}>
                      <Phone className="w-5 h-5 mr-2" /> Call Now
                    </a>
                  </Button>
                )}
              </div>

              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl p-6 bg-card border border-border shadow-sm space-y-4"
              >
                {data.primaryPhone && (
                  <a href={`tel:${data.primaryPhone}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">+91 {data.primaryPhone}</span>
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate">{data.email}</span>
                  </a>
                )}
                {data.fullAddress && (
                  <div className="flex items-start gap-3 text-foreground">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{data.fullAddress}</span>
                  </div>
                )}
                {data.website && (
                  <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate">{data.website.replace(/https?:\/\//, '').replace(/\/$/, '')}</span>
                  </a>
                )}
              </motion.div>

              {data.socialProfiles.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Follow on social</p>
                  <div className="flex flex-wrap gap-2">
                    {data.socialProfiles.map((p) => {
                      const meta = PLATFORM_META[p.platform];
                      if (!meta) return null;
                      const Icon = meta.icon;
                      return (
                        <motion.a
                          key={p.platform}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow`}
                          title={p.platform}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              )}

              <motion.a
                href={data.indiamartUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-border hover:border-primary/30 hover:text-primary transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> IndiaMART Profile
              </motion.a>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-2xl overflow-hidden border border-border h-80 md:h-auto min-h-[350px] shadow-sm"
            >
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(data.fullAddress || data.city || 'India')}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
