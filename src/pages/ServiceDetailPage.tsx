import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react';

const servicesData: Record<string, any> = {
    // ── New 4 categories ──────────────────────────────────────────────
    'video-production': {
        titleKey: 'services.cat1.title',
        image: 'https://images.unsplash.com/photo-1633119232877-5ad2588a37ab?auto=format&fit=crop&q=80&w=1200',
        descKey: 'services.cat1.desc',
        itemsKey: 'services.cat1.items',
        gallery: [
            'https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'
        ]
    },
    'branding': {
        titleKey: 'services.cat2.title',
        image: 'https://images.unsplash.com/photo-1640975972263-1f73398e943b?auto=format&fit=crop&q=80&w=1200',
        descKey: 'services.cat2.desc',
        itemsKey: 'services.cat2.items',
        gallery: [
            'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
        ]
    },
    'digital-marketing': {
        titleKey: 'services.cat3.title',
        image: 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?auto=format&fit=crop&q=80&w=1200',
        descKey: 'services.cat3.desc',
        itemsKey: 'services.cat3.items',
        gallery: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800'
        ]
    },
    'media-buying': {
        titleKey: 'services.cat4.title',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
        descKey: 'services.cat4.desc',
        itemsKey: 'services.cat4.items',
        gallery: [
            'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800'
        ]
    },
    // ── Legacy entries (kept for backward compat) ─────────────────────
    'catalogs': {
        titleKey: 'services.catalogs',
        image: 'https://images.unsplash.com/photo-1636247499180-13285c86be9b?auto=format&fit=crop&q=80&w=1200',
        descKey: 'services.catalogsDesc',
        featuresCount: 5,
        featuresPrefix: 'services.catalogs.f',
        gallery: [
            'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800'
        ]
    },
    'animation': {
        titleKey: 'services.animation',
        image: 'https://images.unsplash.com/photo-1740174459694-4da6669ef2b0?auto=format&fit=crop&q=80&w=1200',
        descKey: 'services.animationDesc',
        featuresCount: 5,
        featuresPrefix: 'services.animation.f',
        gallery: [
            'https://images.unsplash.com/photo-1550745165-9bc0b252723f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800'
        ]
    }
};

export function ServiceDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const service = id ? servicesData[id] : null;

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(-1);
    };

    if (!service) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6" dir={isAr ? 'rtl' : 'ltr'}>
                <h1 className="text-4xl font-bold mb-6">{isAr ? 'الخدمة غير موجودة' : 'Service Not Found'}</h1>
                <a href="#" onClick={handleBack} className="text-[#9B8A5E] hover:underline cursor-pointer">
                    {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                </a>
            </div>
        );
    }

    // Resolve features: new entries use itemsKey (pipe-separated), legacy use numbered prefix
    const features: string[] = service.itemsKey
        ? t(service.itemsKey).split('|').map((s: string) => s.trim()).filter(Boolean)
        : Array.from({ length: service.featuresCount }, (_: unknown, i: number) => t(`${service.featuresPrefix}${i + 1}`));

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-6">
                {/* Back Button */}
                <a
                    href="#"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors cursor-pointer group"
                >
                    <ChevronLeft size={20} className={`${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`} />
                    <span>{t('contact.breadcrumbHome')}</span>
                </a>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left/Right Column based on language direction is handled by dir="rtl" */}
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#9B8A5E] text-sm tracking-[0.4em] uppercase font-bold mb-6 block">
                            {t('services.detail.premium')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                            {t(service.titleKey)}
                        </h1>
                        <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 font-light max-w-2xl">
                            {t(service.descKey)}
                        </p>

                        <div className="space-y-4 mb-12">
                            <h3 className="text-xl font-bold mb-6">{t('services.detail.whatWeOffer')}</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {features.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#9B8A5E]/40 transition-colors">
                                        <CheckCircle2 size={18} className="text-[#9B8A5E] shrink-0" />
                                        <span className="text-white/80 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            className="px-10 py-4 bg-[#9B8A5E] text-black rounded-full font-bold hover:bg-[#B5A27A] transition-all flex items-center gap-3 group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{t('services.detail.requestNow')}</span>
                            <ArrowRight size={20} className={`${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'} transition-transform duration-300`} />
                        </motion.button>
                    </motion.div>

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl relative group">
                            <img
                                src={service.image}
                                alt={t(service.titleKey)}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {service.gallery.map((img: string, idx: number) => (
                                <div key={idx} className="aspect-square overflow-hidden rounded-2xl border border-white/10 group">
                                    <img
                                        src={img}
                                        alt="Gallery"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}



