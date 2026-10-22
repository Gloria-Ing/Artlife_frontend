import React from 'react';
import type { NavTab } from './Navbar';
import {
  Heart,
  Sun,
  ArrowRight,
} from 'lucide-react';

interface TBRIMissionProps {
  onNavigate: (tab: NavTab) => void;
}

export const TBRIMission: React.FC<TBRIMissionProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 sm:space-y-10 pb-12 animate-fadeIn">
      {/* ================= HERO HEADER ================= */}
      <section className="relative overflow-hidden rounded-2xl border border-sand-200/90 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-5 sm:p-7 md:p-8 text-center shadow-xs">
        {/* Soft background flares */}
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-olive-100/50 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-terracotta-100/40 blur-2xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta text-[10px] font-semibold">
            <Heart className="w-3 h-3" />
            <span>Social Impact & Healing Through Art</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900 tracking-tight">
            The TBRI® Approach & Gisimba Programs
          </h1>

          <p className="text-xs sm:text-sm text-brown-700 leading-relaxed font-light">
            Using Trust-Based Relational Intervention, painting, and safe creative spaces in Kigali, Rwanda to help
            children express themselves, regulate emotion, and discover inner confidence.
          </p>
        </div>
      </section>

      {/* ================= DECADE JOURNEY NARRATIVE ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-7 shadow-xs space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-olive">
            A Decade of Dedication
          </span>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-midnight-900 leading-snug">
            “Art as a sanctuary for healing, imagination, and voice.”
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-brown-700 leading-relaxed font-light">
            <p>
              For nearly ten years, Cedrick Gisimba has worked alongside children in Kigali, particularly within the
              renowned <strong>Gisimba After School programs</strong>. In these programs, art is not merely an activity—it is
              a restorative bridge for children from diverse backgrounds to process difficult circumstances.
            </p>

            <blockquote className="border-l-3 border-olive pl-3 py-1.5 italic font-serif text-midnight-900 bg-bone-100 rounded-r-lg text-xs sm:text-sm">
              “When I paint children, I am not only interested in capturing what they look like. I am interested in what
              I can feel or imagine behind the image: their emotions, innocence, energy, dreams, and the possibilities
              that exist within them.”
            </blockquote>

            <p>
              By weaving <strong>TBRI (Trust-Based Relational Intervention)</strong> principles into art workshops, Cedrick
              ensures that every child feels safe, heard, and seen before, during, and after the creative process.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl border border-sand-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-serif font-bold text-midnight-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5 text-terracotta" />
              <span>Core TBRI Principles in Art</span>
            </h3>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-bone-50 border border-sand-200/80">
                <h4 className="text-xs font-bold text-midnight-900 mb-0.5">1. Connecting Principles</h4>
                <p className="text-[11px] text-brown-600 leading-relaxed">
                  Building deep trust, mutual eye contact, and emotional attunement through creative collaboration.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-bone-50 border border-sand-200/80">
                <h4 className="text-xs font-bold text-midnight-900 mb-0.5">2. Empowering Principles</h4>
                <p className="text-[11px] text-brown-600 leading-relaxed">
                  Creating safe physical and sensory environments with rich acrylic paints, texture pastes, and paper.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-bone-50 border border-sand-200/80">
                <h4 className="text-xs font-bold text-midnight-900 mb-0.5">3. Correcting / Regulating Principles</h4>
                <p className="text-[11px] text-brown-600 leading-relaxed">
                  Translating complex, non-verbal emotional pain into constructive strokes, vibrant colors, and hope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKSHOP IMPACT STATS ================= */}
      <section className="bg-bone-100 rounded-2xl border border-sand-200/90 p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-serif font-bold text-olive">10 Yrs</div>
            <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Community Workshops</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-serif font-bold text-terracotta">500+</div>
            <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Children Mentored</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">100%</div>
            <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Safe Studio Sanctuary</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-serif font-bold text-brown-700">Kigali</div>
            <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Rwanda Community Roots</div>
          </div>
        </div>
      </section>

      {/* ================= GET INVOLVED CALL TO ACTION ================= */}
      <section className="bg-white rounded-2xl border border-sand-200/90 p-6 sm:p-8 text-center shadow-xs relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto">
            <Heart className="w-5 h-5 text-terracotta" />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">
            Partner with Cedrick Gisimba on Youth Art Initiatives
          </h2>

          <p className="text-xs text-brown-700 leading-relaxed">
            Whether you are a charitable organization, educational institution, gallery, or sponsor wishing to fund art
            supplies and workshops for Rwandan youth, we welcome your collaboration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Initiate a Collaboration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 rounded-lg bg-bone-100 hover:bg-bone-200 text-midnight-900 text-xs font-semibold border border-sand-200/90 transition-all shadow-xs"
            >
              Read Artist Biography
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
