import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PhilosophyPage } from './pages/PhilosophyPage';
import { ClientsPage } from './pages/ClientsPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import AdminDashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { Toaster } from 'sonner';
import { supabase } from './lib/supabase';
import logo from './assets/30db22424ddeca550d6f82028b6980b8e2ce95d6.png';

function AppContent() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Smooth scroll to top and show transition overlay whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isAdminPage) {
      setIsPageLoading(true);
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAdminPage]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthChecking) return null;
    if (!session) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <div className={`min-h-screen ${!isAdminPage ? 'bg-[#0D0D0D] text-white' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Global Breathtaking Page Transition Overlay */}
      <AnimatePresence>
        {isPageLoading && !isAdminPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0D0D0D]/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 rounded-full bg-[#9B8A5E]/20 animate-ping" />
              <div className="absolute w-28 h-28 rounded-full bg-[#9B8A5E]/10 animate-pulse" />
              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-[#9B8A5E]/30 flex items-center justify-center backdrop-blur-xl shadow-2xl shadow-[#9B8A5E]/20 z-10 p-4">
                <img src={logo} alt="Active Media" className="w-full h-full object-contain animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2 z-10">
              <h3 className="font-bold text-xl tracking-widest text-white">
                {isAr ? 'جاري الانتقال...' : 'Loading...'}
              </h3>
              <p className="text-xs text-[#9B8A5E] tracking-[0.3em] uppercase font-light">
                {isAr ? 'أكتيف ميديا للإعلام والتسويق' : 'Active Media Agency'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 20, 0.7)',
            backdropFilter: 'blur(12px) saturate(160%)',
            WebkitBackdropFilter: 'blur(12px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
            fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Gotham Pro, sans-serif'
          },
        }}
      />
      
      {!isAdminPage && <Header onOpenContact={() => setIsContactModalOpen(true)} />}

      <Routes>
        <Route path="/" element={<HomePage onOpenContact={() => setIsContactModalOpen(true)} />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {!isAdminPage && <Footer />}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;