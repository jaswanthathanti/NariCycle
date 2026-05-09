import React from 'react';
import { Home, Calendar, MessageCircle, BarChart2, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: "Home", path: "/dashboard" },
    { icon: <Calendar size={24} />, label: "Calendar", path: "/calendar" },
    { icon: <MessageCircle size={24} />, label: "Chatbot", path: "/symptoms" },
    { icon: <BarChart2 size={24} />, label: "Insights", path: "/insights" },
    { icon: <User size={24} />, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`${isActive ? 'bg-primary-50' : ''} p-2 rounded-full transition-colors`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
