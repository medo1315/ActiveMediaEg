import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../lib/supabase';

export function Team() {
  const { language } = useLanguage();
  const [dynamicMembers, setDynamicMembers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAr = language === 'ar';
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dimensions, setDimensions] = useState({ cardWidth: 200, gap: 24 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('team')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setDynamicMembers(data || []);
      setCurrentIndex(data?.length || 0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDimensions({ cardWidth: 160, gap: 16 });
      } else if (window.innerWidth < 1024) {
        setDimensions({ cardWidth: 180, gap: 20 });
      } else {
        setDimensions({ cardWidth: 200, gap: 24 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cardWidth, gap } = dimensions;
  const displayMembers = [...dynamicMembers, ...dynamicMembers, ...dynamicMembers];

  const nextSlide = () => {
    if (dynamicMembers.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (dynamicMembers.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (dynamicMembers.length === 0) return;
    if (currentIndex >= dynamicMembers.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(dynamicMembers.length);
      }, 700);
      return () => clearTimeout(timer);
    } else if (currentIndex < dynamicMembers.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex + dynamicMembers.length);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, dynamicMembers.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => { nextSlide(); }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) { isAr ? prevSlide() : nextSlide(); }
    else if (distance < -minSwipeDistance) { isAr ? nextSlide() : prevSlide(); }
  };

  return (
    <section id="team" className="py-16 md:py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-6">

          {/* Left Column: Title + Controls */}
          <div className={`lg:w-1/4 w-full flex flex-col ${isAr ? 'items-center lg:items-end text-center lg:text-right' : 'items-center lg:items-start text-center lg:text-left'} z-20 bg-[#0a0a0a] py-4 lg:py-6`}>
            <motion.div
              initial={{ opacity: 0, x: isAr ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-2 md:mb-4">
                {isAr ? 'الفريق' : 'TEAM'}
              </h2>
              <p className="text-[#9B8A5E] text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold mb-6 md:mb-10">
                {isAr ? 'فريقنا المبدع' : 'OUR CREATIVE'}
              </p>

              {/* Desktop Arrows */}
              <div className={`hidden lg:flex gap-3 justify-center ${isAr ? 'lg:justify-end' : 'lg:justify-start'}`}>
                <button
                  onClick={isAr ? nextSlide : prevSlide}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#9B8A5E] hover:text-black hover:border-[#9B8A5E] transition-all duration-300 group"
                >
                  {isAr ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button
                  onClick={isAr ? prevSlide : nextSlide}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#9B8A5E] hover:text-black hover:border-[#9B8A5E] transition-all duration-300 group"
                >
                  {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sliding Strip */}
          <div
            className={`lg:w-3/4 w-full relative min-h-[300px] flex flex-col lg:flex-row items-center justify-start`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {isLoading ? (
              <div className="w-full h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/20" size={40} />
              </div>
            ) : dynamicMembers.length === 0 ? (
              <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-3xl">
                <p className="text-white/20">Add team members from the dashboard to see them here.</p>
              </div>
            ) : (
              <div className="overflow-hidden py-6 w-full">
                <motion.div
                  className="flex"
                  style={{ gap: `${gap}px` }}
                  animate={{
                    x: isAr ? (currentIndex * (cardWidth + gap)) : -(currentIndex * (cardWidth + gap))
                  }}
                  transition={isTransitioning ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
                >
                  {displayMembers.map((member, idx) => (
                    <div
                      key={`${member.id}-${idx}`}
                      style={{ minWidth: `${cardWidth}px`, width: `${cardWidth}px` }}
                      className="flex flex-col group/card"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#111] rounded-xl mb-4 shadow-2xl">
                        <ImageWithFallback
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className={`px-1 text-center ${isAr ? 'lg:text-right group-hover/card:-translate-x-1' : 'lg:text-left group-hover/card:translate-x-1'} transition-transform duration-300`}>
                        <h3 className="text-white text-base font-bold leading-tight mb-1 truncate">{member.name}</h3>
                        <p className="text-[#9B8A5E]/80 text-[10px] font-bold uppercase tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Mobile Arrows */}
            <div className="flex lg:hidden gap-8 justify-center mt-10 mb-2">
              <button onClick={isAr ? nextSlide : prevSlide} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white active:bg-[#9B8A5E] active:text-black transition-all duration-200">
                {isAr ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
              </button>
              <button onClick={isAr ? prevSlide : nextSlide} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white active:bg-[#9B8A5E] active:text-black transition-all duration-200">
                {isAr ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
              </button>
            </div>

            {/* Edge shadows */}
            <div className="absolute top-0 left-0 w-8 md:w-24 h-full bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 md:w-24 h-full bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}