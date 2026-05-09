import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CalendarHeart, Activity, AlertOctagon, WifiOff, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const featuresList = [
    {
      icon: <Bot size={28} className="text-primary-600" />,
      title: t('features.cycle'),
      description: t('features.cycle_desc'),
      bg: "bg-primary-50",
      border: "border-primary-100"
    },
    {
      icon: <CalendarHeart size={28} className="text-lavender-600" />,
      title: t('chatbot.name'),
      description: t('chatbot.status'),
      bg: "bg-lavender-50",
      border: "border-lavender-100"
    },
    {
      icon: <Activity size={28} className="text-health-green" />,
      title: t('features.symptoms'),
      description: t('features.symptoms_desc'),
      bg: "bg-green-50",
      border: "border-green-100"
    },
    {
      icon: <AlertOctagon size={28} className="text-health-red" />,
      title: t('chatbot.emergency_warning'),
      description: t('chatbot.emergency_desc'),
      bg: "bg-red-50",
      border: "border-red-100"
    },
    {
      icon: <WifiOff size={28} className="text-slate-600" />,
      title: t('features.anaemia'),
      description: t('features.anaemia_desc'),
      bg: "bg-slate-100",
      border: "border-slate-200"
    },
    {
      icon: <Languages size={28} className="text-health-orange" />,
      title: t('nav.select_language'),
      description: t('hero.desc'),
      bg: "bg-orange-50",
      border: "border-orange-100"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-slate-600">
            {t('features.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-[2rem] border ${feature.border} hover:shadow-xl transition-all duration-300 group bg-white hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
