import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface CTASectionProps {
  onOpenContact: () => void;
}

export function CTASection({ onOpenContact }: CTASectionProps) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    years: new Date().getFullYear() - 2019
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [projectsRes, clientsRes, settingsRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('site_settings').select('manual_clients_count').eq('id', 'global').single()
      ]);

      const realClientsCount = clientsRes.count || 0;
      const manualClientsCount = settingsRes.data?.manual_clients_count || 0;

      setStats({
        projects: projectsRes.count || 0,
        clients: manualClientsCount > 0 ? manualClientsCount : realClientsCount,
        years: new Date().getFullYear() - 2019
      });
    };

    fetchStats();
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* CTA Part - Gray Background */}
      <div className="relative py-24 bg-[#2D2D2D] overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/4 w-96 h-96 border border-white/5 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Subtitle */}
              <motion.p
                className="text-[#9B8A5E] text-sm tracking-[0.3em] uppercase font-light mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t('cta.subtitle')}
              </motion.p>

              {/* Main Title */}
              <motion.h2
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* "ABOUT YOUR" with outline */}
                <span
                  className="block text-transparent"
                  style={{
                    WebkitTextStroke: '2px white'
                  }}
                >
                  {t('cta.aboutYour')}
                </span>

                {/* "NEXT PROJECT" solid white */}
                <span className="block text-white mt-2">
                  {t('cta.nextProject')}
                </span>
              </motion.h2>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={onOpenContact}
              className="px-10 py-5 border-2 border-white text-white text-sm tracking-[0.2em] uppercase font-light hover:bg-white hover:text-black transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('cta.button')}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Part - Black Background */}
      <div className="relative py-20 bg-black overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Clients Stat */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h3
                className="text-5xl md:text-6xl font-bold text-white mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {stats.clients}+
              </motion.h3>
              <p className="text-white/60 text-sm md:text-base tracking-wider">
                {isAr ? 'عميل سعيد' : 'Happy Clients'}
              </p>
            </motion.div>

            {/* Projects Stat */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h3
                className="text-5xl md:text-6xl font-bold text-white mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {stats.projects}+
              </motion.h3>
              <p className="text-white/60 text-sm md:text-base tracking-wider">
                {isAr ? 'مشروع مكتمل' : 'Completed Projects'}
              </p>
            </motion.div>

            {/* Years Stat */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h3
                className="text-5xl md:text-6xl font-bold text-white mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {stats.years}+
              </motion.h3>
              <p className="text-white/60 text-sm md:text-base tracking-wider">
                {isAr ? 'سنة خبرة' : 'Years of Experience'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}