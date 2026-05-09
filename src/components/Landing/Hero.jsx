import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, CalendarDays, AlertTriangle, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 to-white pt-16 pb-24 lg:pt-32 lg:pb-32">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-primary-200/40 to-lavender-200/40 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left: Text + CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6 shadow-sm border border-primary-200/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
              </span>
              {t('hero.badge')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-slate-900 leading-tight mb-6">
              {t('hero.title_1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-lavender-600">✨ {t('hero.title_2')}</span> <br />
              {t('hero.title_3')} 🌸
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/dashboard" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                🚀 {t('common.get_started')} <ArrowRight size={20} />
              </Link>
              <a href="#features" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border-2 border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all">
                📖 {t('common.learn_more')}
              </a>
            </div>
          </motion.div>

          {/* Right: Illustration & Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            {/* Central Mockup/Graphic Element */}
            <div className="relative mx-auto w-full max-w-md aspect-[4/5] bg-gradient-to-br from-primary-100 to-lavender-100 rounded-[2rem] p-6 shadow-2xl border border-white flex flex-col justify-between">
              
              <div className="flex justify-between items-center bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm">
                <div>
                  <p className="text-sm text-slate-500 font-medium">📅 Next Period</p>
                  <p className="text-2xl font-bold text-primary-600">in 4 Days 🩸</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <CalendarDays className="text-primary-600" />
                </div>
              </div>
              
              {/* Chat Bubble Mockup */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md w-4/5 self-end mt-4">
                <p className="text-sm font-medium text-slate-700">👋 {t('chatbot.nodes.start')}</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-primary-50 text-primary-600 rounded-lg py-1 text-sm font-semibold border border-primary-100">✅ {t('common.yes')}</button>
                  <button className="flex-1 bg-slate-50 text-slate-600 rounded-lg py-1 text-sm font-semibold border border-slate-200">❌ {t('common.no')}</button>
                </div>
              </div>

              {/* Health Score Mockup */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-md mt-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-health-green flex items-center justify-center">
                  <span className="font-bold text-lg text-health-green">85</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">📊 Health Score</p>
                  <p className="text-sm text-slate-500">Looking great! ✨</p>
                </div>
              </div>
            </div>

            {/* Floating Features */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-6 top-20 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex"
            >
              <div className="bg-lavender-100 p-2 rounded-lg"><MessageCircle size={20} className="text-lavender-600" /></div>
              <span className="font-semibold text-sm text-slate-700">🤖 AI Chatbot</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 top-1/2 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex"
            >
              <div className="bg-health-red/10 p-2 rounded-lg"><AlertTriangle size={20} className="text-health-red" /></div>
              <span className="font-semibold text-sm text-slate-700">🚨 Emergency Alerts</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-2 bottom-10 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex"
            >
              <div className="bg-primary-100 p-2 rounded-lg"><MapPin size={20} className="text-primary-600" /></div>
              <span className="font-semibold text-sm text-slate-700">🏥 Nearby Clinics</span>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
