import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export function Testimonials() {
  const { t } = useLanguage();
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .not('testimonial_text', 'is', null)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setDbTestimonials(data);
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (dbTestimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dbTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [dbTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % dbTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + dbTestimonials.length) % dbTestimonials.length);
  };

  const currentTestimonial = dbTestimonials[currentIndex];

  const getInitials = (name: string) => {
    if (!name) return 'AM';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  return (
    <section id="testimonials" className="relative py-32 bg-[#0D0D0D] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 border border-white/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtitle */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-[#9B8A5E] text-sm tracking-[0.4em] uppercase font-light">
              {t('testimonials.subtitle')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-8xl text-white tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('testimonials.title')}
          </motion.h2>
        </motion.div>

        {/* Testimonial Content */}
        <div className="max-w-5xl mx-auto relative">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#9B8A5E] border-t-transparent rounded-full"
              />
            </div>
          ) : dbTestimonials.length > 0 ? (
            <>
              {/* Navigation Arrows - Desktop Only */}
              <motion.button
                onClick={prevTestimonial}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-14 h-14 rounded-full border-2 border-white/20 items-center justify-center text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                onClick={nextTestimonial}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-14 h-14 rounded-full border-2 border-white/20 items-center justify-center text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              {/* Testimonial Card */}
              <motion.div
                key={currentIndex}
                className="text-center px-4 md:px-16"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Testimonial Text */}
                <motion.p
                  className="text-white/80 text-base md:text-xl leading-relaxed mb-12 md:mb-16 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {currentTestimonial.testimonial_text}
                </motion.p>

                {/* Author Info */}
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {/* Initials Circle Avatar */}
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-4 md:mb-6 border-2 border-white/20 bg-[#9B8A5E] flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white text-xl md:text-2xl font-bold tracking-tighter">
                      {getInitials(currentTestimonial.manager_name || currentTestimonial.name)}
                    </span>
                  </motion.div>

                  {/* Name */}
                  <h4 className="text-white text-base md:text-lg tracking-[0.15em] md:tracking-[0.2em] uppercase font-medium mb-2">
                    {currentTestimonial.manager_name || currentTestimonial.name}
                  </h4>

                  {/* Position */}
                  <p className="text-white/60 text-xs md:text-sm font-light">
                    {currentTestimonial.testimonial_role || currentTestimonial.name}
                  </p>
                </motion.div>
              </motion.div>

              {/* Navigation Arrows - Mobile */}
              <div className="flex lg:hidden items-center justify-center gap-4 mt-12">
                <motion.button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>

                {/* Dots Indicator - Mobile */}
                <div className="flex gap-2">
                  {dbTestimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                          ? 'bg-white w-8'
                          : 'bg-white/30'
                        }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>

              {/* Dots Indicator - Desktop */}
              <div className="hidden lg:flex justify-center gap-3 mt-16">
                {dbTestimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/20 hover:bg-white/40'
                      }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-white/20 italic">No testimonials yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}