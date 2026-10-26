import React, { useState, useRef, useEffect } from 'react';
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
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CartPopover } from './CartPopover';

export type NavTab = 'home' | 'profile' | 'gallery' | 'tbri' | 'contact' | 'account' | 'cart';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartPopoverOpen, setCartPopoverOpen] = useState(false);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const userName = user ? `${user.firstname} ${user.lastname}`.trim() || user.email : '';
  const userRole = user?.role || 'user';

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setCartPopoverOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCartClick = () => {
    setCartPopoverOpen((prev) => !prev);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand-200/90 shadow-sm transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">        <div className="flex items-center justify-between h-14 sm:h-16">
        {/* Brand Logo & Artist Title */}
        <div
          onClick={() => handleTabClick('home')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-olive via-sand to-terracotta shadow-sm group-hover:scale-105 transition-transform duration-200">
            <img
              src="/artlife-logo.png"
              alt="Artlife Fusion Emblem"
              className="w-full h-full object-contain rounded-full bg-[#464A37]"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm sm:text-base font-serif font-bold tracking-tight text-midnight-900 group-hover:text-olive transition-colors">
                Artlife Fusion
              </span>
              <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded-full bg-olive-50 text-olive-700 border border-olive-200/80 tracking-wide">
                Rwanda
              </span>
            </div>
            <p className="text-[10px] text-brown-500 leading-tight">
              Cedrick Gisimba • Visual Artist
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleTabClick('home')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'home'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'profile'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => handleTabClick('gallery')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'gallery'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => handleTabClick('tbri')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'tbri'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
          >
            <Heart className="w-3.5 h-3.5 text-terracotta" />
            <span>TBRI Mission</span>
          </button>

          <button
            onClick={() => handleTabClick('account')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'account'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>

          <button
            onClick={() => handleTabClick('contact')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'contact'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-midnight-900/80 hover:text-olive hover:bg-bone-100'
              }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </nav>

        {/* Desktop Right CTA Action */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            ref={cartBtnRef}
            onClick={handleCartClick}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition text-xs font-medium ${cartPopoverOpen
              ? 'bg-olive text-white border-olive shadow-sm'
              : 'border-sand-300 bg-bone-50 hover:bg-bone-100 text-midnight-900'
              }`}
            title="My Cart"
            aria-haspopup="dialog"
            aria-expanded={cartPopoverOpen}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-terracotta text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          {isAuthenticated && user && (
            <button
              onClick={() => handleTabClick('account')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bone-50 hover:bg-bone-100 border border-sand-300 text-left transition"
              title={`${userName} - ${userRole}`}
            >
              <User className="w-3.5 h-3.5 text-olive shrink-0" />
              <span className="min-w-0">
                <span className="block max-w-24 truncate text-[11px] font-semibold text-midnight-900">
                  {userName}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-terracotta font-bold">
                  {userRole}
                </span>
              </span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-midnight-900 hover:bg-bone-100 border border-sand-300 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-terracotta" /> : <Menu className="w-4 h-4 text-olive" />}
          </button>
        </div>
      </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-sand-200 space-y-1 animate-fadeIn bg-white">
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'home'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabClick('profile')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'profile'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Story</span>
            </button>

            <button
              onClick={() => handleTabClick('gallery')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'gallery'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Artwork Gallery</span>
            </button>

            <button
              onClick={() => handleTabClick('tbri')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'tbri'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <Heart className="w-3.5 h-3.5 text-terracotta" />
              <span>TBRI Mission</span>
            </button>

            <button
              onClick={() => handleTabClick('account')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'account'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>

            <button
              onClick={() => handleTabClick('cart')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'cart'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>My Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {isAuthenticated && user && (
              <div className="mx-3 my-1.5 rounded-xl bg-bone-50 border border-sand-300 p-2.5">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-olive shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-midnight-900 truncate">{userName}</p>
                    <p className="text-[10px] uppercase tracking-wider text-terracotta font-bold">
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => handleTabClick('contact')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === 'contact'
                ? 'bg-olive text-white font-semibold'
                : 'text-midnight-900 hover:bg-bone-100'
                }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Studio</span>
            </button>

            <div className="pt-2 px-3">
              <button
                onClick={() => handleTabClick('contact')}
                className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition"
              >
                <span>Studio Inquiries</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>

    <CartPopover
      open={cartPopoverOpen}
      onClose={() => setCartPopoverOpen(false)}
      onNavigate={handleTabClick}
    />
  );
};
