import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function PortfolioPage() {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    years: new Date().getFullYear() - 2019
  });
  const [isLoading, setIsLoading] = useState(true);

  // Build categories dynamically from DB projects
  const dynamicCategories = [
    { id: 'all', label: isAr ? 'الكل' : 'All' },
    ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))
      .map(cat => ({ id: cat, label: cat }))
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const [projectsRes, clientsRes, settingsRes] = await Promise.all([
        supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }),
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('site_settings').select('manual_clients_count').eq('id', 'global').single()
      ]);
      
      if (projectsRes.data) {
        setProjects(projectsRes.data);
      }
      
      const realClientsCount = clientsRes.count || 0;
      const manualClientsCount = settingsRes.data?.manual_clients_count || 0;

      setStats({
        projects: projectsRes.data?.length || 0,
        clients: manualClientsCount > 0 ? manualClientsCount : realClientsCount,
        years: new Date().getFullYear() - 2019
      });

      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-[#9B8A5E] text-sm tracking-[0.4em] uppercase font-light mb-6 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('portfolio.subtitle')}
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t('portfolio.title')}
          </motion.h1>

          <motion.p
            className="text-white/60 text-lg md:text-xl leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t('portfolio.description')}
          </motion.p>
        </motion.div>
      </section>

      {/* Filter Categories — built dynamically from DB */}
      <section className="container mx-auto px-6 mb-16">
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {dynamicCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-3 rounded-full text-sm font-light tracking-wide transition-all duration-300 capitalize ${
                selectedCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#9B8A5E] border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <Link to={`/portfolio/${project.id}`} key={project.id} className="block">
                <motion.div
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                {/* Image/Video Background */}
                <div className="relative aspect-video bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                  {project.image_urls?.[0] && (
                    <img 
                      src={project.image_urls[0]} 
                      alt={project.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  )}
                  
                  {/* Placeholder with Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    {project.category === 'video' ? (
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <Play size={24} className="text-white ml-1" fill="white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <ExternalLink size={24} className="text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />

                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <span className="text-white text-xs font-light">{project.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 rounded-full bg-[#9B8A5E]/20 text-[#9B8A5E] text-xs uppercase tracking-wider mb-4">
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl text-white mb-2 tracking-tight">
                    {project.title}
                  </h3>

                  {/* Client */}
                  <p className="text-white/40 text-sm mb-4 font-light">
                    {project.clients?.name || project.client || 'Personal Project'}
                  </p>

                  {/* Description */}
                  <p className="text-white/60 text-base leading-relaxed mb-6 font-light">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at top left, #9B8A5E 0%, transparent 70%)'
                  }}
                />
              </motion.div>
            </Link>
          ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="container mx-auto max-w-5xl px-6 mt-32">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            { number: `${stats.projects}+`, label: t('portfolio.stats.projects') },
            { number: `${stats.clients}+`, label: t('portfolio.stats.clients') },
            { number: `${stats.years}+`, label: t('portfolio.stats.years') }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="text-5xl md:text-6xl text-white font-bold mb-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-white/60 text-sm md:text-base font-light tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
