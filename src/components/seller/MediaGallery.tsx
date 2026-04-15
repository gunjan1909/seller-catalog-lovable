import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Image as ImageIcon, Video, X, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { SellerData } from '@/lib/sellerDataExtractor';

export default function MediaGallery({ data }: { data: SellerData }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [hiddenImages, setHiddenImages] = useState<Set<string>>(new Set());

  const hideImage = useCallback((url: string) => {
    setHiddenImages(prev => new Set(prev).add(url));
  }, []);

  const visibleImages = data.allImages.filter(img => !hiddenImages.has(img.url));

  if (!visibleImages.length && !data.allYtVideos.length) return null;

  return (
    <section id="gallery" ref={ref} className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-im-blue" />
            Media Gallery
          </h2>

          <Tabs defaultValue={visibleImages.length ? 'images' : 'videos'}>
            <TabsList className="rounded-full mb-8">
              {visibleImages.length > 0 && (
                <TabsTrigger value="images" className="rounded-full px-6">
                  <ImageIcon className="w-4 h-4 mr-2" /> Images ({visibleImages.length})
                </TabsTrigger>
              )}
              {data.allYtVideos.length > 0 && (
                <TabsTrigger value="videos" className="rounded-full px-6">
                  <Video className="w-4 h-4 mr-2" /> Videos ({data.allYtVideos.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="images">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {visibleImages.map((img, i) => (
                  <motion.div
                    key={img.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.03 }}
                    className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer border border-border"
                    onClick={() => setLightboxUrl(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || ''}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => hideImage(img.url)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                      {img.source}
                    </span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.allYtVideos.map((vid, i) => (
                  <motion.div
                    key={vid.videoId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1 }}
                    className="card-3d relative group rounded-xl overflow-hidden cursor-pointer border border-border bg-card"
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
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-6 h-6 text-im-blue fill-im-blue ml-1" />
                        </div>
                      </div>
                      {vid.isShort && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                          SHORT
                        </span>
                      )}
                    </div>
                    {vid.title && (
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{vid.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{vid.channelName}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={() => setLightboxUrl(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxUrl} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}

      {/* Video Modal */}
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
