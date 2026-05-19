import { motion } from 'framer-motion';
import bgImage from '../assets/1a926a2cd86cf9ac49817308fe17ca28e058fba7.jpeg';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0b0b]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-white p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ lineHeight: 1, letterSpacing: "0.5px" }} dir="ltr" className="exclude-rtl">
          <div style={{ display: "flex", alignItems: "baseline", gap: 'clamp(8px, 1.5vw, 16px)', marginBottom: 6, justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Gotham Pro, sans-serif', fontWeight: 800, fontSize: "clamp(36px, 8vw, 90px)" }}>FLY</span>
            <span style={{
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 700,
              fontSize: "clamp(32px, 7vw, 84px)",
              background: "linear-gradient(90deg, #f6d07a 0%, #ff6bd6 55%, #b44bff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              transform: "translateY(2px)"
            }}>Your</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 'clamp(12px, 2vw, 24px)', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Gotham Pro, sans-serif', fontWeight: 900, fontSize: "clamp(42px, 9vw, 110px)" }}>BRAND</span>
            <span style={{ fontFamily: 'Gotham Pro, sans-serif', fontWeight: 900, fontSize: "clamp(42px, 9vw, 110px)" }}>HIGH</span>
          </div>
          <div style={{ marginTop: 16, fontWeight: 700, fontSize: "clamp(18px, 4vw, 32px)", opacity: 0.95, letterSpacing: "4px", fontFamily: 'Gotham Pro, sans-serif', textAlign: "center" }}>
            WITH US.
          </div>
        </div>
      </motion.div>
    </section>
  );
}