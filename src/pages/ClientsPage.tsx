import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// We'll keep the extensive list as a fallback or remove it if we want only DB clients
export function ClientsPage() {
  const { language } = useLanguage();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setClients(data);
      }
      setIsLoading(false);
    };

    fetchClients();
  }, []);



  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20">
      {/* Breadcrumb */}
      <motion.div
        className="container mx-auto px-6 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-sm flex-row">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors group"
              whileHover={{ x: -3 }}
            >
              <Home size={16} />
              <span className="tracking-wide">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </motion.div>
          </Link>
          <ChevronRight size={16} className="text-white/20" />
          <span className="text-white/70 tracking-wide">{language === 'ar' ? 'العملاء' : 'Clients'}</span>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.05, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Main Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1
              className="text-7xl md:text-9xl lg:text-[12rem] font-bold text-white tracking-tight mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              CLIENTS
            </motion.h1>

            {/* Decorative Line */}
            <motion.div
              className="w-24 h-px bg-white/20 mx-auto mb-12"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            {/* Subtitle */}
            <motion.div
              className="space-y-3 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-white/60 text-base md:text-lg tracking-wide leading-relaxed">
                {language === 'ar'
                  ? 'العميل المستمر هو استراتيجية عمل قوية واحدة.'
                  : 'A Continued Client is One Solid Business Strategy.'
                }
              </p>
              <p className="text-white/40 text-sm md:text-base tracking-wider">
                {language === 'ar' ? 'ثقة مُثبتة.' : 'a proven trust.'}
              </p>
            </motion.div>
          </motion.div>

          {/* Clients Grid - 4 columns with actual logos */}
          <motion.div
            className="max-w-7xl mx-auto mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                {clients.map((client, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + (index % 24) * 0.02,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {/* Logo Container */}
                    <div className="aspect-[4/3] flex items-center justify-center">
                      <div className="relative w-full h-full flex items-center justify-center bg-[#1A1A1A] backdrop-blur-sm rounded-xl border border-white/[0.08] group-hover:border-white/20 transition-all duration-500 group-hover:bg-[#222222] overflow-hidden">
                        {/* Logo Text / Image */}
                        {client.logo_url ? (
                          <img
                            src={client.logo_url}
                            alt={client.name}
                            className="w-full h-full object-contain p-6 relative z-10 transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-white/50 text-[11px] md:text-xs font-medium tracking-[0.15em] text-center px-4 group-hover:text-white/80 transition-all duration-500 relative z-10">
                            {client.name}
                          </span>
                        )}

                        {/* Hover Gradient Background */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)'
                          }}
                        />

                        {/* Hover Glow Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                            filter: 'blur(12px)'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="relative py-20 border-t border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >

      </motion.section>
    </div>
  );
}
