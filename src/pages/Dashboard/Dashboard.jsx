import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import TopCards from '../../components/Dashboard/TopCards';
import CycleCalendar from '../../components/Dashboard/CycleCalendar';
import HealthTrends from '../../components/Dashboard/HealthTrends';
import AIChatbotPanel from '../../components/Dashboard/AIChatbotPanel';
import EmergencyBanner from '../../components/Dashboard/EmergencyBanner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

import LanguageSelector from '../../components/LanguageSelector';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [hasEmergency, setHasEmergency] = useState(false);

  useEffect(() => {
    if (user?.isCritical || user?.anaemiaRisk === 'High') {
      setHasEmergency(true);
    } else {
      setHasEmergency(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">🌸 {t('dashboard.welcome', { name: user?.name || 'User' })}</h1>
                <p className="text-slate-500">✨ {t('dashboard.health_summary')}</p>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSelector />
                <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-100">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">🌟 Premium Health Active</span>
                </div>
              </div>
            </div>
          </header>

          {/* Emergency Banner */}
          {hasEmergency && <EmergencyBanner />}

          {/* Top Cards */}
          <TopCards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Left: Health Trends & Calendar */}
            <div className="lg:col-span-2 space-y-8">
              <CycleCalendar />
              <HealthTrends />
            </div>

            {/* Right Column (Chatbot) */}
            <div className="lg:col-span-1 h-[600px]">
              <div className="sticky top-8 h-full">
                <AIChatbotPanel />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Dashboard;
