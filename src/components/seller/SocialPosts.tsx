import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Youtube, Heart, MessageCircle, Play, ExternalLink, X } from 'lucide-react';
import type { SellerData } from '@/lib/sellerDataExtractor';

type Platform = 'instagram' | 'youtube';

export default function SocialPosts({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [videoModal, setVideoModal] = useState<string | null>(null);

  const hasIg = data.igPosts.length > 0;
  const hasYt = data.allYtVideos.length > 0;
  if (!hasIg && !hasYt) return null;

  const platforms: Platform[] = [];
  if (hasIg) platforms.push('instagram');
  if (hasYt) platforms.push('youtube');

  const [activePlatform, setActivePlatform] = useState<Platform>(platforms[0]);

  const formatDate = (ts: string) => {
    if (!ts) return '';
    try {
      const d = new Date(Number(ts) > 1e12 ? Number(ts) : ts.length < 13 ? Number(ts) * 1000 : ts);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <section id="social" ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Instagram className="w-7 h-7 text-im-blue" />
            Latest Updates
          </h2>

          {/* Platform toggle */}
          {platforms.length > 1 && (
            <div className="flex gap-2 mb-8">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                    ${activePlatform === p
                      ? 'bg-im-blue text-white shadow-lg'
                      : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}
                >
                  {p === 'instagram' ? <Instagram className="w-4 h-4" /> : <Youtube className="w-4 h-4" />}
                  {p === 'instagram' ? 'Instagram' : 'YouTube'}
                </button>
              ))}
            </div>
          )}

          {/* Instagram Posts */}
          {activePlatform === 'instagram' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.igPosts.slice(0, 6).map((post, i) => (
                  <motion.a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08 }}
                    className="card-3d group rounded-2xl overflow-hidden border border-border bg-card"
                  >
                    {post.displayUrl && (
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={post.displayUrl}
                          alt={post.caption?.slice(0, 50)}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                        />
                        {post.type === 'Video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                              <Play className="w-5 h-5 text-im-blue fill-im-blue ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-xs text-muted-foreground">{formatDate(post.timestamp)}</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">{post.caption?.slice(0, 120)}{post.caption && post.caption.length > 120 ? '...' : ''}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likesCount}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.commentsCount}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
              {data.secondaryIG && (
                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Also follow us on Instagram:{' '}
                  <a href={data.secondaryIG.url} target="_blank" rel="noopener noreferrer" className="text-im-blue hover:underline">
                    @{data.secondaryIG.username}
                  </a>
                </p>
              )}
            </div>
          )}

          {/* YouTube Videos */}
          {activePlatform === 'youtube' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.allYtVideos.map((vid, i) => (
                <motion.div
                  key={vid.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="card-3d group rounded-2xl overflow-hidden border border-border bg-card cursor-pointer"
                  onClick={() => setVideoModal(vid.videoId)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`; }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-red-600 fill-red-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Youtube className="w-4 h-4 text-red-500" />
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
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoModal(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={() => setVideoModal(null)}>
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-3xl aspect-video" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${videoModal}?autoplay=1`}
              title="Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
