import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Youtube, Heart, MessageCircle, Play, X, Zap } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

type Platform = 'instagram' | 'youtube';

function InstagramVisual({ src, alt, isVideo }: { src?: string; alt: string; isVideo: boolean }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.2),transparent_45%)]" />
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-card/80 text-primary">
            <Instagram className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Instagram post</p>
            <p className="mt-1 text-xs text-muted-foreground">Preview unavailable, details still visible below</p>
          </div>
        </div>
        {isVideo && <div className="absolute right-4 top-4 rounded-full bg-background/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">Reel</div>}
      </div>
    );
  }

  return (
    <div className="aspect-square relative overflow-hidden">
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={() => setFailed(true)} />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-lg">
            <Play className="h-5 w-5 text-primary fill-primary ml-0.5" />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export default function SocialPosts({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const hasIg = data.igPosts.length > 0;
  const hasYt = data.allYtVideos.length > 0;

  const platforms: Platform[] = [];
  if (hasIg) platforms.push('instagram');
  if (hasYt) platforms.push('youtube');

  const [activePlatform, setActivePlatform] = useState<Platform>(hasIg ? 'instagram' : 'youtube');

  if (!hasIg && !hasYt) return null;

  const formatDate = (ts: string) => {
    if (!ts) return '';
    try {
      const d = new Date(Number(ts) > 1e12 ? Number(ts) : ts.length < 13 ? Number(ts) * 1000 : ts);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <section id="social" ref={sectionRef} className="py-20 sm:py-28 relative overflow-hidden">
      <motion.div style={{ y: parallaxY }} className="absolute left-0 bottom-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-rose to-primary" />
      </motion.div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-rose/10 to-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-rose" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Latest Updates</h2>
          </div>

          {platforms.length > 1 && (
            <div className="flex gap-2 mb-8">
              {platforms.map(p => (
                <motion.button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${activePlatform === p
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card border border-border/50 text-foreground hover:border-primary/30'
                    }`}
                >
                  {p === 'instagram' ? <Instagram className="w-4 h-4" /> : <Youtube className="w-4 h-4" />}
                  {p === 'instagram' ? 'Instagram' : 'YouTube'}
                </motion.button>
              ))}
            </div>
          )}

          {activePlatform === 'instagram' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.igPosts.slice(0, 6).map((post, i) => (
                  <motion.a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 backdrop-blur-xl hover:shadow-[0_26px_80px_-40px_hsl(var(--brand-midnight)/0.9)] transition-all duration-300"
                  >
                    <InstagramVisual src={post.displayUrl || post.images?.[0]} alt={post.caption?.slice(0, 50) || 'Instagram post'} isVideo={post.type === 'Video'} />
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          <Instagram className="h-3 w-3" />
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(post.timestamp)}</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">{post.caption?.slice(0, 120)}{post.caption && post.caption.length > 120 ? '...' : ''}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likesCount}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.commentsCount}</span>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground">View post on Instagram</div>
                    </div>
                  </motion.a>
                ))}
              </div>
              {data.secondaryIG && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-muted-foreground mt-6 text-center"
                >
                  Also follow us:{' '}
                  <a href={data.secondaryIG.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    @{data.secondaryIG.username}
                  </a>
                </motion.p>
              )}
            </div>
          )}

          {activePlatform === 'youtube' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.allYtVideos.map((vid, i) => (
                <motion.div
                  key={vid.videoId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl overflow-hidden border border-border/50 bg-card cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => setVideoModal(vid.videoId)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`; }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl backdrop-blur-sm"
                      >
                        <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center">
                        <Youtube className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(vid.date)}</span>
                    </div>
                    {vid.title && <p className="text-sm font-medium text-foreground line-clamp-2">{vid.title}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {videoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setVideoModal(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2.5 hover:bg-white/10 rounded-full" onClick={() => setVideoModal(null)}>
            <X className="w-6 h-6" />
          </button>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-full max-w-3xl aspect-video"
            onClick={e => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoModal}?autoplay=1`}
              title="Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
