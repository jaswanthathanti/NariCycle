import React, { useEffect } from 'react';
import Navbar from '../../components/Landing/Navbar';
import { Apple, ArrowLeft, Droplet, Coffee, Zap, Info, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Nutrition = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleActionClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="pb-24">
        {/* Back Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-50 to-green-50 rounded-3xl p-8 sm:p-12 border border-green-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 md:w-2/3">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-health-green font-semibold text-sm mb-6 shadow-sm border border-white">
                <Apple size={16} fill="currentColor" /> Diet & Wellness
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 mb-4 leading-tight">
                Menstrual Nutrition
              </h1>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                What you eat during your menstrual cycle has a profound impact on your energy levels, mood, and pain severity. Explore dietary tips to support a healthy cycle.
              </p>
              
              <button onClick={handleActionClick} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Explore Dietary Plans
              </button>
            </div>
          </motion.div>
        </section>

        {/* Nutritional Priorities */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-2">
            <Info className="text-primary-500" /> Key Nutritional Goals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Droplet size={24} />, title: "Stay Hydrated", desc: "Drinking plenty of water reduces bloating and helps alleviate cramping." },
              { icon: <Zap size={24} />, title: "Boost Iron & Vitamins", desc: "Replenish lost iron during periods to prevent fatigue and dizziness." },
              { icon: <Apple size={24} />, title: "Fiber & Antioxidants", desc: "Fruits and vegetables ease digestion and reduce inflammation." },
              { icon: <Coffee size={24} />, title: "Limit Caffeine/Salt", desc: "Reducing salt lowers bloating; limiting caffeine can decrease breast tenderness and anxiety." }
            ].map((goal, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-health-green shrink-0">
                  {goal.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{goal.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{goal.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Diet Recommendations */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Apple className="text-health-green" /> Foods to Embrace & Avoid
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Tailoring your diet to your cycle phases can lead to a more comfortable period experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Foods to Add</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Water-rich fruits (Watermelon, Cucumber)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Leafy greens (Spinach, Kale for Iron)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Ginger & Turmeric (Anti-inflammatory)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Dark Chocolate (Magnesium for cramps)
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Foods to Limit</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-red"></div> Highly processed foods & fast food
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-red"></div> Foods high in sodium (causes bloating)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-red"></div> Refined sugars and sugary drinks
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-red"></div> Excessive caffeine
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Action Prompt */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <Zap size={32} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-800 mb-2">Track Your Energy</h3>
              <p className="text-primary-700 leading-relaxed mb-4">
                Did you know that you can log your diet and energy levels in your NariCycle dashboard? Tracking helps our AI identify patterns and recommend better lifestyle adjustments.
              </p>
              <Link to="/dashboard" className="inline-flex bg-primary-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-primary-700 transition-colors shadow-sm">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Nutrition;
