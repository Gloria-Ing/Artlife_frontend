import React, { useState } from 'react';
import {
  Menu,
  X,
  Palette,
  Home,
  User,
  Heart,
  Mail,
  ArrowRight,
  LogIn,
} from 'lucide-react';

export type NavTab = 'home' | 'profile' | 'gallery' | 'tbri' | 'contact' | 'account';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand-200/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Artist Title */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-olive via-sand to-terracotta shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src="/artlife-logo.png"
                alt="Artlife Fusion Emblem"
                className="w-full h-full object-contain rounded-full bg-[#464A37]"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-serif font-bold tracking-tight text-midnight-900 group-hover:text-olive transition-colors">
                  Artlife Fusion
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-olive-50 text-olive-700 border border-olive-200 tracking-wider">
                  Rwanda
                </span>
              </div>
              <p className="text-xs text-brown-600 font-serif italic">
                Cedrick Gisimba • Visual Artist
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-olive text-white shadow-sm font-semibold'
                  : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-olive text-white shadow-sm font-semibold'
                  : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => handleTabClick('gallery')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'gallery'
                  ? 'bg-olive text-white shadow-sm font-semibold'
                  : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Gallery</span>
            </button>

            <button
              onClick={() => handleTabClick('tbri')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'tbri'
                  ? 'bg-olive text-white shadow-sm font-semibold'
                  : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
            >
              <Heart className="w-4 h-4 text-terracotta" />
              <span>TBRI & Mission</span>
            </button>

            <button
              onClick={() => handleTabClick('account')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'account'
                  ? 'bg-olive text-white shadow-sm font-semibold'
                  : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Account</span>
            </button>

            <button
              onClick={() => handleTabClick('contact')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'contact'
                  ? 'bg-olive text-white shadow-sm font-semibold'
                  : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </button>
          </nav>

          {/* Desktop Right CTA Action */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => handleTabClick('contact')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-md shadow-terracotta/20 transition-all active:scale-95"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-midnight-900 hover:bg-bone-100 border border-sand-300 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-terracotta" /> : <Menu className="w-5 h-5 text-olive" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-sand-200 space-y-1.5 animate-fadeIn bg-white">
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'home'
                  ? 'bg-olive text-white font-semibold'
                  : 'text-midnight-900 hover:bg-bone-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabClick('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-olive text-white font-semibold'
                  : 'text-midnight-900 hover:bg-bone-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile & Story</span>
            </button>

            <button
              onClick={() => handleTabClick('gallery')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'gallery'
                  ? 'bg-olive text-white font-semibold'
                  : 'text-midnight-900 hover:bg-bone-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Artwork Gallery</span>
            </button>

            <button
              onClick={() => handleTabClick('tbri')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'tbri'
                  ? 'bg-olive text-white font-semibold'
                  : 'text-midnight-900 hover:bg-bone-100'
              }`}
            >
              <Heart className="w-4 h-4 text-terracotta" />
              <span>TBRI & Children Mission</span>
            </button>

            <button
              onClick={() => handleTabClick('account')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'account'
                  ? 'bg-olive text-white font-semibold'
                  : 'text-midnight-900 hover:bg-bone-100'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Account Login</span>
            </button>

            <button
              onClick={() => handleTabClick('contact')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'contact'
                  ? 'bg-olive text-white font-semibold'
                  : 'text-midnight-900 hover:bg-bone-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact & Studio</span>
            </button>

            <div className="pt-2 px-4">
              <button
                onClick={() => handleTabClick('contact')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-md transition"
              >
                <span>Studio Inquiries & Commissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
