import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ArrowRight, Calendar, User, Tag, Video, Image as ImageIcon } from 'lucide-react';
import { Lightbox } from '../components/Lightbox';

export function ProjectDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // all images flat list: cover first, then rest
    const allImages: string[] = project?.image_urls ?? [];

    const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const prevImage = useCallback(() =>
        setLightboxIndex(i => (i == null ? 0 : (i - 1 + allImages.length) % allImages.length)), [allImages.length]);
    const nextImage = useCallback(() =>
        setLightboxIndex(i => (i == null ? 0 : (i + 1) % allImages.length)), [allImages.length]);

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
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
                // If not found by ID, try finding by a slug/slug-like title if you have that logic, 
                // but for now redirect back to portfolio
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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#9B8A5E] border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/portfolio');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-6">
                {/* Navigation */}
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors group px-0 border-none bg-transparent cursor-pointer"
                >
                    <ChevronLeft size={20} className={`${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`} />
                    <span className="uppercase tracking-[0.2em] text-xs font-bold">{t('portfolio.back')}</span>
                </button>

                {/* Hero / Cover Section */}
                <div
                    className="relative aspect-video lg:aspect-[21/9] w-full overflow-hidden rounded-[2rem] mb-16 ring-1 ring-white/10 shadow-2xl cursor-zoom-in"
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={project.image_urls?.[0] || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    {/* zoom hint */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/60 text-xs flex items-center gap-1.5 opacity-0 hover:opacity-100 transition-opacity">
                        <ImageIcon size={12} /> {isAr ? 'اضغط للتكبير' : 'Click to zoom'}
                    </div>
                    <div className={`absolute bottom-8 md:bottom-12 ${isAr ? 'right-8 md:right-12' : 'left-8 md:left-12'} max-w-4xl`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#9B8A5E] text-black text-[10px] font-black uppercase tracking-widest mb-4">
                                {project.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight uppercase">
                                {project.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-20">
                        {/* Description Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-8 h-1 bg-[#9B8A5E] rounded-full" />
                                {isAr ? 'عن المشروع' : 'THE STORY'}
                            </h2>
                            <p className="text-white/70 text-lg md:text-xl leading-relaxed font-light whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </motion.div>

                        {/* Universal Video Player Section */}
                        {project.vimeo_id && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-12"
                            >
                                <h2 className="text-3xl font-bold flex items-center gap-3">
                                    <Video className="text-[#9B8A5E]" size={28} />
                                    {isAr ? 'فيديوهات المشروع' : 'PROJECT SHOWREELS'}
                                </h2>
                                <div className="space-y-8">
                                    {project.vimeo_id.split(',').map((videoInput: string, vIdx: number) => {
                                        const input = videoInput.trim();
                                        let embedUrl = '';
                                        
                                        // YouTube
                                        if (input.includes('youtube.com') || input.includes('youtu.be')) {
                                            const ytRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                                            const match = input.match(ytRegex);
                                            const ytId = (match && match[7].length === 11) ? match[7] : null;
                                            
                                            if (ytId) {
                                                embedUrl = `https://www.youtube.com/embed/${ytId}`;
                                            } else {
                                                // Fallback for tricky links
                                                embedUrl = input.replace('watch?v=', 'embed/').split('&')[0];
                                            }
                                        } 
                                        // Vimeo (ID or URL)
                                        else if (input.includes('vimeo.com') || /^\d+$/.test(input)) {
                                            const vId = input.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] || input;
                                            embedUrl = `https://player.vimeo.com/video/${vId}?badge=0&autopause=0&player_id=0&app_id=58479`;
                                        }
                                        // Google Drive
                                        else if (input.includes('drive.google.com')) {
                                            embedUrl = input.replace('/view', '/preview').replace('?usp=sharing', '');
                                        }
                                        // Facebook
                                        else if (input.includes('facebook.com')) {
                                            embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(input)}&show_text=0&width=560`;
                                        }
                                        // Instagram
                                        else if (input.includes('instagram.com')) {
                                            embedUrl = `${input.split('?')[0]}embed`;
                                        }
                                        // Generic Iframe Support
                                        else {
                                            embedUrl = input;
                                        }

                                        return (
                                            <div key={vIdx} className="relative aspect-video rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl bg-white/5 group">
                                                <iframe
                                                    src={embedUrl}
                                                    className="absolute inset-0 w-full h-full"
                                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title={`${project.title} video ${vIdx}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Gallery Grid */}
                        {project.image_urls && project.image_urls.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <h2 className="text-3xl font-bold flex items-center gap-3">
                                    <ImageIcon className="text-[#9B8A5E]" size={28} />
                                    {isAr ? 'معرض الصور' : 'VISUAL JOURNEY'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {project.image_urls.slice(1).map((img: string, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                                            className="aspect-video overflow-hidden rounded-2xl group border border-white/5 relative cursor-zoom-in"
                                            onClick={() => openLightbox(idx + 1)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${project.title} gallery ${idx}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                                    <ImageIcon size={18} className="text-white" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 h-fit space-y-10 sticky top-32"
                        >
                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#9B8A5E]/10 border border-[#9B8A5E]/20 flex items-center justify-center text-[#9B8A5E] shrink-0">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">{isAr ? 'العميل' : 'CLIENT'}</p>
                                        <p className="text-white font-black text-lg uppercase">{project.clients?.name || project.client || 'Personal'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#9B8A5E]/10 border border-[#9B8A5E]/20 flex items-center justify-center text-[#9B8A5E] shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">{isAr ? 'السنة' : 'YEAR'}</p>
                                        <p className="text-white font-black text-lg uppercase">{project.year}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#9B8A5E]/10 border border-[#9B8A5E]/20 flex items-center justify-center text-[#9B8A5E] shrink-0">
                                        <Tag size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">{isAr ? 'التصنيف' : 'CATEGORY'}</p>
                                        <p className="text-white font-black text-lg uppercase tracking-wider">{project.category}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/10 space-y-6">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-2">{isAr ? 'المهام' : 'TASKS'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags?.map((tag: string, idx: number) => (
                                        <span key={idx} className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold border border-white/5 uppercase tracking-widest text-white/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/contact')}
                                className="w-full py-5 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#9B8A5E] hover:text-white transition-all group mt-8"
                            >
                                <span className="uppercase tracking-tighter">{isAr ? 'ابدأ مشروعك معنا' : 'LET\'S WORK TOGETHER'}</span>
                                <ArrowRight size={20} className={`${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'} transition-transform`} />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && allImages.length > 0 && (
                <Lightbox
                    images={allImages}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}
        </div>
    );
}
