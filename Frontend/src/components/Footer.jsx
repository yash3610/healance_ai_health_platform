import React from 'react';
import { Activity, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-1.5 rounded-lg">
                <Activity className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">Healance</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering your health journey with advanced AI analytics and personalized wellness insights.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/features" className="hover:text-primary-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/blogs" className="hover:text-primary-400 transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Support</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>BKC, Bandra East, Mumbai</li>
              <li className="break-all">support@healance.ai</li>
              <li>+91 22 1234 5678</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-500">
          © {new Date().getFullYear()} Healance AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
