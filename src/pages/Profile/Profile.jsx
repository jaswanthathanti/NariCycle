import React, { useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import LanguageSelector from '../../components/LanguageSelector';
import { Camera, User, Phone, Activity, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    email: user?.email || '',
    language: user?.language || 'en',
    healthConditions: user?.healthConditions || 'None',
    cycleLength: user?.cycleLength || '28',
    periodLength: user?.periodLength || '5',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactPhone: user?.emergencyContactPhone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setIsSaved(false);
    
    // If language changes, update i18n immediately
    if (name === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-900">{t('common.profile')}</h1>
              <p className="text-slate-500">{t('auth.signup_subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <button 
                onClick={handleSave}
                className="hidden sm:flex px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md items-center gap-2"
              >
                <Save size={18} /> {isSaved ? t('common.save') + '!' : t('common.save')}
              </button>
            </div>
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary-400 to-lavender-500 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg relative group cursor-pointer">
                  <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-slate-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-8 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <User size={20} className="text-primary-500" /> {t('common.name')}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.name')}</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.age')}</label>
                      <input type="number" name="age" value={profileData.age} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.language')}</label>
                      <select name="language" value={profileData.language} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="kn">Kannada</option>
                        <option value="te">Telugu</option>
                        <option value="ta">Tamil</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Phone size={20} className="text-health-red" /> Emergency Contact
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                    <input type="text" name="emergencyContactName" value={profileData.emergencyContactName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="emergencyContactPhone" value={profileData.emergencyContactPhone} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>

                <div className="space-y-5 md:col-span-2">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Activity size={20} className="text-lavender-600" /> {t('dashboard.health_insights')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.avg_length')}</label>
                      <input type="number" name="cycleLength" value={profileData.cycleLength} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.last_cycle')}</label>
                      <input type="number" name="periodLength" value={profileData.periodLength} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('nav.health_conditions')}</label>
                    <textarea rows="3" name="healthConditions" value={profileData.healthConditions} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full sm:hidden px-6 py-3 bg-primary-600 text-white rounded-xl text-md font-bold hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Save size={20} /> {isSaved ? t('common.save') + '!' : t('common.save')}
              </button>
            </form>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
