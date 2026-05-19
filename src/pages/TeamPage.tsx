import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { TeamPyramid } from '../components/TeamPyramid';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TeamPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#060606] pt-20" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Breadcrumb — top left */}
      <div className="container mx-auto px-6 pt-12 pb-4">
        <div className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
          <Link to="/" className="text-white/40 hover:text-white/60 transition-colors">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight size={10} className={`text-white/20 ${isAr ? 'rotate-180' : ''}`} />
          <span className="text-white/80">{isAr ? 'الفريق' : 'Team'}</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-6 text-center mb-16 md:mb-24">
        <motion.h1 
          className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {isAr ? 'فريقنا' : 'OUR TEAM'}
        </motion.h1>
        
        <div className="w-12 h-[2px] bg-[#9B8A5E]/50 mx-auto mb-10" />

        <motion.p 
          className="max-w-2xl mx-auto text-white/50 text-sm md:text-base leading-relaxed tracking-wide font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isAr 
            ? 'فريق متكامل من المبدعين والمتخصصين يعملون معاً لتحقيق رؤيتك الساعية للإبداع. نحن نؤمن بأن النجاح يأتي من التعاون والشغف والتفاني في كل مشروع.'
            : 'A complete team of creatives and specialists working together to achieve your creative vision. We believe that success comes from collaboration, passion, and dedication in every project.'}
        </motion.p>
      </div>

      <TeamPyramid />
    </div>
  );
}

