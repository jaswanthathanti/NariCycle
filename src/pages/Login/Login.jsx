import React, { useState, useEffect } from 'react';
import { Heart, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.loggedOut) {
      setSuccessMsg(t('common.logout'));
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location, t]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setError(t('common.loading')); // Using a placeholder for now
      return;
    }

    const result = login(email, password, rememberMe);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-50 to-lavender-100 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-md text-center">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl rotate-12">
            <Heart size={48} className="text-primary-500 -rotate-12" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">{t('auth.login_title')} {t('common.app_name')}</h2>
          <p className="text-lg text-slate-700">{t('hero.desc')}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-full flex items-center gap-2 shadow-lg z-50 w-max"
            >
              <CheckCircle size={20} className="text-health-green" />
              <span className="font-medium text-sm">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-md">
                <Heart size={20} fill="white" />
              </div>
              <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
                Nari<span className="text-primary-600">Cycle</span>
              </span>
            </Link>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">{t('common.login')}</h1>
            <p className="text-slate-500">{t('auth.login_subtitle')}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">{t('common.password')}</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('auth.forgot_password')}</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                {t('auth.remember_me')}
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:-translate-y-0.5"
            >
              {t('common.login')} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              {t('auth.no_account')}{' '}
              <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                {t('common.signup')}
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-lavender-50 rounded-xl p-4 border border-lavender-100 text-sm text-slate-600 text-center">
            <p className="font-semibold text-lavender-800 mb-1">{t('auth.demo_creds')}</p>
            <p>{t('common.email')}: <span className="font-mono font-medium">demo@naricycle.com</span></p>
            <p>{t('common.password')}: <span className="font-mono font-medium">demo123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
