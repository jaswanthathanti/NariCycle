import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white">
                <Heart size={18} fill="white" />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                Nari<span className="text-primary-500">Cycle</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              Empowering women in rural and low-connectivity regions with AI-driven preventive healthcare and menstrual tracking.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-400 transition-colors">How It Works</a></li>
              <li><a href="#clinics" className="hover:text-primary-400 transition-colors">Nearby Clinics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-primary-400 transition-colors">FAQ</a></li>
              <li><a href="#privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} NariCycle. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
