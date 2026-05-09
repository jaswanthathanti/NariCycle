import React, { useEffect } from 'react';
import Navbar from '../../components/Landing/Navbar';
import { Activity, ArrowLeft, PlusCircle, Smile, Calendar, Moon, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const PCOS = () => {
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
            className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-3xl p-8 sm:p-12 border border-orange-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 md:w-2/3">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-health-orange font-semibold text-sm mb-6 shadow-sm border border-white">
                <Activity size={16} fill="currentColor" /> Hormonal Health
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 mb-4 leading-tight">
                PCOS Management
              </h1>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder. While it can cause irregular cycles and other symptoms, lifestyle changes and awareness can significantly improve quality of life.
              </p>
              
              <button onClick={handleActionClick} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Explore Care Plans
              </button>
            </div>
          </motion.div>
        </section>

        {/* Symptoms Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-2">
            <Activity className="text-primary-500" /> Common Symptoms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Calendar size={24} />, title: "Irregular Cycles", desc: "Infrequent, irregular or prolonged menstrual periods." },
              { icon: <Activity size={24} />, title: "Weight Fluctuations", desc: "Difficulty losing weight or sudden, unexplained weight gain." },
              { icon: <Smile size={24} />, title: "Skin Changes", desc: "Severe acne or darkening of skin, particularly along neck creases." },
              { icon: <Moon size={24} />, title: "Mood Changes", desc: "Increased anxiety, mood swings, or symptoms of depression." }
            ].map((symptom, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-health-orange shrink-0">
                  {symptom.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{symptom.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{symptom.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prevention & Care Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Heart className="text-health-green" /> Care & Lifestyle Modifications
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Managing PCOS effectively often requires a multi-faceted approach focusing on diet, stress, and physical activity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Dietary Habits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Focus on high-fiber foods
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Lean proteins (chicken, fish, tofu)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Limit refined carbohydrates & sugars
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Lifestyle Changes</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Regular moderate exercise (30 mins/day)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Stress management (Yoga, Meditation)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Consistent sleep schedule (7-8 hours)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Warning */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <PlusCircle size={32} className="text-health-orange" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-800 mb-2">When to Seek Medical Attention</h3>
              <p className="text-orange-700 leading-relaxed">
                If you have missed multiple periods without being pregnant, experience sudden severe pelvic pain, or have concerns about your hormonal health, please consult a gynecologist for a proper diagnosis and treatment plan.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PCOS;
