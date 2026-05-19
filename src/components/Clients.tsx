import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export function Clients() {
  const { language } = useLanguage();
  const [dbClients, setDbClients] = useState<any[]>([]);
  const visibleClientsCount = 4;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setDbClients(data);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (dbClients.length === 0) return;
    
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + visibleClientsCount) % dbClients.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [dbClients.length]);

  const currentClients = dbClients.length > 0 
    ? dbClients.slice(startIndex, startIndex + visibleClientsCount)
    : [];

  // Handle wrap-around for slider
  if (dbClients.length > 0 && currentClients.length < visibleClientsCount && dbClients.length >= visibleClientsCount) {
    currentClients.push(...dbClients.slice(0, visibleClientsCount - currentClients.length));
  }

  return (
    <section id="clients" className="relative py-20 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
      {/* Background 'Clients' Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
        <h2 className="text-[15vw] font-bold text-transparent stroke-white opacity-[0.03] tracking-wider" style={{ WebkitTextStroke: '2px white' }}>
          Clients
        </h2>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-[#9B8A5E] text-sm md:text-base tracking-[0.5em] uppercase mb-4 font-light">
            {language === 'ar' ? 'عملائنا السعداء' : 'OUR HAPPY & SATISFIED'}
          </h3>
          <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight">
            {language === 'ar' ? 'العملاء' : 'CLIENTS'}
          </h2>
        </motion.div>

        {/* Sliding Logos */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 items-center justify-items-center">
            <AnimatePresence mode="popLayout">
              {currentClients.map((client, index) => (
                <motion.div
                  key={`${startIndex}-${index}`}
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="w-full flex justify-center"
                >
                  <div className="w-full aspect-square md:aspect-video flex items-center justify-center transition-all duration-300 opacity-100 hover:opacity-100 p-2">
                    {client.logo_url ? (
                      <img 
                        src={client.logo_url} 
                        alt={client.name} 
                        className="max-w-full max-h-full object-contain transform group-hover:scale-110" 
                      />
                    ) : (
                      <span className="text-white text-xl md:text-3xl font-bold text-center tracking-tighter">
                        {client.name}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
