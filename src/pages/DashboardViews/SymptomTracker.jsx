import React from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import AIChatbotPanel from '../../components/Dashboard/AIChatbotPanel';
import LanguageSelector from '../../components/LanguageSelector';
import { Activity, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SymptomTracker = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-health-orange/20 rounded-full flex items-center justify-center text-health-orange">
                <Activity size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">{t('dashboard.symptom_tracker')}</h1>
                <p className="text-slate-500">Log how you're feeling to improve your insights.</p>
              </div>
            </div>
            <LanguageSelector />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Logging */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                  <ClipboardList className="text-primary-600" /> Daily Quick Log
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Flow Intensity</label>
                    <div className="flex gap-2">
                      {['None', 'Light', 'Medium', 'Heavy'].map((level) => (
                        <button key={level} className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pain/Cramps Level</label>
                    <div className="flex gap-2">
                      {['None', 'Mild', 'Moderate', 'Severe'].map((level) => (
                        <button key={level} className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mood</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {['Happy', 'Sensitive', 'Sad', 'Anxious', 'Angry'].map((mood) => (
                        <button key={mood} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors whitespace-nowrap">
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm mt-2">
                    {t('common.save')}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="h-[600px]">
              <AIChatbotPanel />
            </div>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SymptomTracker;
