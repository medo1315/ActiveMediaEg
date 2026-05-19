import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../lib/supabase';

export function PhilosophyPage() {
  const { t, language } = useLanguage();
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
    window.scrollTo(0, 0);
  }, []);

  const philosophyImages = [
    "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80"
  ];

  const missionImages = [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80"
  ];

  const statsList = [
    { number: `${stats.clients}+`, label: t('stats.clients') },
    { number: `${stats.projects}+`, label: t('stats.projects') },
    { number: `${stats.years}+`, label: t('stats.years') }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=2000&q=80"
            alt="Active Media Cinematic Set"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('philosophy.heroTitle')}
          </motion.h1>

          {/* Breadcrumb */}
          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">{t('nav.philosophy')}</span>
          </motion.div>
        </div>

        {/* Animated Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images Grid */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {philosophyImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2' : ''
                      }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Philosophy ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </motion.div>
                ))}
              </div>

              {/* Decorative Element */}
              <motion.div
                className="absolute -z-10 -top-8 -right-8 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {t('philosophy.title')}
              </motion.h2>

              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>{t('philosophy.intro')}</p>
                <p>{t('philosophy.description')}</p>
                <p>{t('philosophy.approach')}</p>
              </div>

              {/* Stats Mini */}
              <motion.div
                className="grid grid-cols-2 gap-4 pt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {statsList.slice(0, 2).map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl"
                  >
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              className={`space-y-6 ${language === 'ar' ? 'lg:order-2' : ''}`}
              initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {t('philosophy.missionTitle')}
              </motion.h2>

              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>{t('philosophy.missionIntro')}</p>
                <p>{t('philosophy.missionDescription')}</p>
                <p>{t('philosophy.missionGoal')}</p>
              </div>

              {/* CTA Button */}
              <Link to="/portfolio" className="inline-block mt-8">
                <motion.button
                  className="group relative overflow-hidden px-8 py-4 bg-white text-black rounded-full font-medium flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{t('cta.viewWork')}</span>
                  <ArrowRight
                    size={20}
                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/90"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </motion.div>

            {/* Images Grid */}
            <motion.div
              className={`relative ${language === 'ar' ? 'lg:order-1' : ''}`}
              initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {missionImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl ${index === 2 ? 'col-span-2' : ''
                      }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Mission ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {statsList.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-white/40 text-sm tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 px-6 border-t border-white/5">
        <div className="container mx-auto text-center">
          <p className="text-white/30 text-xs">
            © 2025 Active Media. {t('footer.rights')}
          </p>
        </div>
      </section>
    </div>
  );
}