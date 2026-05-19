import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const services = [
  {
    titleKey: 'services.cat1.title',
    image: 'https://images.unsplash.com/photo-1633119232877-5ad2588a37ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHZpZGVvJTIwcHJvZHVjdGlvbnxlbnwxfHx8fDE3Njg3Mzg5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    subItemsKey: 'services.cat1.items',
    id: 'video-production'
  },
  {
    titleKey: 'services.cat2.title',
    image: 'https://images.unsplash.com/photo-1640975972263-1f73398e943b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzY4NjQ3NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    subItemsKey: 'services.cat2.items',
    id: 'branding'
  },
  {
    titleKey: 'services.cat3.title',
    image: 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3Njg2NDEwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    subItemsKey: 'services.cat3.items',
    id: 'digital-marketing'
  },
  {
    titleKey: 'services.cat4.title',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpYSUyMGJ1eWluZyUyMGFkc3xlbnwxfHx8fDE3Njg3Mzg5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    subItemsKey: 'services.cat4.items',
    id: 'media-buying'
  },
];

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative py-32 bg-[#0D0D0D] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-40 left-20 w-96 h-96 border border-white/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.05, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-64 h-64 border border-white/5"
          animate={{
            rotate: [0, 180, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
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
              {t('services.subtitle')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('services.title')}
          </motion.h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const subItems: string[] = t(service.subItemsKey).split('|');
            return (
            <Link key={index} to={`/services/${service.id || 'branding'}`} className="block">
              <motion.div
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ minHeight: '340px' }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={service.image}
                    alt={t(service.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Strong gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/75" />

                {/* Number badge */}
                <div className="absolute top-5 left-5 w-9 h-9 rounded-full border border-[#9B8A5E]/60 flex items-center justify-center">
                  <span className="text-[#9B8A5E] text-xs font-bold">0{index + 1}</span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <motion.h3
                    className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3"
                  >
                    {t(service.titleKey)}
                  </motion.h3>

                  {/* Sub-items always visible */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {subItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/75 text-sm mb-1.5 transition-colors duration-300 group-hover:text-white/95">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9B8A5E] flex-shrink-0" />
                        {item.trim()}
                      </li>
                    ))}
                  </ul>

                  {/* Divider line */}
                  <div className="mt-4 w-10 h-0.5 bg-[#9B8A5E] transition-all duration-300 group-hover:w-16" />
                </div>

                {/* Hover Border Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-white/0 rounded-2xl pointer-events-none transition-colors duration-300 group-hover:border-[#9B8A5E]/30"
                />

                {/* Corner Accent */}
                <motion.div
                  className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/0 rounded-tr-lg transition-all duration-300 group-hover:border-[#9B8A5E]/50 group-hover:w-16 group-hover:h-16"
                />
              </motion.div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
