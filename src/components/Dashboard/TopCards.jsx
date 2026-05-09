import React from 'react';
import { CalendarDays, Activity, HeartPulse, Droplet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const TopCards = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const riskColor = user?.anaemiaRisk === 'High' ? 'text-health-red' : user?.anaemiaRisk === 'Moderate' ? 'text-health-orange' : 'text-health-green';
  const riskBg = user?.anaemiaRisk === 'High' ? 'bg-red-50' : user?.anaemiaRisk === 'Moderate' ? 'bg-orange-50' : 'bg-green-50';
  const riskBorder = user?.anaemiaRisk === 'High' ? 'border-red-100' : user?.anaemiaRisk === 'Moderate' ? 'border-orange-100' : 'border-green-100';

  const cards = [
    {
      title: "🩸 " + t('dashboard.avg_length'),
      value: `${user?.cycleLength || 28} Days`,
      subtitle: t('features.cycle'),
      icon: <Droplet className="text-primary-600" />,
      bg: "bg-primary-50",
      border: "border-primary-100"
    },
    {
      title: "📅 " + t('dashboard.next_predicted'),
      value: t('dashboard.days_to_period', { days: user?.anaemiaRisk === 'High' ? 4 : 14 }),
      subtitle: user?.isCritical ? "⚡ Early due to stress" : "✨ Expected " + new Date(Date.now() + (user?.anaemiaRisk === 'High' ? 4 : 14) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: <CalendarDays className="text-lavender-600" />,
      bg: "bg-lavender-50",
      border: "border-lavender-100"
    },
    {
      title: "📊 " + t('dashboard.health_summary'),
      value: user?.anaemiaRisk === 'High' ? "45/100" : "85/100",
      subtitle: user?.anaemiaRisk === 'High' ? "⚠️ Attention Required" : "✅ " + t('features.symptoms'),
      icon: <Activity className="text-health-green" />,
      bg: "bg-green-50",
      border: "border-green-100"
    },
    {
      title: "🧬 " + t('conditions.anaemia_title'),
      value: (user?.anaemiaRisk || "Low") + (user?.anaemiaRisk === 'High' ? " 🚨" : " ✨"),
      subtitle: "📝 " + t('chatbot.summary_title'),
      icon: <HeartPulse className={riskColor} />,
      bg: riskBg,
      border: riskBorder
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.bg} border ${card.border}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-sm text-slate-600">{card.subtitle}</p>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default TopCards;
