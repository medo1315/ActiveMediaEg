import { motion } from 'framer-motion';
import { Target, Magnet, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function About() {
  const { t } = useLanguage();

  const stats = [
    { value: '+500', label: t('about.stat1') },
    { value: '+200', label: t('about.stat2') },
    { value: '10+', label: t('about.stat3') }
  ];

  const brandPhilosophy = [
    {
      icon: Magnet,
      title: t('about.vision'),
      description: t('about.visionText')
    },
    {
      icon: Target,
      title: t('about.mission'),
      description: t('about.missionText')
    },
    {
      icon: Users,
      title: t('about.values'),
      description: t('about.valuesText')
    }
  ];

  return (
    <section id="about" className="py-32 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A] relative overflow-hidden">
      {/* Magnetic Circle Decorations */}
      <motion.div
        className="absolute top-20 right-20 opacity-5"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
          {/* Full Circle - Magnet */}
          <circle cx="100" cy="100" r="80" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.2" />
          <circle cx="100" cy="100" r="60" fill="#FFFFFF" opacity="0.05" />
          {/* Half Circle - Target Audience */}
          <path d="M 100 20 A 80 80 0 0 1 100 180" stroke="#CCCCCC" strokeWidth="3" fill="none" opacity="0.3" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 opacity-5"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="70" stroke="#888888" strokeWidth="2" fill="none" opacity="0.2" />
          <path d="M 30 100 A 70 70 0 0 0 170 100" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.3" />
        </svg>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Brand Philosophy Section */}
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="text-white" size={24} />
              <span className="text-sm tracking-widest text-gray-400 uppercase">{t('philosophy.label')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-6 text-white">
              {t('about.vision')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('philosophy.description')}
            </p>
          </motion.div>

          {/* Philosophy Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {brandPhilosophy.map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-[#0D0D0D]/50 border border-white/10 rounded-sm p-8 h-full backdrop-blur-sm group-hover:border-white/30 transition-all duration-500">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="text-white" size={28} />
                  </motion.div>
                  <h3 className="text-2xl font-light text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>

                  {/* Decorative magnetic effect */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main About Content */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-sm tracking-widest text-gray-400 uppercase">{t('about.label')}</span>
              <h2 className="text-5xl md:text-6xl font-light mt-4 mb-8 text-white">
                {t('about.title')}
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed font-light mb-6">
                {t('about.description')}
              </p>
              <p className="text-lg text-gray-400 leading-relaxed font-light mb-4">
                {t('about.description2')}
              </p>
              <p className="text-lg text-gray-400 leading-relaxed font-light">
                {t('about.description3')}
              </p>
            </motion.div>

            <div className="space-y-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="border-t border-white/20 pt-6 group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 10, borderColor: 'rgba(255, 255, 255, 0.4)' }}
                >
                  <motion.div
                    className="text-5xl font-light mb-2 text-white relative"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {stat.value}
                    <motion.span
                      className="absolute -left-2 top-0 text-white opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      +
                    </motion.span>
                  </motion.div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}