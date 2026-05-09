import React, { useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import LanguageSelector from '../../components/LanguageSelector';
import { Bell, Droplet, Pill, Calendar, Plus, Trash2 } from 'lucide-react';

const Reminders = () => {
  const [reminders, setReminders] = useState([
    { id: 1, type: 'pill', title: 'Take Iron Supplement', time: '08:00 AM', status: 'upcoming', icon: <Pill size={20} className="text-health-orange" />, bg: 'bg-orange-50' },
    { id: 2, type: 'water', title: 'Hydration Check', time: '12:00 PM', status: 'upcoming', icon: <Droplet size={20} className="text-health-green" />, bg: 'bg-green-50' },
    { id: 3, type: 'calendar', title: 'Period Expected', time: 'In 2 days', status: 'alert', icon: <Calendar size={20} className="text-health-red" />, bg: 'bg-red-50' }
  ]);

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600">
                <Bell size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">Reminders</h1>
                <p className="text-slate-500">Manage your daily health notifications.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <button className="hidden sm:flex px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md items-center gap-2">
                <Plus size={18} /> Add Reminder
              </button>
            </div>
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">Today's Schedule</h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Bell size={32} className="mx-auto mb-3 text-slate-300" />
                  <p>No reminders set. Add one to get started!</p>
                </div>
              ) : (
                reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${reminder.bg}`}>
                        {reminder.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{reminder.title}</h3>
                        <p className="text-sm font-medium text-slate-500">{reminder.time}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 lg:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile Add Button */}
          <button className="sm:hidden w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl text-md font-bold hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2">
            <Plus size={20} /> Add Reminder
          </button>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Reminders;
