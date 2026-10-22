import { useState } from 'react';
import { Navbar, type NavTab } from './components/Navbar';
import { Home } from './components/Home';
import { MyProfile } from './components/MyProfile';
import { Gallery } from './components/Gallery';
import { TBRIMission } from './components/TBRIMission';
import { ContactUs } from './components/ContactUs';
import { AuthSection } from './components/AuthSection';
import { Palette, Heart, Mail, Home as HomeIcon, User, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-midnight-900 font-sans selection:bg-terracotta selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={handleNavigate} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && <Home onNavigate={handleNavigate} />}
        {activeTab === 'profile' && <MyProfile />}
        {activeTab === 'gallery' && <Gallery onNavigate={handleNavigate} />}
        {activeTab === 'tbri' && <TBRIMission onNavigate={handleNavigate} />}
        {activeTab === 'contact' && <ContactUs />}
        {activeTab === 'account' && (
          <AuthSection onAuthenticated={() => handleNavigate('home')} />
        )}
      </main>

      <footer className="border-t border-sand-200/90 bg-bone-50 py-6 text-[11px] text-brown-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-2.5 text-center md:text-left">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-olive via-sand to-terracotta shadow-sm shrink-0">
              <img
                src="/artlife-logo.png"
                alt="ALF Artlife Emblem"
                className="w-full h-full object-contain rounded-full bg-[#464A37]"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="font-serif font-bold text-midnight-900 text-sm">Artlife Fusion</span>
                <span className="text-[10px] text-terracotta font-serif italic">Art in Motion</span>
              </div>
              <p className="text-[10px] text-brown-500 mt-0.5">
                Cedrick Gisimba • Visual Artist & Creative Entrepreneur • Kigali, Rwanda
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-[11px] font-medium">
            <button
              onClick={() => handleNavigate('home')}
              className="text-brown-600 hover:text-olive transition flex items-center gap-1"
            >
              <HomeIcon className="w-3 h-3" />
              <span>Home</span>
            </button>
            <span className="text-sand-300">|</span>
            <button
              onClick={() => handleNavigate('profile')}
              className="text-brown-600 hover:text-olive transition flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              <span>Profile</span>
            </button>
            <span className="text-sand-300">|</span>
            <button
              onClick={() => handleNavigate('gallery')}
              className="text-brown-600 hover:text-olive transition flex items-center gap-1"
            >
              <Palette className="w-3 h-3 text-terracotta" />
              <span>Gallery</span>
            </button>
            <span className="text-sand-300">|</span>
            <button
              onClick={() => handleNavigate('tbri')}
              className="text-brown-600 hover:text-olive transition flex items-center gap-1"
            >
              <Heart className="w-3 h-3 text-terracotta" />
              <span>TBRI</span>
            </button>
            <span className="text-sand-300">|</span>
            <button
              onClick={() => handleNavigate('account')}
              className="text-brown-600 hover:text-olive transition flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              <span>Account</span>
            </button>
            <span className="text-sand-300">|</span>
            <button
              onClick={() => handleNavigate('contact')}
              className="text-brown-600 hover:text-olive transition flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              <span>Contact</span>
            </button>
          </div>

          <div className="text-center md:text-right text-[10px] text-brown-500 space-y-0.5">
            <p className="flex items-center justify-center md:justify-end gap-1">
              <MapPin className="w-2.5 h-2.5 text-terracotta" />
              <span>Kigali, Rwanda</span>
            </p>
            <p>© {new Date().getFullYear()} Cedrick Gisimba. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
