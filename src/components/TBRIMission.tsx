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
    <div className="space-y-12 sm:space-y-16 pb-16 animate-fadeIn">
      {/* ================= HERO HEADER ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-sand-300 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-8 sm:p-14 text-center shadow-sm">
        {/* Soft background flares */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-olive-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-terracotta-100/50 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100 text-terracotta text-xs font-semibold">
            <Heart className="w-3.5 h-3.5" />
            <span>Social Impact & Healing Through Art</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-midnight-900 tracking-tight">
            The TBRI® Approach & Gisimba Programs
          </h1>

          <p className="text-base sm:text-lg text-brown-700 leading-relaxed font-light">
            Using Trust-Based Relational Intervention, painting, and safe creative spaces in Kigali, Rwanda to help
            children express themselves, regulate emotion, and discover inner confidence.
          </p>
        </div>
      </section>

      {/* ================= DECADE JOURNEY NARRATIVE ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sand-300 p-8 sm:p-10 shadow-sm space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-olive">
            A Decade of Dedication
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900 leading-tight">
            “Art as a sanctuary for healing, imagination, and voice.”
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-brown-800 leading-relaxed font-light">
            <p>
              For nearly ten years, Cedrick Gisimba has worked alongside children in Kigali, particularly within the
              renowned <strong>Gisimba After School programs</strong>. In these programs, art is not merely an activity—it is
              a restorative bridge for children from diverse backgrounds to process difficult circumstances.
            </p>

            <blockquote className="border-l-4 border-olive pl-4 py-2 italic font-serif text-midnight-900 bg-bone-100 rounded-r-xl">
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

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-midnight-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-terracotta" />
              <span>Core TBRI Principles in Art</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-bone-50 border border-sand-200">
                <h4 className="text-xs font-bold text-midnight-900 mb-1">1. Connecting Principles</h4>
                <p className="text-xs text-brown-600">
                  Building deep trust, mutual eye contact, and emotional attunement through creative collaboration.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-bone-50 border border-sand-200">
                <h4 className="text-xs font-bold text-midnight-900 mb-1">2. Empowering Principles</h4>
                <p className="text-xs text-brown-600">
                  Creating safe physical and sensory environments with rich acrylic paints, texture pastes, and paper.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-bone-50 border border-sand-200">
                <h4 className="text-xs font-bold text-midnight-900 mb-1">3. Correcting / Regulating Principles</h4>
                <p className="text-xs text-brown-600">
                  Translating complex, non-verbal emotional pain into constructive strokes, vibrant colors, and hope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKSHOP IMPACT STATS ================= */}
      <section className="bg-bone-100 rounded-3xl border border-sand-300 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-olive">10 Yrs</div>
            <div className="text-xs text-brown-600 font-semibold tracking-wide uppercase">Community Workshops</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-terracotta">500+</div>
            <div className="text-xs text-brown-600 font-semibold tracking-wide uppercase">Children Mentored</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">100%</div>
            <div className="text-xs text-brown-600 font-semibold tracking-wide uppercase">Safe Studio Sanctuary</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-brown-700">Kigali</div>
            <div className="text-xs text-brown-600 font-semibold tracking-wide uppercase">Rwanda Community Roots</div>
          </div>
        </div>
      </section>

      {/* ================= GET INVOLVED CALL TO ACTION ================= */}
      <section className="bg-white rounded-3xl border border-sand-300 p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="w-14 h-14 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-terracotta" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900">
            Partner with Cedrick Gisimba on Youth Art Initiatives
          </h2>

          <p className="text-sm text-brown-700 leading-relaxed">
            Whether you are a charitable organization, educational institution, gallery, or sponsor wishing to fund art
            supplies and workshops for Rwandan youth, we welcome your collaboration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-sm font-semibold shadow-md shadow-terracotta/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Initiate a Collaboration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="px-6 py-3 rounded-xl bg-bone-100 hover:bg-bone-200 text-midnight-900 text-sm font-semibold border border-sand-300 transition-all"
            >
              Read Artist Biography
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
