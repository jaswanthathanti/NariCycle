import React, { useEffect } from 'react';
import Navbar from '../../components/Landing/Navbar';
import { Heart, Activity, ArrowLeft, Droplet, Coffee, AlertCircle, Apple, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Anaemia = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleActionClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="pb-24">
        {/* Back Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft size={20} /> {t('common.back')}
          </Link>
        </div>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-50 to-lavender-100 rounded-3xl p-8 sm:p-12 border border-primary-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 md:w-2/3">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-health-red font-semibold text-sm mb-6 shadow-sm border border-white">
                <Droplet size={16} fill="currentColor" /> {t('hero.badge')}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 mb-4 leading-tight">
                {t('conditions.anaemia_title')}
              </h1>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                {t('conditions.anaemia_desc')}
              </p>
              
              <button onClick={handleActionClick} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                {t('conditions.prevention')}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Symptoms Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-2">
            <Activity className="text-primary-500" /> {t('conditions.symptoms')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Coffee size={24} />, title: t('conditions.anaemia_symptom_1'), desc: t('conditions.anaemia_symptom_1_desc') },
              { icon: <Heart size={24} />, title: t('conditions.anaemia_symptom_2'), desc: t('conditions.anaemia_symptom_2_desc') },
              { icon: <AlertCircle size={24} />, title: t('conditions.anaemia_symptom_3'), desc: t('conditions.anaemia_symptom_3_desc') },
              { icon: <Droplet size={24} />, title: t('conditions.anaemia_symptom_4'), desc: t('conditions.anaemia_symptom_4_desc') }
            ].map((symptom, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  {symptom.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{symptom.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{symptom.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prevention & Care Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Apple className="text-health-green" /> {t('conditions.prevention')} & {t('nav.nutrition')}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {t('features.desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Iron-Rich Foods</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Spinach & Dark Leafy Greens
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Beetroot & Pomegranates
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Lentils & Beans
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Dates & Raisins
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Vitamin C Boosters</h3>
                <p className="text-sm text-slate-600 mb-2">Vitamin C helps your body absorb iron more efficiently. Pair iron-rich foods with:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-orange"></div> Oranges & Citrus Fruits
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-orange"></div> Tomatoes
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-orange"></div> Bell Peppers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Warning */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <PlusCircle size={32} className="text-health-red" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">{t('conditions.seek_medical')}</h3>
              <p className="text-red-700 leading-relaxed">
                {t('conditions.seek_medical_desc')}
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Anaemia;
