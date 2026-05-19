import { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function ContactPage() {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            company: formData.get('company'),
            title: formData.get('title'),
            interest: formData.get('interest'),
            project_details: formData.get('project_details'),
        };

        try {
            const { error } = await supabase.from('messages').insert([payload]);
            if (error) throw error;
            toast.success(isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!');
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(isAr ? 'حدث خطأ أثناء الإرسال.' : 'Error sending message.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-0 bg-black text-white relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
            {/* Background Large Text */}
            <div className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center opacity-5">
                <h1 className="text-[20vw] font-bold text-transparent stroke-white" style={{ WebkitTextStroke: '2px white' }}>
                    {isAr ? 'اتصل بنا' : 'Contact'}
                </h1>
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-16">
                {/* Breadcrumb / Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 uppercase tracking-wider">
                        <span>{t('contact.breadcrumbHome')}</span>
                        <span>/</span>
                        <span className="text-[#9B8A5E]">{t('contact.breadcrumbCurrent')}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wide leading-tight">
                        {isAr ? 'لنتحدث عن' : 'Let\'s'} <br />
                        <span className="text-white">{isAr ? 'مشروعك التالي.' : 'Talk About Your Project.'}</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold mb-8">{t('contact.formTitle')}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    required
                                    name="full_name"
                                    type="text"
                                    placeholder={t('contact.namePlaceholder')}
                                    className="w-full bg-transparent border-b border-gray-800 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder={t('contact.mobilePlaceholder')}
                                    className="w-full bg-transparent border-b border-gray-800 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder={t('contact.emailPlaceholder')}
                                    className="w-full bg-transparent border-b border-gray-800 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    name="company"
                                    type="text"
                                    placeholder={t('contact.companyPlaceholder')}
                                    className="w-full bg-transparent border-b border-gray-800 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    name="title"
                                    type="text"
                                    placeholder={t('contact.titlePlaceholder')}
                                    className="w-full bg-transparent border-b border-gray-800 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    name="interest"
                                    type="text"
                                    placeholder={t('contact.interestPlaceholder')}
                                    className="w-full bg-transparent border-b border-gray-800 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <textarea
                                    name="project_details"
                                    placeholder={t('contact.messagePlaceholder')}
                                    rows={4}
                                    className="w-full bg-black border border-gray-800 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors resize-none rounded-sm"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 border border-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : t('contact.send')}
                            </button>
                        </form>
                    </motion.div>

                    {/* Right Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold mb-8">{t('contact.infoTitle')}</h3>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-xs font-bold tracking-widest text-[#9B8A5E] mb-4 uppercase">{t('contact.letsTalk')}</h4>
                                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">+201025299199</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold tracking-widest text-[#9B8A5E] mb-4 uppercase">{t('contact.visitUs')}</h4>
                                <p className="text-gray-400 mb-4">
                                    {isAr 
                                        ? 'برج عبيد، الدور الرابع، العياط، أمام مكتب بريد العياط، الجيزة، مصر.' 
                                        : 'Obaid Tower, 4th floor, Al Ayat, in front of Al Ayat Post Office, Giza, Egypt.'}
                                </p>
                                <a
                                    href="https://maps.app.goo.gl/Fo6dLL5NZwrQsUN17"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs text-[#9B8A5E] hover:text-white transition-colors uppercase tracking-widest font-bold"
                                >
                                    {t('contact.getDirections')}
                                </a>
                            </div>

                            {/* Social Icons */}
                            <div className="flex items-center gap-6 pt-8">
                                <a href="https://www.facebook.com/ActiveMediaEg" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 text-white group">
                                    <Facebook size={14} />
                                </a>
                                <a href="https://www.youtube.com/@activemediaeg" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 text-white group">
                                    <Youtube size={14} />
                                </a>
                                <a href="https://www.instagram.com/activemediaeg" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 text-white group">
                                    <Instagram size={14} />
                                </a>

                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <div className="w-full h-[400px] bg-gray-900 border-t border-gray-800 relative group">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.15174542289!2d31.2565243!3d29.621655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458310052cf076d%3A0xce2f12a32ec5ec53!2sActive%20Media%20EG!5e0!3m2!1sen!2seg!4v1716110000000!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                ></iframe>

                {/* Map Overlay Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/60 backdrop-blur-sm px-6 py-3 rounded text-white text-sm">
                    {isAr ? 'استخدم ctrl + scroll لتكبير الخريطة' : 'Use ctrl + scroll to zoom the map'}
                </div>
            </div>

            {/* Copyright Footer */}
            <div className="bg-[#0D0D0D] py-8 text-center border-t border-white/5">
                <p className="text-gray-500 text-xs">
                    {isAr
                        ? `${new Date().getFullYear()} © Active Media. جميع الحقوق محفوظة`
                        : `© ${new Date().getFullYear()} Active Media. All Rights Reserved.`}
                </p>
            </div>
        </div>
    );
}
