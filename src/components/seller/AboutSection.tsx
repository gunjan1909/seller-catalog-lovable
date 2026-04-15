import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, Award, Globe, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function AboutSection({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  if (!data.companyDescription && !data.foundedIn && !data.certifications.length) return null;

  const businessTypes = data.businessType
    ? data.businessType.split(',').map(t => t.trim()).filter((t, i, arr) => arr.indexOf(t) === i && t)
    : [];

  return (
    <section id="about" ref={ref} className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-im-blue" />
            About {data.sellerName}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Description */}
            <div className="md:col-span-2">
              {data.companyDescription && (
                <div
                  className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.companyDescription }}
                />
              )}

              {/* Business type chips */}
              {businessTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {businessTypes.map(t => (
                    <Badge key={t} variant="secondary" className="rounded-full px-4 py-1.5 font-medium">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Quick facts sidebar */}
            <div className="space-y-4">
              {data.foundedIn && (
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Established</p>
                  <p className="text-2xl font-bold text-foreground">{data.foundedIn}</p>
                  <p className="text-xs text-muted-foreground">{new Date().getFullYear() - Number(data.foundedIn)}+ years of experience</p>
                </div>
              )}

              {data.certifications.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Certifications
                  </p>
                  <div className="space-y-2">
                    {data.certifications.map(cert => (
                      <div key={cert} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-2 h-2 rounded-full bg-im-green" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="glass rounded-xl p-4 space-y-2">
                {data.website && (
                  <a href={data.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-im-blue hover:underline">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {data.linktreeUrl && (
                  <a href={data.linktreeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-im-blue hover:underline">
                    <ExternalLink className="w-4 h-4" /> Linktree
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
