import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 min-h-[85vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Enterprise Badge */}
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-2 mb-10 shadow-2xl">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-primary-500"></div>)}
              </div>
              <span className="text-[10px] text-white font-black uppercase tracking-[0.3em]">
                Complete Pet Management Platform
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black text-white leading-[0.9] tracking-tighter mb-8">
              PREMIUM CARE<br />
              <span className="text-primary-500">REDEFINED</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              "The most comprehensive ecosystem for tracking health, managing appointments, and ensuring a better life for your furry companions."
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="group bg-primary-600 text-white font-black py-5 px-12 rounded-2xl
                         hover:bg-primary-500 transition-all duration-500 shadow-2xl shadow-primary-600/30
                         flex items-center gap-3 text-sm uppercase tracking-widest"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="bg-white/5 text-white font-black py-5 px-12 rounded-2xl border border-white/10
                         hover:bg-white/10 hover:border-white/20 transition-all duration-500 flex items-center gap-3 text-sm uppercase tracking-widest"
              >
                Live Demo
              </Link>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              256-bit Encryption
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              GDPR Compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              99.9% Uptime
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
