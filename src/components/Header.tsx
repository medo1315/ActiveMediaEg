import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Languages, Home, Lightbulb, Building2, FolderOpen, Briefcase, Users, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/30db22424ddeca550d6f82028b6980b8e2ce95d6.png';
import { BrandingTagline } from './BrandingTagline';
import { useLanguage } from '../contexts/LanguageContext';


interface HeaderProps {
  onOpenContact: () => void;
}

export function Header({ onOpenContact }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  const handleNavigation = (path: string, sectionId?: string) => {
    setIsMenuOpen(false);

    if (path === 'contact') {
      // Legacy check
      onOpenContact();
      return;
    }

    // Always navigate to the path first
    navigate(path);

    // If there is a sectionId, wait a tick then scroll
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If simply navigating top to a new page, window scrollTo top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const menuItems = [
    { path: '/', sectionId: 'home', label: t('nav.home'), icon: Home },
    { path: '/philosophy', label: t('nav.philosophy'), icon: Lightbulb },
    { path: '/clients', label: t('nav.clients'), icon: Building2 },
    { path: '/portfolio', label: t('nav.portfolio'), icon: FolderOpen },
    { path: '/services', label: t('nav.services'), icon: Briefcase },
    { path: '/team', label: t('nav.team'), icon: Users },
    { path: '/contact', label: t('nav.contact'), icon: Mail }
  ];


  return (
    <>
      <motion.header
        className={`fixed top-0 ${language === 'ar' ? 'left-0 right-0' : 'left-0 right-0'} z-[100] transition-all duration-500 ${isScrolled
          ? 'bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Magnetic Effect */}
            <Link to="/">
              <motion.div
                className="relative flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)"
                  }}
                />
                <img src={logo} alt="Active Media" className="h-14 w-auto relative z-10" />
              </motion.div>
            </Link>

            {/* Desktop Menu with Language Toggle */}
            <div className="hidden md:flex items-center gap-3">
              {/* Navigation Pills */}
              <nav className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full px-3 py-2 border border-white/10">
                {menuItems.map((item, index) => {
                  // Check if current page matches this item
                  const isActive =
                    (item.sectionId === 'home' && location.pathname === '/') ||
                    (location.pathname === item.path);

                  const buttonContent = (
                    <>
                      {/* Active Background */}
                      {isActive && (
                        <div className="absolute inset-0 bg-white rounded-full" />
                      )}

                      {/* Hover Glow Effect */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-white/0 hover:bg-white/10 rounded-full transition-colors duration-300" />
                      )}

                      <span className="relative z-10">{item.label}</span>
                    </>
                  );

                  if (item.sectionId && location.pathname === '/') {
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleNavigation(item.path, item.sectionId)}
                        className={`relative px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-300 rounded-full ${isActive ? 'text-black' : 'text-white/70 hover:text-white'
                          }`}
                        whileHover={{ scale: isActive ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {buttonContent}
                      </motion.button>
                    );
                  }

                  return (
                    <Link key={index} to={item.path}>
                      <motion.div
                        className={`relative px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-300 rounded-full ${isActive ? 'text-black' : 'text-white/70 hover:text-white'
                          }`}
                        whileHover={{ scale: isActive ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {buttonContent}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              {/* Language Toggle Button */}
              <motion.button
                onClick={toggleLanguage}
                className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 group"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.9 }}
              >
                <Languages size={18} className="text-white/70 group-hover:text-white transition-colors" />
                <motion.span
                  className="absolute -bottom-6 text-xs text-white/50 whitespace-nowrap font-light"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {language === 'ar' ? 'EN' : 'عربي'}
                </motion.span>

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)"
                  }}
                />
              </motion.button>
            </div>

            {/* Mobile Header Elements (Logo is already there) */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xs text-white/70 font-medium">
                  {language === 'ar' ? 'EN' : 'ع'}
                </span>
              </motion.button>
            </div>

          </div>
        </div>

        {/* Full Screen Menu Overlay (still used for 'More' or explicit menu trigger) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-[#0D0D0D] z-[90] overflow-y-auto"
              style={{ paddingTop: '80px', paddingBottom: '100px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button specific for the overlay mode */}
              <div className="absolute top-6 right-6 z-[100]">
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Decorative Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              <nav className="container mx-auto px-6 py-8 min-h-[calc(100vh-180px)] flex flex-col justify-center gap-3 relative z-[95]">
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path && (item.sectionId ? location.hash === `#${item.sectionId}` : true);
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavigation(item.path, item.sectionId)}
                      className={`group relative overflow-hidden rounded-2xl transition-all ${isActive
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {/* Hover Gradient Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)"
                        }}
                      />

                      <div className="flex items-center gap-4 px-6 py-5 relative z-10 flex-row">
                        {/* Icon */}
                        <div className={`relative ${isActive
                          ? 'text-black'
                          : 'text-white/60 group-hover:text-white'
                          }`}>
                          <Icon size={24} strokeWidth={1.5} />

                          {/* Icon Glow Effect */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 blur-lg"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Icon size={24} />
                            </motion.div>
                          )}
                        </div>

                        {/* Label */}
                        <span className="flex-1 text-lg font-light tracking-wide text-left">
                          {item.label}
                        </span>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 bg-black rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30
                            }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}

                {/* Decorative Line */}
                <motion.div
                  className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />

                {/* Active Media Info */}
                <motion.div
                  className="text-center space-y-2 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <BrandingTagline />
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Floating Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-lg pointer-events-none">
        <div className="pointer-events-auto bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50 w-full mx-auto p-1.5">
          <nav className="flex items-center justify-between overflow-x-auto no-scrollbar px-1 py-1">
            {menuItems.map((item) => {
              const isActive = item.sectionId === 'home'
                ? (location.pathname === '/' && !isMenuOpen)
                : (location.pathname === item.path && !isMenuOpen);

              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleNavigation(item.path, item.sectionId);
                  }}
                  className="relative flex flex-col items-center justify-center flex-1 min-w-[3rem] h-12 group rounded-full"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute inset-0 bg-white rounded-full w-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-black' : 'text-white/50 group-hover:text-white'}`}>
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

    </>
  );
}