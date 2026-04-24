import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:bg-primary-700 transition-all duration-500 relative overflow-hidden border border-primary-500/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <PawPrint className="w-6 h-6 text-white transition-transform group-hover:scale-110 duration-500 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl text-slate-900 leading-none tracking-tighter">PETCARE <span className="text-primary-600">SYSTEM</span></span>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Professional Management</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Home</Link>
            <a href="#features" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Features</a>
            <a href="#services" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Services</a>
            <a href="#pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">Pricing</a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate('/app')} className="btn-primary text-sm py-2">
                Open Dashboard →
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started Free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600 hover:text-primary-600">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600">Home</Link>
            <a href="#features" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600">Features</a>
            <a href="#services" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600">Services</a>
            <hr className="my-2 border-slate-100" />
            {user ? (
              <button onClick={() => { navigate('/app'); setIsOpen(false); }} className="w-full btn-primary text-sm py-2.5">Open Dashboard</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary-50">Sign in</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full btn-primary text-sm py-2.5 text-center">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
