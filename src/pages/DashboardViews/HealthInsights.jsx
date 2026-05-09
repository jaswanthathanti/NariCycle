import React from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import HealthTrends from '../../components/Dashboard/HealthTrends';
import LanguageSelector from '../../components/LanguageSelector';
import { BarChart2, TrendingUp, Calendar, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const HealthInsights = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <BarChart2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">{t('dashboard.health_insights')}</h1>
                <p className="text-slate-500">{t('features.desc')}</p>
              </div>
            </div>
            <LanguageSelector />
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('dashboard.avg_length')}</p>
                <p className="text-xl font-bold text-slate-900">{user?.cycleLength || 28} Days</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-health-green/20 flex items-center justify-center text-health-green">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('dashboard.symptom_tracker')}</p>
                <p className="text-xl font-bold text-health-green">{user?.anaemiaRisk === 'High' ? 'Monitoring' : 'Improving'}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-health-orange/20 flex items-center justify-center text-health-orange">
                <Target size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('dashboard.next_predicted')}</p>
                <p className="text-xl font-bold text-slate-900">92%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <HealthTrends />
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HealthInsights;
