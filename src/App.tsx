import { useState } from 'react';
import { Navbar, type NavTab } from './components/Navbar';
import { Home } from './components/Home';
import { MyProfile } from './components/MyProfile';
import { Gallery } from './components/Gallery';
import { TBRIMission } from './components/TBRIMission';
import { ContactUs } from './components/ContactUs';
import { AuthSection } from './components/AuthSection';
import { Cart } from './components/Cart';


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
        {activeTab === 'cart' && <Cart onNavigate={handleNavigate} />}
      </main>

      <footer className="border-t border-sand-200/90 bg-bone-50 py-3 text-[11px] text-brown-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-1.5 flex-wrap text-center">
          <img
            src="/artlife-logo.png"
            alt="ALF Artlife Emblem"
            className="w-5 h-5 object-contain rounded-full bg-[#464A37] shrink-0"
          />
          <span className="font-serif font-bold text-midnight-900">Artlife Fusion</span>
          <span className="text-terracotta font-serif italic">Art in Motion</span>
          <span className="text-sand-300">•</span>
          <span>Cedrick Gisimba • Visual Artist & Creative Entrepreneur • Kigali, Rwanda</span>
          <span className="text-sand-300">•</span>
          <span>© {new Date().getFullYear()} Cedrick Gisimba. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
