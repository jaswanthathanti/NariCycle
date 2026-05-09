import React from 'react';
import { AlertTriangle, MapPin, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmergencyBanner = () => {
  const { user, initiateSOS } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      className="mb-8 overflow-hidden"
    >
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-health-red rounded-xl shrink-0 animate-pulse shadow-lg shadow-red-200">
              <AlertTriangle className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-health-red mb-1">🚨 Critical Symptoms Detected</h3>
              <p className="text-red-700 text-sm mb-2">
                Your health profile indicates a <b>High Risk</b> of severe health complications. Please prioritize your safety!
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                <a href="tel:112" className="px-2 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-md hover:bg-red-200 transition-colors">📞 112 (National Emergency)</a>
                <a href="tel:108" className="px-2 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-md hover:bg-red-200 transition-colors">🚑 108 (Ambulance)</a>
                <a href="tel:1091" className="px-2 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-md hover:bg-red-200 transition-colors">👩 1091 (Women Helpline)</a>
              </div>
              {user?.lastSosSent && (
                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  ✅ Guardian Notified via WhatsApp
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 shrink-0">
            <Link to="/clinics" className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-health-red border border-red-200 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
              🏥 Clinics
            </Link>
            <button 
              onClick={() => initiateSOS("Dashboard Emergency")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-health-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 shadow-md shadow-red-200 transition-colors"
            >
              📲 SOS Help
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyBanner;
