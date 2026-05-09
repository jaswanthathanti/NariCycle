import React, { useState } from 'react';
import { Menu, X, Heart, ChevronDown, Activity, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../Shared/LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-md">
                <Heart size={24} fill="white" />
              </div>
              <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
                Nari<span className="text-primary-600">Cycle</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">{t('common.home')}</Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => setShowConditions(true)}
              onMouseLeave={() => setShowConditions(false)}
            >
              <button className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1 py-2">
                {t('nav.health_conditions')} <ChevronDown size={16} />
              </button>
              
              {showConditions && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-3 z-50">
                  <Link to="/conditions/anaemia" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <Heart size={18} className="text-health-red" />
                    {t('conditions.anaemia_title')}
                  </Link>
                  <Link to="/conditions/pcos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <Activity size={18} className="text-health-orange" />
                    {t('conditions.pcos_title')}
                  </Link>
                  <Link to="/conditions/endometriosis" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <Heart size={18} className="text-primary-500" />
                    {t('conditions.endo_title')}
                  </Link>
                  <Link to="/conditions/nutrition" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <Globe size={18} className="text-health-green" />
                    {t('conditions.nutrition_title')}
                  </Link>
                </div>
              )}
            </div>

            <a href="#about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">{t('nav.about')}</a>
            <a href="#features" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">{t('nav.features')}</a>
            <a href="#contact" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Contact</a>
            <a href="#sos" className="text-health-red hover:text-red-700 font-bold transition-colors flex items-center gap-1">🚨 SOS</a>
            
            <LanguageSelector />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  {t('common.dashboard')}
                </Link>
                <button onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm">
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  {t('common.login')}
                </Link>
                <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  {t('common.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary-600 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-primary-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" className="block px-3 py-3 rounded-md text-base font-medium text-slate-800 hover:text-primary-600 hover:bg-primary-50">{t('common.home')}</Link>
            
            <div className="px-3 py-2">
              <p className="text-base font-medium text-slate-800 mb-2">{t('nav.health_conditions')}</p>
              <div className="pl-4 space-y-2 border-l-2 border-slate-100">
                <Link to="/conditions/anaemia" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  <Heart size={16} className="text-health-red" /> {t('conditions.anaemia_title')}
                </Link>
                <Link to="/conditions/pcos" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  <Activity size={16} className="text-health-orange" /> {t('conditions.pcos_title')}
                </Link>
                <Link to="/conditions/endometriosis" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  <Heart size={16} className="text-primary-500" /> {t('conditions.endo_title')}
                </Link>
                <Link to="/conditions/nutrition" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600" onClick={() => setIsOpen(false)}>
                  <Globe size={16} className="text-health-green" /> {t('conditions.nutrition_title')}
                </Link>
              </div>
            </div>

            <a href="#about" className="block px-3 py-3 rounded-md text-base font-medium text-slate-800 hover:text-primary-600 hover:bg-primary-50">{t('nav.about')}</a>
            <a href="#features" className="block px-3 py-3 rounded-md text-base font-medium text-slate-800 hover:text-primary-600 hover:bg-primary-50">{t('nav.features')}</a>
            <a href="#contact" className="block px-3 py-3 rounded-md text-base font-medium text-slate-800 hover:text-primary-600 hover:bg-primary-50">Contact</a>
            <a href="#sos" className="block px-3 py-3 rounded-md text-base font-bold text-health-red hover:bg-red-50">🚨 SOS Emergency</a>
            
            <div className="py-4">
              <LanguageSelector mobile={true} />
            </div>
            
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="w-full flex justify-center items-center px-4 py-3 border border-primary-200 rounded-full text-base font-medium text-primary-600 bg-primary-50">
                    {t('common.dashboard')}
                  </Link>
                  <button onClick={handleLogout} className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-full text-base font-medium text-slate-700 bg-slate-100">
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full flex justify-center items-center px-4 py-3 border border-primary-200 rounded-full text-base font-medium text-primary-600 bg-primary-50">
                    {t('common.login')}
                  </Link>
                  <Link to="/signup" className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700">
                    {t('common.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
