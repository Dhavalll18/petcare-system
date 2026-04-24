import { Link } from 'react-router-dom';
import { PawPrint, ExternalLink, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">PetCare<span className="text-primary-400">.</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The modern platform for pet parents who want the best care for their furry family members.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-slate-400 text-sm hover:text-white transition-colors">Features</a></li>
              <li><a href="#services" className="text-slate-400 text-sm hover:text-white transition-colors">Services</a></li>
              <li><Link to="/register" className="text-slate-400 text-sm hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/register" className="text-slate-400 text-sm hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} PetCare System. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><ExternalLink className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
