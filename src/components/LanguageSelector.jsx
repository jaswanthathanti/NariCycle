import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' }
];

const LanguageSelector = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    // Clear chatbot session so it restarts in new language
    localStorage.removeItem('naricycle_chat_session');
    setOpen(false);
  };

  const isDark = variant === 'dark';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          isDark
            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors ${
                lang.code === current.code ? 'text-primary-600 font-bold bg-primary-50/50' : 'text-slate-700'
              }`}
            >
              <div>
                <span className="font-medium">{lang.native}</span>
                <span className="text-xs text-slate-400 ml-2">{lang.name}</span>
              </div>
              {lang.code === current.code && <Check size={16} className="text-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
