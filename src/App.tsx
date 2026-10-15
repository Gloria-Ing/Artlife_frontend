import { useState } from 'react';
import { Navbar, type NavTab } from './components/Navbar';
import { Home } from './components/Home';
import { MyProfile } from './components/MyProfile';
import { Gallery } from './components/Gallery';
import { TBRIMission } from './components/TBRIMission';
import { ContactUs } from './components/ContactUs';
import { Palette, Heart, Mail, Home as HomeIcon, User, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-midnight-900 font-sans selection:bg-terracotta selection:text-white">
      {/* Brand Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={handleNavigate} />

      {/* Main Experience Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'home' && <Home onNavigate={handleNavigate} />}
        {activeTab === 'profile' && <MyProfile />}
        {activeTab === 'gallery' && <Gallery onNavigate={handleNavigate} />}
        {activeTab === 'tbri' && <TBRIMission onNavigate={handleNavigate} />}
        {activeTab === 'contact' && <ContactUs />}
      </main>

      {/* Elegant Fine-Art Footer */}
      <footer className="border-t border-sand-300 bg-bone-100 py-12 text-xs text-brown-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-olive via-sand to-terracotta shadow-md shrink-0">
              <img
                src="/artlife-logo.png"
                alt="ALF Artlife Emblem"
                className="w-full h-full object-contain rounded-full bg-[#464A37]"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-serif font-bold text-midnight-900 text-base">Artlife Fusion</span>
                <span className="text-[11px] text-terracotta font-serif italic">Art in Motion</span>
              </div>
              <p className="text-xs text-brown-600 mt-0.5">
                Cedrick Gisimba • Visual Artist & Creative Entrepreneur • Kigali, Rwanda
              </p>
            </div>
          </div>

          {/* Navigation Links in Footer */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium">
            <button
              onClick={() => handleNavigate('home')}
              className="text-brown-700 hover:text-olive transition flex items-center gap-1"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span className="text-sand-400">•</span>
            <button
              onClick={() => handleNavigate('profile')}
              className="text-brown-700 hover:text-olive transition flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
            <span className="text-sand-400">•</span>
            <button
              onClick={() => handleNavigate('gallery')}
              className="text-brown-700 hover:text-olive transition flex items-center gap-1"
            >
              <Palette className="w-3.5 h-3.5 text-terracotta" />
              <span>Gallery</span>
            </button>
            <span className="text-sand-400">•</span>
            <button
              onClick={() => handleNavigate('tbri')}
              className="text-brown-700 hover:text-olive transition flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-terracotta" />
              <span>TBRI Mission</span>
            </button>
            <span className="text-sand-400">•</span>
            <button
              onClick={() => handleNavigate('contact')}
              className="text-brown-700 hover:text-olive transition flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>

          {/* Copyright & Location */}
          <div className="text-center md:text-right text-[11px] text-brown-500 space-y-1">
            <p className="flex items-center justify-center md:justify-end gap-1">
              <MapPin className="w-3 h-3 text-terracotta" />
              <span>Kigali, Rwanda</span>
            </p>
            <p>© {new Date().getFullYear()} Cedrick Gisimba. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
