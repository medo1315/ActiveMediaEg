import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

import showreelVideo from '../assets/Untitled video - Made with Clipchamp.mp4';
import { useLanguage } from '../contexts/LanguageContext';

import { supabase } from '../lib/supabase';

export function ShowreelVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<'vimeo' | 'youtube' | 'drive' | 'facebook' | 'instagram' | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('showreel_vimeo_id')
        .eq('id', 'global')
        .single();
      
      if (data?.showreel_vimeo_id) {
        const input = data.showreel_vimeo_id;
        
        if (input.includes('youtube.com') || input.includes('youtu.be')) {
          setVideoUrl(extractYoutubeId(input));
          setVideoType('youtube');
        } else if (input.includes('drive.google.com')) {
          setVideoUrl(input.replace('/view', '/preview').replace('?usp=sharing', ''));
          setVideoType('drive');
        } else if (input.includes('facebook.com')) {
          setVideoUrl(`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(input)}&show_text=0&width=560`);
          setVideoType('facebook');
        } else if (input.includes('instagram.com')) {
          setVideoUrl(`${input.split('?')[0]}embed`);
          setVideoType('instagram');
        } else {
          // Assume Vimeo ID or URL
          const vId = input.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] || input;
          setVideoUrl(vId);
          setVideoType('vimeo');
        }
      }
    };

    fetchSettings();
  }, []);

  const extractYoutubeId = (url: string) => {
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : url.replace('watch?v=', 'embed/').split('&')[0];
  };

  const togglePlay = () => {
    if (videoUrl) {
      setHasStarted(true);
      setIsPlaying(true);
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-[#0D0D0D]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 border border-white/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-64 h-64 border border-white/5 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.05, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white/40 text-sm tracking-[0.3em] uppercase">{t('showreel.label')}</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-light mb-6 text-white">
            <motion.span
              className="inline-block"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255, 255, 255, 0.1)",
                  "0 0 40px rgba(255, 255, 255, 0.2)",
                  "0 0 20px rgba(255, 255, 255, 0.1)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {t('showreel.title')}
            </motion.span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            {t('showreel.description')}
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          style={{ scale, opacity }}
          className="relative max-w-6xl mx-auto"
        >
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Play Button Overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className={`absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-black/40 ${hasStarted ? 'pointer-events-none' : 'cursor-pointer'}`}
                  onClick={!hasStarted ? togglePlay : undefined}
                >
                  <motion.div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative pointer-events-auto cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20" />
                    <Play className="w-10 h-10 md:w-14 md:h-14 text-white fill-white ml-1.5" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Border Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none z-10 border border-white/10"
              animate={{
                boxShadow: isPlaying ? "none" : [
                  "0 0 0 1px rgba(255, 255, 255, 0.1)",
                  "0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)",
                  "0 0 0 1px rgba(255, 255, 255, 0.1)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Video Player */}
            <div className="relative w-full aspect-video">
              {videoUrl ? (
                videoType === 'vimeo' ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${videoUrl}?autoplay=${hasStarted ? 1 : 0}&muted=${hasStarted ? 0 : 1}&loop=1&background=${hasStarted ? 0 : 1}`}
                    className="w-full h-full object-cover"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : videoType === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoUrl}?autoplay=${hasStarted ? 1 : 0}&mute=${hasStarted ? 0 : 1}&loop=1&playlist=${videoUrl}`}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  controls={hasStarted}
                  onPlay={() => {
                    setIsPlaying(true);
                    setHasStarted(true);
                  }}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={showreelVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </motion.div>

          {/* Corner Decorations */}
          <motion.div
            className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-white/20 rounded-tr-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-white/20 rounded-bl-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </motion.div>

      </div>
    </section>
  );
}