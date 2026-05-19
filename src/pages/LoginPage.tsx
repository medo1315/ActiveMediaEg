import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../assets/30db22424ddeca550d6f82028b6980b8e2ce95d6.png';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success(isAr ? 'أهلاً بك مجدداً!' : 'Welcome back!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(isAr ? 'عذراً، خطأ في تسجيل الدخول' : (error.message || 'Error signing in'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9B8A5E]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-28 h-20 mb-6"
          >
            <img src={logo} alt="Active Media" className="w-full h-full object-contain" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">{isAr ? 'لوحة التحكم' : 'Admin Panel'}</h1>
          <p className="text-white/40">{isAr ? 'أدخل بياناتك لإدارة أكتيف ميديا' : 'Enter your credentials to manage Active Media'}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-xs uppercase tracking-[0.2em] text-white/40 ${isAr ? 'mr-1' : 'ml-1'}`}>
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative group">
              <div className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#9B8A5E] transition-colors`}>
                <Mail size={20} />
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@activemedia.com"
                className={`w-full bg-white/5 border border-white/10 rounded-2xl ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 text-white placeholder:text-white/10 focus:border-[#9B8A5E] outline-none transition-all focus:bg-white/10`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-xs uppercase tracking-[0.2em] text-white/40 ${isAr ? 'mr-1' : 'ml-1'}`}>
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative group">
              <div className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#9B8A5E] transition-colors`}>
                <Lock size={20} />
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-white/5 border border-white/10 rounded-2xl ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 text-white placeholder:text-white/10 focus:border-[#9B8A5E] outline-none transition-all focus:bg-white/10`}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all disabled:opacity-50 mt-8 shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                <ArrowRight className={isAr ? 'rotate-180' : ''} size={20} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
