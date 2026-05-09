import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Activity, BarChart2, Bell, MapPin, Settings, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "🏠 " + t('common.dashboard'), path: "/dashboard" },
    { icon: <Activity size={20} />, label: "💊 " + t('nav.health_conditions'), path: "/health-conditions" },
    { icon: <Calendar size={20} />, label: "📅 " + t('dashboard.cycle_calendar'), path: "/calendar" },
    { icon: <Activity size={20} />, label: "📝 " + t('dashboard.symptom_tracker'), path: "/symptoms" },
    { icon: <BarChart2 size={20} />, label: "📊 " + t('dashboard.health_insights'), path: "/insights" },
    { icon: <Bell size={20} />, label: "🔔 " + t('dashboard.reminders'), path: "/reminders" },
    { icon: <MapPin size={20} />, label: "🏥 " + t('dashboard.nearby_clinics'), path: "/clinics" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-slate-200">
      
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 overflow-hidden rounded-full flex items-center justify-center">
            <img src={logo} alt="NariCycle Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">
            Nari<span className="text-primary-600">Cycle</span>
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/profile' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}`}>
          <Settings size={20} />
          👤 {t('common.profile')}
        </Link>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-health-red hover:bg-red-50 transition-colors mt-4">
          <LogOut size={20} />
          🚪 {t('common.logout')}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
