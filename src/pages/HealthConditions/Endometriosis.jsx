import React, { useEffect } from 'react';
import Navbar from '../../components/Landing/Navbar';
import { Heart, ArrowLeft, AlertTriangle, Activity, MapPin, Zap, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Endometriosis = () => {
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
            className="bg-gradient-to-br from-primary-50 to-pink-100 rounded-3xl p-8 sm:p-12 border border-primary-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 md:w-2/3">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-primary-600 font-semibold text-sm mb-6 shadow-sm border border-white">
                <Heart size={16} fill="currentColor" /> Reproductive Health
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 mb-4 leading-tight">
                Endometriosis Care
              </h1>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Endometriosis is a condition where tissue similar to the lining of the uterus grows outside it. Early identification of symptoms is vital for effective pain management and long-term reproductive health.
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
            <AlertTriangle className="text-primary-500" /> Early Symptom Identification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Zap size={24} />, title: "Severe Pelvic Pain", desc: "Debilitating cramps that extend to the lower back and pelvis." },
              { icon: <Activity size={24} />, title: "Pain with Periods", desc: "Pelvic pain and cramping may begin before and extend several days into your period." },
              { icon: <AlertTriangle size={24} />, title: "Excessive Bleeding", desc: "Experiencing occasional heavy menstrual periods or bleeding between periods." },
              { icon: <Heart size={24} />, title: "Infertility", desc: "Sometimes, endometriosis is first diagnosed in those seeking treatment for infertility." }
            ].map((symptom, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
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
              <Heart className="text-health-green" /> Care & Management Strategies
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              While there is no cure, effective treatments exist to manage symptoms and improve your quality of life. Consistent tracking is key.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Tracking & Relief</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Use heating pads for pelvic pain relief
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Over-the-counter pain medications (as advised)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Maintain a detailed pain/symptom diary
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Dietary Support</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Anti-inflammatory foods (omega-3s)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Increase fruit, vegetable, and whole grain intake
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-health-green"></div> Limit caffeine and alcohol
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Warning */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <PlusCircle size={32} className="text-health-red" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Healthcare Consultation</h3>
              <p className="text-red-700 leading-relaxed mb-4">
                If your pain interferes with your daily activities or if you experience sudden, severe pain that worsens over time, do not ignore it. Proper medical evaluation is required for a formal diagnosis.
              </p>
              <button onClick={handleActionClick} className="flex items-center justify-center sm:justify-start gap-2 text-health-red font-semibold hover:text-red-900 transition-colors">
                Report Symptoms <ArrowLeft className="rotate-180" size={16} />
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Endometriosis;
