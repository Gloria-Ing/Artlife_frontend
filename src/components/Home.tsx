import React, { useEffect, useState } from 'react';
import type { NavTab } from './Navbar';
import type { GalleryProductResponse } from '../types/api';
import { apiService, getStoredBaseUrl, parseApiError } from '../services/api';
import { guestCartService } from '../services/guestCart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  ArrowRight,
  Palette,
  Heart,
  Sun,
  Layers,
  MapPin,
  Brush,
  Quote,
  CheckCircle2,
  Calendar,
  UserPlus,
  ShoppingCart,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: NavTab) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const { refreshCartCount, refreshGuestCart } = useCart();
  const [featuredWorks, setFeaturedWorks] = useState<GalleryProductResponse[]>([]);
  const [brokenFeaturedIds, setBrokenFeaturedIds] = useState<Record<string | number, boolean>>({});
  const [addingToCartId, setAddingToCartId] = useState<string | number | null>(null);
  const [cartMsg, setCartMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resolveImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return imageUrl;
    if (/^(https?:|data:|blob:)/i.test(imageUrl)) return imageUrl;

    const baseUrl = getStoredBaseUrl().replace(/\/$/, '');
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  const formatPrice = (price?: string | number | null) => {
    if (price === null || price === undefined || price === '') {
      return null;
    }

    const amount = Number(price);
    if (Number.isNaN(amount)) {
      return String(price);
    }

    return `RWF ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const handleAddToCart = async (work: GalleryProductResponse) => {
    try {
      setAddingToCartId(work.id);
      setCartMsg(null);

      if (isAuthenticated) {
        await apiService.addToCart({ gallery_product_id: Number(work.id), quantity: 1 });
        refreshCartCount();
      } else {
        await apiService.guestAddToCart({ gallery_product_id: Number(work.id), quantity: 1 });
        guestCartService.addItem({
          gallery_product_id: Number(work.id),
          product_title: work.title,
          product_price: work.price !== null && work.price !== undefined ? String(work.price) : '',
          product_image_url: work.image_url ?? null,
          product_status: work.status,
        });
        refreshGuestCart();
      }

      setCartMsg({ type: 'success', text: `"${work.title}" added to cart.` });
      setTimeout(() => setCartMsg(null), 3000);
    } catch (err) {
      setCartMsg({ type: 'error', text: parseApiError(err) });
      setTimeout(() => setCartMsg(null), 4000);
    } finally {
      setAddingToCartId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    apiService
      .getGalleryProducts()
      .then((products) => {
        if (!mounted) return;
        setFeaturedWorks(products);
      })
      .catch(() => {
        if (!mounted) return;
        setFeaturedWorks([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10 pb-10 animate-fadeIn">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-bone-50 via-white to-bone-100/60 border border-sand-200/90 p-5 sm:p-7 md:p-8 shadow-sm">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive-100/80 text-olive-800 border border-olive-200 text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3 h-3 text-terracotta" />
              <span>Artlife Fusion • Kigali, Rwanda</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-midnight-900 tracking-tight leading-tight">
              Art in Motion. <br />
              <span className="text-olive italic font-normal">Light, Children & Freedom</span> to Create.
            </h1>

            <p className="text-xs sm:text-sm text-brown-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome to the official artistic home of <strong className="font-semibold text-midnight-900">Cedrick Gisimba</strong>,
              Rwandan visual artist and creative entrepreneur. Combining acrylic portraiture, palette knife impasto, and
              the trauma-informed healing power of the <strong className="font-semibold text-terracotta">TBRI approach</strong>.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-olive hover:bg-olive-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white hover:bg-bone-100 text-midnight-900 text-xs font-semibold border border-sand-300 shadow-sm transition-all active:scale-95"
              >
                <Palette className="w-3.5 h-3.5 text-terracotta" />
                <span>View Artworks</span>
              </button>

              <button
                onClick={() => onNavigate('account')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-midnight-900 hover:bg-midnight-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Account</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <span>Studio Inquiry</span>
              </button>
            </div>

            {/* Key Attributes Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-sand-200">
              <div className="text-left">
                <div className="text-lg sm:text-xl font-serif font-bold text-olive">10+ Yrs</div>
                <div className="text-[10px] text-brown-500 font-semibold uppercase tracking-wider">Fine Art Practice</div>
              </div>
              <div className="text-left">
                <div className="text-lg sm:text-xl font-serif font-bold text-terracotta">TBRI</div>
                <div className="text-[10px] text-brown-500 font-semibold uppercase tracking-wider">Child Healing & Art</div>
              </div>
              <div className="text-left">
                <div className="text-lg sm:text-xl font-serif font-bold text-midnight-900">Acrylics</div>
                <div className="text-[10px] text-brown-500 font-semibold uppercase tracking-wider">Palette Impasto</div>
              </div>
              <div className="text-left">
                <div className="text-lg sm:text-xl font-serif font-bold text-brown-600">Kigali</div>
                <div className="text-[10px] text-brown-500 font-semibold uppercase tracking-wider">Rwanda Base</div>
              </div>
            </div>
          </div>

          {/* Hero Right Emblem */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group p-4 bg-white rounded-2xl border border-sand-200/90 shadow-md max-w-xs w-full text-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-olive via-sand to-terracotta shadow-md flex items-center justify-center">
                <img
                  src="/artlife-logo.png"
                  alt="Artlife Fusion Official Emblem"
                  className="w-full h-full object-contain rounded-full bg-[#464A37]"
                />
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-terracotta font-bold">
                  Official Monogram
                </span>
                <h3 className="text-base font-serif font-bold text-midnight-900">Artlife Fusion</h3>
                <p className="text-[11px] text-brown-600 italic font-serif leading-snug">
                  “Art beyond the canvas into exhibitions, workshops, products, and youth empowerment.”
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-sand-200 flex items-center justify-between text-[11px] text-midnight-800">
                <span className="flex items-center gap-1 text-olive font-medium">
                  <MapPin className="w-3 h-3 text-terracotta" /> Kigali, Rwanda
                </span>
                <button
                  onClick={() => onNavigate('profile')}
                  className="text-[11px] font-semibold text-terracotta hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Brand Story</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE ARTISTIC STATEMENT CALLOUT ================= */}
      <section className="bg-bone-50/80 rounded-2xl border border-sand-200/90 p-5 sm:p-7 text-center relative overflow-hidden shadow-sm">
        <div className="max-w-2xl mx-auto space-y-3">
          <Quote className="w-6 h-6 text-olive mx-auto opacity-60" />
          <p className="text-base sm:text-lg font-serif italic text-midnight-900 leading-relaxed">
            “At the heart of my work are children, light, emotion, and the freedom to create. I want my paintings
            to have beauty, but also to make people feel something, see something differently, or discover their own
            meaning within the work.”
          </p>
          <div className="flex items-center justify-center space-x-2 text-[10px] text-brown-600 uppercase tracking-wider font-semibold">
            <span>Cedrick Gisimba</span>
            <span>•</span>
            <span>Visual Artist & Studio Founder</span>
          </div>
        </div>
      </section>

      {/* ================= THE FOUR PILLARS ================= */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">
            Artistic Philosophy
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">
            The Four Pillars of Artlife
          </h2>
          <p className="text-xs text-brown-600">
            Grounded in Rwandan culture, child psychology, and the luminous energy of abstract expressionism.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Pillar 1 */}
          <div className="bg-white rounded-xl border border-sand-200/90 p-4 hover:shadow-sm hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta flex items-center justify-center border border-terracotta-200">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-serif font-bold text-midnight-900">Children</h3>
              <p className="text-[11px] text-brown-600 leading-relaxed">
                Moments when children are purely being themselves—playing, laughing, and exploring without fear or mask.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-sand-200 text-[10px] font-semibold text-terracotta">
              Authentic Emotion
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-xl border border-sand-200/90 p-4 hover:shadow-sm hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-olive-50 text-olive flex items-center justify-center border border-olive-200">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-serif font-bold text-midnight-900">Light</h3>
              <p className="text-[11px] text-brown-600 leading-relaxed">
                Light as a universal symbol of hope, innocence, and inner potential even amidst adverse circumstances.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-sand-200 text-[10px] font-semibold text-olive">
              Symbol of Hope
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-xl border border-sand-200/90 p-4 hover:shadow-sm hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-bone-200 text-brown-700 flex items-center justify-center border border-sand-300">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-serif font-bold text-midnight-900">Emotion</h3>
              <p className="text-[11px] text-brown-600 leading-relaxed">
                Combining figurative realism with abstract texture and marks that say what words cannot explain.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-sand-200 text-[10px] font-semibold text-brown-700">
              Beyond Words
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-xl border border-sand-200/90 p-4 hover:shadow-sm hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sand-100 text-midnight-900 flex items-center justify-center border border-sand-300">
                <Brush className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-serif font-bold text-midnight-900">Freedom to Create</h3>
              <p className="text-[11px] text-brown-600 leading-relaxed">
                Safe, non-judgmental studio spaces where youth can unlock their inner voices and discover confidence.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-sand-200 text-[10px] font-semibold text-midnight-900">
              Safe Studio Spaces
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ARTWORKS PREVIEW ================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-olive">Curated Works</span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900 mt-0.5">
              Featured Studio Collections
            </h2>
            <p className="text-xs text-brown-600">
              Figurative acrylics, palette knife impasto, and luminous abstract studies from Kigali.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-terracotta hover:text-terracotta-700 transition"
          >
            <span>View All Artworks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredWorks.length > 0 ? (
          <>
            {/* Cart feedback toast */}
            {cartMsg && (
              <div
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs animate-fadeIn ${cartMsg.type === 'success'
                  ? 'bg-olive-50 border-olive-200 text-olive-800'
                  : 'bg-terracotta-50 border-terracotta-200 text-terracotta-800'
                  }`}
              >
                {cartMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{cartMsg.text}</span>
                {cartMsg.type === 'success' && (
                  <button
                    onClick={() => onNavigate('cart')}
                    className="ml-auto shrink-0 underline font-semibold whitespace-nowrap"
                  >
                    View Cart →
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {featuredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-xl border border-sand-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 bg-gradient-to-br from-bone-100 via-sand-200 to-bone-300 relative overflow-hidden">
                      {work.image_url && !brokenFeaturedIds[work.id] ? (
                        <img
                          src={resolveImageUrl(work.image_url) ?? undefined}
                          alt={work.title}
                          onError={() => setBrokenFeaturedIds((prev) => ({ ...prev, [work.id]: true }))}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-bone-100 via-sand-100 to-bone-200">
                          <div className="w-10 h-10 rounded-xl bg-white/80 border border-sand-300 shadow-sm flex items-center justify-center mb-1.5">
                            <Palette className="w-5 h-5 text-terracotta" />
                          </div>
                          <h4 className="text-xs font-serif font-bold text-midnight-900 line-clamp-1">{work.title}</h4>
                          <span className="text-[9px] text-olive font-semibold uppercase tracking-wider mt-0.5">
                            {work.series}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/90 text-olive-800 border border-olive-200">
                        {work.status}
                      </span>
                    </div>

                    <div className="px-3 py-2.5 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase font-bold text-terracotta tracking-wider leading-none">{work.series}</p>
                          <h4 className="text-xs font-serif font-bold text-midnight-900 truncate mt-0.5">{work.title}</h4>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-olive whitespace-nowrap">{formatPrice(work.price) ?? ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-brown-500">
                        <span className="font-mono font-bold text-olive-700">{work.year}</span>
                        <span>·</span>
                        <span className="capitalize">{work.category}</span>
                        <span>·</span>
                        <span className="truncate italic">{work.story}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-2 border-t border-sand-200 flex items-center justify-between gap-2 text-xs">
                    {work.status === 'Available' && (
                      <button
                        onClick={() => handleAddToCart(work)}
                        disabled={addingToCartId === work.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-olive hover:bg-olive-600 disabled:opacity-60 text-white text-[11px] font-semibold shadow-sm transition"
                      >
                        {addingToCartId === work.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <ShoppingCart className="w-3 h-3" />
                        )}
                        <span>{addingToCartId === work.id ? 'Adding…' : 'Add to Cart'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('contact')}
                      className="font-semibold text-terracotta hover:text-terracotta-700 transition flex items-center gap-1 text-[11px] ml-auto"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-sand-300 bg-white p-6 text-center shadow-sm">
            <p className="text-xs font-semibold text-midnight-900">No curated works yet.</p>
            <p className="mt-1 text-[11px] text-brown-600">
              Products added by an admin will appear here.
            </p>
          </div>
        )}
      </section>

      {/* ================= TBRI & CHILDREN IMPACT SPOTLIGHT ================= */}
      <section className="bg-gradient-to-r from-olive-50/60 via-white to-terracotta-50/50 rounded-2xl border border-sand-200/90 p-5 sm:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[10px] font-semibold">
              <Heart className="w-3 h-3 text-terracotta" />
              <span>Gisimba After School Programs</span>
            </span>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">
              Healing, Expression & Empowerment for Children
            </h2>

            <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
              “For almost a decade, I’ve been using painting, creative activities, and the TBRI approach to create
              spaces where children can feel safe, express themselves, build confidence, and discover their creativity.”
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive shrink-0 mt-0.5" />
                <span className="text-[11px] text-brown-800 font-medium">Safe, trauma-informed artistic spaces</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive shrink-0 mt-0.5" />
                <span className="text-[11px] text-brown-800 font-medium">Access to fine art supplies & mentorship</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive shrink-0 mt-0.5" />
                <span className="text-[11px] text-brown-800 font-medium">Emotional regulation through colors & marks</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive shrink-0 mt-0.5" />
                <span className="text-[11px] text-brown-800 font-medium">Community art exhibitions in Rwanda</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => onNavigate('tbri')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-olive hover:bg-olive-600 text-white text-xs font-semibold transition shadow-sm"
              >
                <span>Read About TBRI Programs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl border border-sand-200/90 shadow-sm text-center space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-terracotta-100 text-terracotta flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-serif font-bold text-midnight-900">Get Involved with Artlife</h3>
            <p className="text-[11px] text-brown-600 leading-relaxed">
              Partner with Cedrick Gisimba for youth art workshops, charity exhibitions, or studio mentorship.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold transition shadow-sm"
            >
              Collaborate on Social Impact
            </button>
          </div>
        </div>
      </section>

      {/* ================= STUDIO VISIT & CONTACT CALLOUT ================= */}
      <section className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-7 text-center shadow-sm relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="w-9 h-9 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto">
            <Calendar className="w-4 h-4" />
          </div>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-midnight-900">
            Visit the Studio in Kigali
          </h2>

          <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
            Interested in viewing available originals, commissioning custom portraits, discussing exhibition opportunities,
            or organizing creative workshops? We look forward to connecting with you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              Contact Cedrick Gisimba
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 rounded-lg bg-bone-100 hover:bg-bone-200 text-midnight-900 text-xs font-semibold border border-sand-300 transition-all"
            >
              Explore Full Biography
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
