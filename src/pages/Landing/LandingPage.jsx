import React from 'react';
import Navbar from '../../components/Landing/Navbar';
import Hero from '../../components/Landing/Hero';
import Features from '../../components/Landing/Features';
import Contact from '../../components/Landing/Contact';
import Footer from '../../components/Landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
