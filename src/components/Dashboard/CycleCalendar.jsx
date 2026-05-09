import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { predictCycle } from '../../services/predictionEngine';

const CycleCalendar = () => {
  const { user } = useAuth();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDayStatus = (day) => {
    return predictCycle(day, user);
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const getDayClasses = (status, todayFlag) => {
    let classes = "flex items-center justify-center w-full h-10 sm:h-12 rounded-full text-sm font-medium transition-all ";
    
    if (todayFlag) classes += "ring-2 ring-primary-600 ring-offset-2 ";

    switch (status) {
      case 'period':
        return classes + "bg-primary-500 text-white shadow-sm shadow-primary-200";
      case 'ovulation':
        return classes + "bg-lavender-500 text-white shadow-sm shadow-lavender-200";
      case 'fertile':
        return classes + "bg-lavender-100 text-lavender-700";
      default:
        return classes + "bg-transparent text-slate-700 hover:bg-slate-100 cursor-pointer";
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-heading text-slate-900">Cycle Calendar</h2>
        <div className="flex items-center gap-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <span className="font-semibold text-slate-800 min-w-[150px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-6">
        {daysOfWeek.map(day => (
          <div key={day} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
        
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="w-full h-10 sm:h-12" />
        ))}
        
        {days.map(day => {
          const status = getDayStatus(day);
          const todayFlag = isToday(day);
          return (
            <div key={day} className="flex justify-center">
              <div className={getDayClasses(status, todayFlag)}>
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span className="text-sm text-slate-600">Period Phase</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lavender-100"></div>
          <span className="text-sm text-slate-600">Fertile Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lavender-500"></div>
          <span className="text-sm text-slate-600">Ovulation</span>
        </div>
      </div>
    </div>
  );
};

export default CycleCalendar;
