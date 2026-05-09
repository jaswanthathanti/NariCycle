import React, { useState } from 'react';
import { Heart, User, Mail, Lock, Calendar, Globe, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Step 1: Basic Info
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    guardianName: '',
    guardianPhone: ''
  });

  // Step 2 & 3: Onboarding
  const [healthData, setHealthData] = useState({
    regularPeriods: null,
    severeCramps: null,
    heavyBleeding: null,
    fatigue: null,
    dizzy: null,
    acne: null,
    pelvicPain: null,
    nutrition: 'good',
    sleep: 'good',
    otherConditions: ''
  });

  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (!formData.name || !formData.age || !formData.email || !formData.password || !formData.confirmPassword) {
        setError(t('common.loading'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t('common.password'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (healthData.regularPeriods === null || healthData.fatigue === null) {
        setError(t('chatbot.nodes.q_period')); // General error placeholder
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signup({ 
      ...formData, 
      onboardingResponses: healthData,
      otherConditions: healthData.otherConditions 
    });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleYesNo = (field, value) => {
    setHealthData(prev => ({ ...prev, [field]: value }));
  };

  const QuestionRow = ({ label, field }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
      <p className="font-medium text-slate-700 text-sm sm:text-base text-center sm:text-left">{label}</p>
      <div className="flex gap-2 shrink-0">
        <button 
          type="button"
          onClick={() => handleYesNo(field, 'yes')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all border-2 ${healthData[field] === 'yes' ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          {t('common.yes')}
        </button>
        <button 
          type="button"
          onClick={() => handleYesNo(field, 'no')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all border-2 ${healthData[field] === 'no' ? 'bg-slate-600 border-slate-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          {t('common.no')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-lavender-600 p-8 text-center text-white relative">
          <Link to="/" className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Heart size={32} className="text-primary-600" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">{t('auth.signup_title')}</h2>
          <p className="text-primary-100">{t('common.next')} {step} / 3: {step === 1 ? t('auth.signup_subtitle') : step === 2 ? t('chatbot.summary_title') : t('common.finish')}</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : handleNext}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.name')}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none transition-all"
                          placeholder="Anjali Sharma"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.age')}</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="number"
                          required
                          min="10"
                          max="100"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none transition-all"
                          placeholder="22"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.password')}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.password')} ({t('common.back')})</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('common.language')}</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none appearance-none cursor-pointer"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="kn">Kannada</option>
                        <option value="te">Telugu</option>
                        <option value="ta">Tamil</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Preventive Health Check</h3>
                    <p className="text-sm text-slate-500">Answer a few questions to personalize your dashboard.</p>
                  </div>

                  <QuestionRow label={t('auth.onboarding_q_regular')} field="regularPeriods" />
                  <QuestionRow label={t('auth.onboarding_q_cramps')} field="severeCramps" />
                  <QuestionRow label={t('auth.onboarding_q_heavy')} field="heavyBleeding" />
                  <QuestionRow label={t('auth.onboarding_q_fatigue')} field="fatigue" />
                  <QuestionRow label={t('auth.onboarding_q_dizzy')} field="dizzy" />
                  <QuestionRow label={t('auth.onboarding_q_acne')} field="acne" />
                  <QuestionRow label={t('auth.onboarding_q_pain')} field="pelvicPain" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 px-1">{t('auth.onboarding_q_nutrition')}</label>
                      <select 
                        value={healthData.nutrition}
                        onChange={(e) => setHealthData({...healthData, nutrition: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="good">{t('auth.onboarding_opt_good')}</option>
                        <option value="poor">{t('auth.onboarding_opt_poor')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 px-1">{t('auth.onboarding_q_sleep')}</label>
                      <select 
                        value={healthData.sleep}
                        onChange={(e) => setHealthData({...healthData, sleep: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="good">{t('auth.onboarding_opt_good')}</option>
                        <option value="poor">{t('auth.onboarding_opt_poor')}</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 py-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 text-health-green rounded-full mx-auto flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('common.finish')}!</h3>
                    <p className="text-slate-500">Add any additional details to complete your setup.</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      🛡️ Emergency Security Setup
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Guardian Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={formData.guardianName}
                            onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                            className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none"
                            placeholder="Father/Mother/Guardian"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Guardian Phone (WhatsApp)</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={formData.guardianPhone}
                            onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                            className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none"
                            placeholder="91XXXXXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('nav.health_conditions')}</label>
                    <textarea
                      rows="2"
                      value={healthData.otherConditions}
                      onChange={(e) => setHealthData({...healthData, otherConditions: e.target.value})}
                      className="block w-full p-4 border border-slate-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-slate-50 outline-none resize-none transition-all"
                      placeholder="e.g., PCOS, Endometriosis, Thyroid issues..."
                    ></textarea>
                  </div>

                  <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <input id="terms" type="checkbox" required className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer" />
                    <label htmlFor="terms" className="ml-3 block text-sm text-slate-600 cursor-pointer">
                      {t('auth.onboarding_check')}
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                  {t('common.back')}
                </button>
              ) : (
                <p className="text-sm text-slate-600">
                  {t('auth.already_account')} <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">{t('common.login')}</Link>
                </p>
              )}
              
              <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-md hover:bg-primary-700 hover:-translate-y-0.5 transition-all">
                {step === 3 ? t('common.signup') : t('common.next')} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
