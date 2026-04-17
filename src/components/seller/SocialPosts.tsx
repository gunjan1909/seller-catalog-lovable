import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Youtube, Heart, MessageCircle, Play, X, Zap } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

type Platform = 'instagram' | 'youtube';

function InstagramEmbed({ post }: { post: any }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!embedRef.current) return;
    const timeout = setTimeout(() => setLoaded(true), 5000);

    // Try to process embed
    const tryProcess = () => {
      if ((window as any).instgrm?.Embeds?.process) {
        (window as any).instgrm.Embeds.process(embedRef.current);
        setLoaded(true);
        clearTimeout(timeout);
      }
    };

    // Load embed.js if not already loaded
    if (!(window as any).instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => setTimeout(tryProcess, 300);
      document.body.appendChild(script);
    } else {
      tryProcess();
    }

    return () => clearTimeout(timeout);
  }, [post.url]);

  const formatDate = (ts: string) => {
    if (!ts) return '';
    try {
      const d = new Date(Number(ts) > 1e12 ? Number(ts) : ts.length < 13 ? Number(ts) * 1000 : ts);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <div ref={embedRef} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Instagram blockquote embed */}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={post.url}
        data-instgrm-version="14"
        style={{
          background: 'hsl(var(--card))',
          border: 0,
          borderRadius: '1rem',
          margin: 0,
          maxWidth: '100%',
          minWidth: '100%',
          padding: 0,
          width: '100%',
        }}
      />

      {/* Fallback placeholder visible until embed loads */}
      {!loaded && (
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-muted-foreground truncate">{formatDate(post.timestamp)}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-3 leading-relaxed flex-1 break-words">
            {post.caption?.slice(0, 140)}{post.caption && post.caption.length > 140 ? '…' : ''}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likesCount}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.commentsCount}</span>
          </div>
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-muted hover:border-primary/40 transition-colors">
            View on Instagram
          </a>
        </div>
      )}
    </div>
  );
}

export default function SocialPosts({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="social" ref={sectionRef} className="py-20 sm:py-28 section-alt relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center">
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
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card border border-border text-foreground hover:border-primary/30'
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
                {data.igPosts.slice(0, 6).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="h-full"
                  >
                    <InstagramEmbed post={post} />
                  </motion.div>
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
                  className="group rounded-2xl overflow-hidden border border-border bg-card cursor-pointer hover:shadow-lg transition-all duration-300"
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
                        className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl"
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
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
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
