import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients (
            name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        navigate('/portfolio');
        return;
      }

      setProject(data);
      setIsLoading(false);
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#9B8A5E] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-32 pb-20 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#9B8A5E]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#9B8A5E]/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-white/60 hover:text-[#9B8A5E] transition-colors mb-12 group"
          initial={{ opacity: 0, x: isAr ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className={`w-5 h-5 transition-transform group-hover:${isAr ? 'translate-x-1' : '-translate-x-1'} ${isAr ? 'rotate-180' : ''}`} />
          <span className="text-sm uppercase tracking-widest font-bold">
            {isAr ? 'العودة للمعرض' : 'Back to Portfolio'}
          </span>
        </motion.button>

        {/* Project Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9B8A5E]/10 border border-[#9B8A5E]/20 text-[#9B8A5E] text-xs uppercase tracking-[0.2em] font-bold mb-6">
              <Tag size={14} />
              {project.category}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9B8A5E]">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{isAr ? 'السنة' : 'Year'}</p>
                  <p className="text-white font-bold">{project.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9B8A5E]">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{isAr ? 'العميل' : 'Client'}</p>
                  <p className="text-white font-bold">{project.clients?.name || project.client || 'Creative Project'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-10"
          >
            <p className="text-xl text-white/70 font-light leading-relaxed">
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Vimeo Reel Section */}
        {project.vimeo_id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative aspect-video rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 mb-20 shadow-2xl group"
          >
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeo_id}?h=d357f0bf7c2e&badge=0&autopause=0&player_id=0&app_id=58479`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              title={project.title}
            />
            {/* Play Button Overlay - Subtle */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        )}

        {/* Gallery Section */}
        {project.image_urls && project.image_urls.length > 0 && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-12">
              <div className="w-12 h-[2px] bg-[#9B8A5E]" />
              {isAr ? 'معرض الصور' : 'Project Gallery'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.image_urls.map((url: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-video group
                    ${index % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : ''}
                  `}
                >
                  <img src={url} alt={`${project.title} - ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Project Tags Footprint */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-3">
          {project.tags?.map((tag: string, index: number) => (
            <span key={index} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
