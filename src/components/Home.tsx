import React from 'react';
import type { NavTab } from './Navbar';
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
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: NavTab) => void;
}

const FEATURED_WORKS = [
  {
    title: 'Gleam of Innocence',
    subtitle: 'Children of Rwanda Series',
    year: '2025',
    medium: 'Acrylic & Palette Knife on Canvas',
    dimensions: '120 × 90 cm',
    tag: 'Figurative & Abstract',
    description: 'Capturing unmasked joy and raw emotions behind a child’s playful gaze, illuminated by warm terracotta and olive tones.',
    palette: ['#111111', '#6C705B', '#A56A4F', '#D8C8B4'],
  },
  {
    title: 'Luminous Sanctuary',
    subtitle: 'Light & Hope Study',
    year: '2024',
    medium: 'Acrylic Impasto & Palette Knife',
    dimensions: '100 × 100 cm',
    tag: 'Abstract Expression',
    description: 'Thick kinetic textures and golden strokes representing hope and resilience amidst life’s hardest seasons.',
    palette: ['#6C705B', '#D8C8B4', '#F5F2EA', '#725742'],
  },
  {
    title: 'The Father’s Presence',
    subtitle: 'Studio Heritage',
    year: '2023',
    medium: 'Acrylic on Textured Canvas',
    dimensions: '110 × 85 cm',
    tag: 'Heritage & Portraiture',
    description: 'An homage to Cedrick’s very first portrait that inspired his father to help establish his permanent Kigali studio practice.',
    palette: ['#111111', '#725742', '#A56A4F', '#F5F2EA'],
  },
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16 animate-fadeIn">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-bone-50 via-white to-bone-100/60 border border-sand-300/80 p-6 sm:p-10 md:p-16 shadow-lg">
        {/* Soft background artistic flares */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-olive-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-terracotta-100/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive-100/80 text-olive-800 border border-olive-300/80 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Artlife Fusion • Kigali, Rwanda</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-midnight-900 tracking-tight leading-[1.15]">
              Art in Motion. <br />
              <span className="text-olive italic font-normal">Light, Children & Freedom</span> to Create.
            </h1>

            <p className="text-base sm:text-lg text-brown-700 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Welcome to the official artistic home of <strong className="font-semibold text-midnight-900">Cedrick Gisimba</strong>,
              Rwandan visual artist and creative entrepreneur. Combining acrylic portraiture, palette knife impasto, and
              the trauma-informed healing power of the <strong className="font-semibold text-terracotta">TBRI approach</strong>.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-olive hover:bg-olive-600 text-white text-sm font-semibold shadow-md shadow-olive/20 transition-all active:scale-95"
              >
                <span>Read Artist Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-bone-100 text-midnight-900 text-sm font-semibold border border-sand-300 shadow-sm transition-all active:scale-95"
              >
                <Palette className="w-4 h-4 text-terracotta" />
                <span>View Artworks</span>
              </button>

              <button
                onClick={() => onNavigate('account')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-midnight-900 hover:bg-midnight-800 text-white text-sm font-semibold shadow-md shadow-midnight-900/20 transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-sm font-semibold shadow-md shadow-terracotta/20 transition-all active:scale-95"
              >
                <span>Studio Inquiry</span>
              </button>
            </div>

            {/* Key Attributes Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-sand-300/80">
              <div className="text-left">
                <div className="text-2xl font-serif font-bold text-olive">10+ Yrs</div>
                <div className="text-xs text-brown-600 font-medium">Fine Art Practice</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-serif font-bold text-terracotta">TBRI</div>
                <div className="text-xs text-brown-600 font-medium">Child Healing & Art</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-serif font-bold text-midnight-900">Acrylics</div>
                <div className="text-xs text-brown-600 font-medium">Palette Knife Impasto</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-serif font-bold text-brown-600">Kigali</div>
                <div className="text-xs text-brown-600 font-medium">Rwanda Creative Base</div>
              </div>
            </div>
          </div>

          {/* Hero Right Emblem & Fine Art Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group p-4 sm:p-6 bg-white rounded-3xl border border-sand-300 shadow-xl max-w-sm w-full">
              {/* Badge Centered */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full p-1 bg-gradient-to-tr from-olive via-sand to-terracotta shadow-xl flex items-center justify-center">
                <img
                  src="/artlife-logo.png"
                  alt="Artlife Fusion Official Emblem"
                  className="w-full h-full object-contain rounded-full bg-[#464A37]"
                />
              </div>

              <div className="mt-6 text-center space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-terracotta font-bold">
                  Official Monogram
                </span>
                <h3 className="text-xl font-serif font-bold text-midnight-900">Artlife Fusion</h3>
                <p className="text-xs text-brown-600 italic font-serif">
                  “Art beyond the canvas into exhibitions, workshops, products, and youth empowerment.”
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-sand-200 flex items-center justify-between text-xs text-midnight-800">
                <span className="flex items-center gap-1 text-olive font-medium">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" /> Kigali, Rwanda
                </span>
                <button
                  onClick={() => onNavigate('profile')}
                  className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Brand Palette</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE ARTISTIC STATEMENT CALLOUT ================= */}
      <section className="bg-bone-100 rounded-3xl border border-sand-300 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
        <div className="max-w-3xl mx-auto space-y-6">
          <Quote className="w-10 h-10 text-olive mx-auto opacity-70" />
          <p className="text-xl sm:text-2xl font-serif italic text-midnight-900 leading-relaxed">
            “At the heart of my work are children, light, emotion, and the freedom to create. I want my paintings
            to have beauty, but also to make people feel something, see something differently, or discover their own
            meaning within the work.”
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs text-brown-600 uppercase tracking-widest font-semibold">
            <span>Cedrick Gisimba</span>
            <span>•</span>
            <span>Visual Artist & Studio Founder</span>
          </div>
        </div>
      </section>

      {/* ================= THE FOUR PILLARS ================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            Artistic Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">
            The Four Pillars of Artlife
          </h2>
          <p className="text-sm text-brown-600">
            Grounded in Rwandan culture, child psychology, and the luminous energy of abstract expressionism.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-sand-300 p-6 hover:shadow-md hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-terracotta-50 text-terracotta flex items-center justify-center border border-terracotta-200">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-midnight-900">Children</h3>
              <p className="text-xs text-brown-600 leading-relaxed">
                Moments when children are purely being themselves—playing, laughing, and exploring without fear or mask.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sand-200 text-[11px] font-semibold text-terracotta">
              Authentic Emotion
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-sand-300 p-6 hover:shadow-md hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-olive-50 text-olive flex items-center justify-center border border-olive-200">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-midnight-900">Light</h3>
              <p className="text-xs text-brown-600 leading-relaxed">
                Light as a universal symbol of hope, innocence, and inner potential even amidst adverse circumstances.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sand-200 text-[11px] font-semibold text-olive">
              Symbol of Hope
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-sand-300 p-6 hover:shadow-md hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-bone-200 text-brown-700 flex items-center justify-center border border-sand-300">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-midnight-900">Emotion</h3>
              <p className="text-xs text-brown-600 leading-relaxed">
                Combining figurative realism with abstract texture and marks that say what words cannot explain.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sand-200 text-[11px] font-semibold text-brown-700">
              Beyond Words
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-2xl border border-sand-300 p-6 hover:shadow-md hover:border-olive transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sand-100 text-midnight-900 flex items-center justify-center border border-sand-300">
                <Brush className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-midnight-900">Freedom to Create</h3>
              <p className="text-xs text-brown-600 leading-relaxed">
                Safe, non-judgmental studio spaces where youth can unlock their inner voices and discover confidence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sand-200 text-[11px] font-semibold text-midnight-900">
              Safe Studio Spaces
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ARTWORKS PREVIEW ================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-olive">Curated Works</span>
            <h2 className="text-3xl font-serif font-bold text-midnight-900 mt-1">
              Featured Studio Collections
            </h2>
            <p className="text-sm text-brown-600">
              Figurative acrylics, palette knife impasto, and luminous abstract studies from Kigali.
            </p>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-700 transition"
          >
            <span>View All Artworks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_WORKS.map((work) => (
            <div
              key={work.title}
              className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Artwork Canvas Mockup */}
                <div className="h-56 bg-gradient-to-br from-bone-100 via-sand-200 to-bone-300 relative flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6C705B_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 text-center space-y-2 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-sand-300 shadow-sm max-w-[85%]">
                    <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">
                      {work.tag}
                    </span>
                    <h4 className="text-base font-serif font-bold text-midnight-900">{work.title}</h4>
                    <p className="text-[11px] text-brown-600 italic font-serif">{work.medium}</p>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                    {work.palette.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-brown-600 font-medium">
                    <span>{work.subtitle}</span>
                    <span className="font-mono text-[11px] text-olive font-bold">{work.year}</span>
                  </div>
                  <p className="text-xs text-brown-700 leading-relaxed">{work.description}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-sand-200 flex items-center justify-between text-xs">
                <span className="text-brown-600 font-mono text-[11px]">{work.dimensions}</span>
                <button
                  onClick={() => onNavigate('contact')}
                  className="font-semibold text-terracotta hover:text-terracotta-700 transition flex items-center gap-1"
                >
                  <span>Acquire / Inquire</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TBRI & CHILDREN IMPACT SPOTLIGHT ================= */}
      <section className="bg-gradient-to-r from-olive-50 via-white to-terracotta-50 rounded-3xl border border-sand-300 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive-100 text-olive-800 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-terracotta" />
              <span>Gisimba After School Programs</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-midnight-900">
              Healing, Expression & Empowerment for Children
            </h2>

            <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
              “For almost a decade, I’ve been using painting, creative activities, and the TBRI approach to create
              spaces where children can feel safe, express themselves, build confidence, and discover their creativity.”
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                <span className="text-xs text-brown-800 font-medium">Safe, trauma-informed artistic spaces</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                <span className="text-xs text-brown-800 font-medium">Access to fine art supplies & mentorship</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                <span className="text-xs text-brown-800 font-medium">Emotional regulation through colors & tactile marks</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                <span className="text-xs text-brown-800 font-medium">Community art exhibitions in Rwanda</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('tbri')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-olive hover:bg-olive-600 text-white text-xs font-semibold transition shadow-md shadow-olive/20"
              >
                <span>Read About TBRI Programs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-sand-300 shadow-md text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-terracotta-100 text-terracotta flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-midnight-900">Get Involved with Artlife</h3>
            <p className="text-xs text-brown-600 leading-relaxed">
              Partner with Cedrick Gisimba for youth art workshops, charity exhibitions, or studio mentorship.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold transition"
            >
              Collaborate on Social Impact
            </button>
          </div>
        </div>
      </section>

      {/* ================= STUDIO VISIT & CONTACT CALLOUT ================= */}
      <section className="bg-white rounded-3xl border border-sand-300 p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="w-12 h-12 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900">
            Visit the Studio in Kigali
          </h2>

          <p className="text-sm text-brown-700 leading-relaxed">
            Interested in viewing available originals, commissioning custom portraits, discussing exhibition opportunities,
            or organizing creative workshops? We look forward to connecting with you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-sm font-semibold shadow-md shadow-terracotta/20 transition-all active:scale-95"
            >
              Contact Cedrick Gisimba
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-6 py-3 rounded-xl bg-bone-100 hover:bg-bone-200 text-midnight-900 text-sm font-semibold border border-sand-300 transition-all"
            >
              Explore Full Biography
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
