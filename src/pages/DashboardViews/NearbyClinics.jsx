import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import BottomNav from '../../components/Dashboard/BottomNav';
import LanguageSelector from '../../components/LanguageSelector';
import { MapPin, Search, Navigation, Phone, Star, AlertCircle, LocateFixed } from 'lucide-react';

const NearbyClinics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default clinics for demo
  const clinics = [
    { id: 1, name: "City Women's Health Clinic", distance: "1.2 km", address: "123 Medical Center Blvd", rating: 4.8, phone: "+91 98765 43210", isOpen: true },
    { id: 2, name: "Sunrise Maternity & Gynecology", distance: "3.5 km", address: "45 Wellness Avenue", rating: 4.6, phone: "+91 87654 32109", isOpen: true },
    { id: 3, name: "Hope Community Health Center", distance: "5.0 km", address: "78 District Road", rating: 4.2, phone: "+91 76543 21098", isOpen: false }
  ];

  const requestLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          alert("Location permission denied or unavailable. Using default view.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  // Construct Map URL based on location
  const mapUrl = userLocation 
    ? `https://www.google.com/maps?q=hospitals+maternity+clinics+near+${userLocation.lat},${userLocation.lng}&output=embed`
    : `https://www.google.com/maps?q=hospitals+maternity+clinics&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <MapPin size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">Nearby Clinics</h1>
                <p className="text-slate-500">Find healthcare providers in your area.</p>
              </div>
            </div>
            <LanguageSelector />
          </header>

          {/* Search & Location Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1 flex items-center gap-3">
              <Search className="text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by location, clinic name..."
                className="flex-1 border-none focus:outline-none text-slate-700 placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={requestLocation}
              disabled={isLocating}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                userLocation 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              }`}
            >
              {isLocating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LocateFixed size={20} />
              )}
              {userLocation ? "Location Found" : "Use My Location"}
            </button>
          </div>

          {/* Google Maps Area */}
          <div className="w-full h-96 bg-slate-200 rounded-3xl mb-8 relative overflow-hidden border border-slate-300 shadow-inner">
            <iframe 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              allowFullScreen 
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              title="Nearby Clinics Map"
            ></iframe>
            
            {/* Conditional Overlay */}
            {!userLocation && !isLocating && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-sm pointer-events-auto border border-slate-200">
                  <LocateFixed size={32} className="text-primary-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-900 mb-1">Personalize Your Search</p>
                  <p className="text-sm text-slate-500 mb-4">Allow location access to find maternity hospitals exactly where you are.</p>
                  <button 
                    onClick={requestLocation}
                    className="bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
                  >
                    Enable Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* List of Clinics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 text-lg">
                {userLocation ? "Hospitals Near You" : "Recommended Clinics"}
              </h2>
              {userLocation && (
                <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                   Real-time suggestions enabled
                </span>
              )}
            </div>
            
            {clinics.map((clinic) => (
              <div key={clinic.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{clinic.name}</h3>
                    {clinic.isOpen ? (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-health-green bg-green-50 px-2 py-0.5 rounded-full">Open Now</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Closed</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin size={14} /> {clinic.distance} • {clinic.address}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-orange-500 font-bold">
                      <Star size={14} fill="currentColor" /> {clinic.rating}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Phone size={14} /> {clinic.phone}
                    </span>
                  </div>
                </div>
                
                <a 
                  href={userLocation 
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(clinic.name + ' ' + clinic.address)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary-50 text-primary-700 font-semibold rounded-xl hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation size={18} /> {userLocation ? "Get Route" : "Directions"}
                </a>
              </div>
            ))}
          </div>

          {/* Emergency Note */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-health-red shrink-0" size={24} />
            <p className="text-sm text-red-800 leading-relaxed">
              <strong>In case of a medical emergency</strong>, please call national emergency services (112 / 108) or proceed directly to the nearest hospital emergency room.
            </p>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default NearbyClinics;
