import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Youtube, Heart, MessageCircle, Eye, Play, X, Zap, ExternalLink } from 'lucide-react';
import type { SellerData, SocialPost } from '@/lib/sellerDataExtractor';
import { extractYouTubeId, formatCount } from '@/lib/sellerDataExtractor';

type Platform = 'instagram' | 'youtube';

function formatDate(ts: string) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

function InstagramEmbed({ post }: { post: SocialPost }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!embedRef.current) return;
    const timeout = setTimeout(() => setLoaded(true), 5000);

    const tryProcess = () => {
      if ((window as any).instgrm?.Embeds?.process) {
        (window as any).instgrm.Embeds.process(embedRef.current);
        setLoaded(true);
        clearTimeout(timeout);
      }
    };

    if (!(window as any).instgrm) {
      const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => setTimeout(tryProcess, 300);
        document.body.appendChild(script);
      } else {
        setTimeout(tryProcess, 500);
      }
    } else {
      tryProcess();
    }

    return () => clearTimeout(timeout);
  }, [post.url]);

  return (
    <div ref={embedRef} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={post.url}
        data-instgrm-version="14"
        style={{
          background: 'hsl(var(--card))',
          border: 0,
          borderRadius: '0.75rem',
          margin: 0,
          maxWidth: '100%',
          minWidth: '100%',
          padding: 0,
          width: '100%',
        }}
      />
      {!loaded && (
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-muted-foreground truncate">{formatDate(post.postedAt)}</span>
          </div>
          {post.thumbnailUrl && (
            <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
              <img src={post.thumbnailUrl} alt="" loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <p className="text-sm text-foreground line-clamp-3 leading-relaxed flex-1 break-words">
            {post.caption?.slice(0, 140)}{post.caption && post.caption.length > 140 ? '…' : ''}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {formatCount(post.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {formatCount(post.comments)}</span>
          </div>
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-muted transition-colors">
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

  const ig = data.socialProfiles.find(p => p.platform === 'instagram');
  const yt = data.socialProfiles.find(p => p.platform === 'youtube');

  const platforms: Platform[] = [];
  if (ig && ig.posts.length > 0) platforms.push('instagram');
  if (yt && yt.posts.length > 0) platforms.push('youtube');

  const [activePlatform, setActivePlatform] = useState<Platform>(platforms[0] || 'instagram');

  if (platforms.length === 0) return null;

  const activeProfile = activePlatform === 'instagram' ? ig : yt;

  return (
    <section id="social" className="py-20 sm:py-28 section-alt relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Latest Updates</h2>
          </div>

          {platforms.length > 1 && (
            <div className="flex gap-2 mb-6">
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

          {/* Profile header */}
          {activeProfile && (
            <motion.div
              key={activeProfile.platform}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-card border border-border shadow-sm"
            >
              {activeProfile.profilePic ? (
                <img src={activeProfile.profilePic} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  {activePlatform === 'instagram' ? <Instagram className="w-6 h-6 text-primary" /> : <Youtube className="w-6 h-6 text-primary" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{data.sellerName}</p>
                {activeProfile.followers > 0 && (
                  <p className="text-xs text-muted-foreground">{formatCount(activeProfile.followers)} followers</p>
                )}
                {activeProfile.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{activeProfile.bio}</p>}
              </div>
              <a
                href={activeProfile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:-translate-y-0.5 transition-all"
              >
                Follow <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          )}

          {activePlatform === 'instagram' && ig && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
              {ig.posts.map((post, i) => (
                <motion.div
                  key={post.url}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="h-full"
                >
                  <InstagramEmbed post={post} />
                </motion.div>
              ))}
            </div>
          )}

          {activePlatform === 'youtube' && yt && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {yt.posts.map((vid, i) => {
                const id = extractYouTubeId(vid.url);
                return (
                  <motion.div
                    key={vid.url}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="group rounded-xl overflow-hidden border border-border bg-card cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => setVideoModal(id)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={vid.thumbnailUrl || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <motion.div whileHover={{ scale: 1.2 }} className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
                          <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center">
                          <Youtube className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(vid.postedAt)}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{vid.caption.slice(0, 120) || 'Video'}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                        {vid.views != null && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatCount(vid.views)}</span>}
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatCount(vid.likes)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {videoModal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setVideoModal(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2.5 hover:bg-white/10 rounded-full" onClick={() => setVideoModal(null)}>
            <X className="w-6 h-6" />
          </button>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-3xl aspect-video" onClick={e => e.stopPropagation()}>
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
