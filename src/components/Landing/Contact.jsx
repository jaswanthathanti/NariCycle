import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, AlertTriangle, ShieldAlert } from 'lucide-react';

const Contact = () => {
  return (
    <>
      {/* SOS Section */}
      <section id="sos" className="py-24 bg-red-50 border-t border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-health-red text-white px-6 py-2 rounded-full font-bold mb-8 animate-pulse shadow-lg shadow-red-200">
            <AlertTriangle size={20} /> EMERGENCY CONTACTS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-red-900 mb-4">Immediate Help & Support</h2>
          <p className="text-red-700 max-w-2xl mx-auto mb-12 text-lg">If you are in danger or have a medical emergency, please use these government helpline numbers immediately.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-50 text-health-red rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">112</h3>
              <p className="text-slate-500 font-medium mb-4">National Emergency</p>
              <a href="tel:112" className="inline-block bg-health-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">Call Now</a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-50 text-health-red rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">108</h3>
              <p className="text-slate-500 font-medium mb-4">Ambulance Services</p>
              <a href="tel:108" className="inline-block bg-health-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">Call Now</a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-50 text-health-red rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">1091</h3>
              <p className="text-slate-500 font-medium mb-4">Women Helpline</p>
              <a href="tel:1091" className="inline-block bg-health-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">Call Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">Get in Touch with Us</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Have questions about NariCycle or need help with the app? Our team is here to support you in your health journey.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email Support</h4>
                    <p className="text-slate-600">support@naricycle.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-lavender-50 text-lavender-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Our Office</h4>
                    <p className="text-slate-600">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-slate-50 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Message</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">Send Message</button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
