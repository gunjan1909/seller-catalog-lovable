import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, Award, Globe, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function AboutSection({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  if (!data.companyDescription && !data.foundedIn && !data.certifications.length) return null;

  const businessTypes = data.businessType
    ? data.businessType.split(',').map(t => t.trim()).filter((t, i, arr) => arr.indexOf(t) === i && t)
    : [];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative background */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        // Using inline style for gradient
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent" />
      </motion.div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            About {data.sellerName}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <motion.div variants={itemVariants} className="md:col-span-2">
              {data.companyDescription && (
                <div
                  className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed [&_b]:text-foreground [&_b]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: data.companyDescription }}
                />
              )}
              {businessTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {businessTypes.map((t, i) => (
                    <motion.div key={t} whileHover={{ scale: 1.05 }}>
                      <Badge variant="secondary" className="rounded-full px-4 py-1.5 font-medium border border-border bg-muted/50">
                        {t}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              {data.foundedIn && (
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl p-5 bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50"
                >
                  <p className="text-sm text-muted-foreground">Established</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{data.foundedIn}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date().getFullYear() - Number(data.foundedIn)}+ years of excellence</p>
                </motion.div>
              )}

              {data.certifications.length > 0 && (
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-2xl p-5 bg-card border border-border/50"
                >
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" /> Certifications
                  </p>
                  <div className="space-y-2.5">
                    {data.certifications.map(cert => (
                      <div key={cert} className="flex items-center gap-2.5 text-sm text-foreground">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                whileHover={{ y: -3 }}
                className="rounded-2xl p-5 bg-card border border-border/50 space-y-3"
              >
                {data.website && (
                  <a href={data.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {data.linktreeUrl && (
                  <a href={data.linktreeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                    <ExternalLink className="w-4 h-4" /> Linktree
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
