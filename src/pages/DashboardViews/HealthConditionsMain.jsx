import React, { useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import LanguageSelector from '../../components/LanguageSelector';
import { Activity, Heart, Globe, PlusCircle, FileText, Settings, ShieldAlert, X, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateConditionRisk } from '../../services/predictionEngine';

const CONDITION_DATABASE = {
  anaemia: {
    title: "Anaemia Prevention",
    icon: <Heart className="text-health-red" />,
    bg: "bg-red-50",
    ringColor: "text-health-red",
    trackColor: "text-red-100",
    link: "/conditions/anaemia",
    severityFactors: ['fatigue', 'dizzy', 'heavyBleeding'],
    preventions: [
      { tip: "Eat iron-rich foods daily: spinach, lentils, dates, jaggery, beetroot", priority: "high" },
      { tip: "Pair iron foods with Vitamin C (lemon, orange) to boost absorption", priority: "high" },
      { tip: "Avoid tea/coffee with meals — they block iron absorption", priority: "medium" },
      { tip: "Get a Complete Blood Count (CBC) test every 6 months", priority: "medium" },
      { tip: "Take prescribed iron supplements if recommended by a doctor", priority: "high" },
      { tip: "Include B12 and folic acid sources: eggs, milk, fortified cereals", priority: "low" }
    ]
  },
  nutrition: {
    title: "Menstrual Nutrition",
    icon: <Globe className="text-health-green" />,
    bg: "bg-green-50",
    ringColor: "text-health-green",
    trackColor: "text-green-100",
    link: "/conditions/nutrition",
    severityFactors: ['nutrition'],
    preventions: [
      { tip: "Eat balanced meals with proteins, complex carbs, and healthy fats", priority: "high" },
      { tip: "Stay hydrated — drink at least 8 glasses of water daily", priority: "high" },
      { tip: "Include calcium-rich foods: milk, curd, ragi, sesame seeds", priority: "medium" },
      { tip: "Eat anti-inflammatory foods during periods: turmeric, ginger, berries", priority: "medium" },
      { tip: "Avoid excess sugar and processed foods that worsen bloating", priority: "low" },
      { tip: "Consider omega-3 sources: flaxseeds, walnuts, fish oil", priority: "low" }
    ]
  },
  pcos: {
    title: "PCOS Management",
    icon: <Activity className="text-health-orange" />,
    bg: "bg-orange-50",
    ringColor: "text-health-orange",
    trackColor: "text-orange-100",
    link: "/conditions/pcos",
    severityFactors: ['acne', 'irregularPeriods'],
    preventions: [
      { tip: "Exercise 30 minutes daily — even brisk walking helps regulate hormones", priority: "high" },
      { tip: "Maintain a healthy weight — even 5% weight loss can improve symptoms", priority: "high" },
      { tip: "Reduce refined carbs and sugar to manage insulin resistance", priority: "medium" },
      { tip: "Track your cycle regularly to identify pattern changes early", priority: "medium" },
      { tip: "Manage stress with yoga, meditation, or deep breathing exercises", priority: "high" },
      { tip: "Get hormone levels tested (LH, FSH, testosterone) annually", priority: "low" }
    ]
  },
  endometriosis: {
    title: "Endometriosis Care",
    icon: <Heart className="text-primary-500" />,
    bg: "bg-primary-50",
    ringColor: "text-primary-500",
    trackColor: "text-primary-100",
    link: "/conditions/endometriosis",
    severityFactors: ['severeCramps', 'pelvicPain'],
    preventions: [
      { tip: "Apply heat therapy during painful episodes — heating pad or warm water bottle", priority: "high" },
      { tip: "Anti-inflammatory diet: leafy greens, fatty fish, turmeric, ginger", priority: "high" },
      { tip: "Avoid red meat and trans fats which can increase inflammation", priority: "medium" },
      { tip: "Regular low-impact exercise like swimming or yoga reduces pain", priority: "medium" },
      { tip: "Keep a detailed pain diary to share with your gynecologist", priority: "high" },
      { tip: "Don't ignore worsening pain — early treatment prevents progression", priority: "high" }
    ]
  }
};

// SVG circular progress component
const CircularProgress = ({ percentage, size = 80, strokeWidth = 8, ringColor, trackColor }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth}
        className={trackColor} stroke="currentColor" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth}
        className={ringColor} stroke="currentColor"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
    </svg>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-green-50 text-green-700 border-green-200"
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const HealthConditionsMain = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Active conditions stored in state (persisted idea)
  const [activeConditions, setActiveConditions] = useState(() => {
    const saved = localStorage.getItem('naricycle_active_conditions');
    return saved ? JSON.parse(saved) : ['anaemia', 'nutrition'];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const saveConditions = (conditions) => {
    setActiveConditions(conditions);
    localStorage.setItem('naricycle_active_conditions', JSON.stringify(conditions));
  };

  const addCondition = (key) => {
    if (!activeConditions.includes(key)) {
      saveConditions([...activeConditions, key]);
    }
    setShowAddModal(false);
  };

  const removeCondition = (key) => {
    saveConditions(activeConditions.filter(c => c !== key));
    if (expandedCard === key) setExpandedCard(null);
  };

  // Calculate severity percentage from user's onboarding data using the engine
  const getSeverity = (conditionKey) => {
    return calculateConditionRisk(conditionKey, user?.onboardingResponses, user);
  };

  const availableToAdd = Object.keys(CONDITION_DATABASE).filter(k => !activeConditions.includes(k));

  const exploreModules = Object.entries(CONDITION_DATABASE)
    .filter(([key]) => !activeConditions.includes(key))
    .map(([key, val]) => ({ key, ...val }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-900">{t('nav.health_conditions')}</h1>
              <p className="text-slate-500">Monitor your health risks and get personalized prevention tips.</p>
            </div>
            <LanguageSelector />
          </header>

          {/* Active Conditions with Progress */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-heading text-slate-800">Your Active Conditions</h2>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={availableToAdd.length === 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle size={16} /> Add Condition
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeConditions.map((key) => {
                const condition = CONDITION_DATABASE[key];
                if (!condition) return null;
                const severity = getSeverity(key);
                const isExpanded = expandedCard === key;

                return (
                  <motion.div
                    key={key}
                    layout
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <CircularProgress
                              percentage={severity.percentage}
                              ringColor={condition.ringColor}
                              trackColor={condition.trackColor}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-lg font-bold ${severity.color}`}>{severity.percentage}%</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{condition.title}</h3>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${severity.color}`}>
                              {severity.percentage >= 70 ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                              {severity.label}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeCondition(key)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove condition"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Severity Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${severity.percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-2 rounded-full ${
                            severity.percentage >= 70 ? 'bg-health-red' :
                            severity.percentage >= 40 ? 'bg-health-orange' : 'bg-health-green'
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          to={condition.link}
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <FileText size={14} /> Learn More
                        </Link>
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : key)}
                          className="text-sm font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {isExpanded ? 'Hide' : 'Prevention Tips'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Prevention Tips */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <ShieldAlert size={16} className="text-primary-500" />
                              Prevention Tips to Reduce Risk
                            </h4>
                            <div className="space-y-3">
                              {condition.preventions.map((prev, idx) => (
                                <div key={idx} className="flex items-start gap-3 group">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                    prev.priority === 'high' ? 'bg-red-50 text-red-600' :
                                    prev.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-slate-700 leading-relaxed">{prev.tip}</p>
                                  </div>
                                  <PriorityBadge priority={prev.priority} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Explore More Modules */}
          {exploreModules.length > 0 && (
            <section>
              <h2 className="text-xl font-bold font-heading text-slate-800 mb-6 flex items-center gap-2">
                <ShieldAlert className="text-primary-500" /> Explore Health Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exploreModules.map((mod) => (
                  <div key={mod.key} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex items-start justify-between">
                    <Link to={mod.link} className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {mod.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{mod.title}</h3>
                        <p className="text-sm text-slate-600">Tap to learn about prevention and management.</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => addCondition(mod.key)}
                      className="ml-3 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors shrink-0"
                    >
                      + Track
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <BottomNav />

      {/* Add Condition Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Add Health Condition</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {availableToAdd.length === 0 ? (
                <p className="text-center text-slate-500 py-8">All conditions are already being tracked! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {availableToAdd.map(key => {
                    const cond = CONDITION_DATABASE[key];
                    return (
                      <button
                        key={key}
                        onClick={() => addCondition(key)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-left group"
                      >
                        <div className={`w-12 h-12 rounded-full ${cond.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          {cond.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{cond.title}</h4>
                          <p className="text-xs text-slate-500">{cond.preventions.length} prevention tips available</p>
                        </div>
                        <PlusCircle size={20} className="text-primary-400 group-hover:text-primary-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthConditionsMain;
