import React from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import CycleCalendar from '../../components/Dashboard/CycleCalendar';
import LanguageSelector from '../../components/LanguageSelector';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

const CycleCalendarPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">Cycle Calendar</h1>
                <p className="text-slate-500">Track your past and predicted cycles.</p>
              </div>
            </div>
            <LanguageSelector />
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
            <CycleCalendar />
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 flex gap-4 items-start">
            <Info size={24} className="text-primary-600 shrink-0" />
            <div>
              <h3 className="font-bold text-primary-800 mb-1">How predictions work</h3>
              <p className="text-primary-700 text-sm leading-relaxed">
                NariCycle predicts your next cycle based on your tracked history. The more consistently you log your period start and end dates, the more accurate the predictions become. Fertile windows are estimated roughly 14 days before your predicted next period start.
              </p>
            </div>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CycleCalendarPage;
