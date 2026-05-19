import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Services } from '../components/Services';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ServicesPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#9B8A5E]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#9B8A5E]/20 rounded-full blur-[120px]" />
      </div>

      {/* Breadcrumb — top left like Clients page */}
      <motion.div
        className="container mx-auto px-6 py-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`flex items-center gap-2 text-sm ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors group"
              whileHover={{ x: isAr ? 3 : -3 }}
            >
              <Home size={16} />
              <span className="tracking-wide">{isAr ? 'الرئيسية' : 'Home'}</span>
            </motion.div>
          </Link>
          <ChevronRight size={16} className={`text-white/20 ${isAr ? 'rotate-180' : ''}`} />
          <span className="text-white/70 tracking-wide">{isAr ? 'الخدمات' : 'Services'}</span>
        </div>
      </motion.div>

      <Services />
    </div>
  );
}
