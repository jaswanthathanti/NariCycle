import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
];

const LanguageSelector = ({ mobile = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  if (mobile) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-3">Select Language</p>
        <div className="grid grid-cols-2 gap-2 px-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                i18n.language === lang.code
                  ? 'bg-primary-50 border-primary-200 text-primary-600'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}
            >
              <span className="text-sm font-bold">{lang.native}</span>
              <span className="text-xs opacity-70">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition-colors bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm"
      >
        <Globe size={18} className="text-primary-500" />
        <span>{currentLanguage.native}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
            >
              <div className="grid grid-cols-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-primary-50 text-primary-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{lang.native}</span>
                      <span className="text-xs opacity-60 font-normal">{lang.name}</span>
                    </div>
                    {i18n.language === lang.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
