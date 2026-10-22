import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Heart,
  Compass,
  BookOpen,
  Sun,
  Layers,
  Users,
  Lightbulb,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Brush,
  Feather,
  Globe2,
  Share2,
} from 'lucide-react';

interface ColorSwatch {
  name: string;
  hex: string;
  description: string;
  role: string;
  isLight?: boolean;
}

const BRAND_PALETTE: ColorSwatch[] = [
  {
    name: 'Midnight Black',
    hex: '#111111',
    role: 'Primary Canvas & Contrast',
    description: 'Grounding foundation representing depth, space, and quiet introspection.',
  },
  {
    name: 'Bone White',
    hex: '#F5F2EA',
    role: 'Luminosity & Clarity',
    description: 'Soft linen ivory capturing sunlight, open space, and pure emotion.',
    isLight: true,
  },
  {
    name: 'Vintage Sand',
    hex: '#D8C8B4',
    role: 'Warm Neutral Highlight',
    description: 'Earthy beige tone recalling raw canvases, sketchbooks, and natural textures.',
    isLight: true,
  },
  {
    name: 'Earth Brown',
    hex: '#725742',
    role: 'Substance & Organic Soil',
    description: 'Deep terra shade representing roots, history, and Rwandan landscape.',
  },
  {
    name: 'Olive',
    hex: '#6C705B',
    role: 'ALF Signature Emblem',
    description: 'The core badge color representing vitality, peace, harmony, and creative growth.',
  },
  {
    name: 'Warm Terracotta',
    hex: '#A56A4F',
    role: 'Energy & Fire',
    description: 'Vibrant clay tone embodying warmth, child innocence, and creative passion.',
  },
];

export const MyProfile: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'statement' | 'philosophy' | 'impact' | 'palette'>('statement');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Cedrick Gisimba — Artlife Rwanda',
        text: 'Discover the art, story, and TBRI mission of Cedrick Gisimba.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* ================= HERO PROFILE HEADER ================= */}
      <section className="relative overflow-hidden rounded-2xl border border-sand-200/90 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-5 sm:p-7 md:p-8 shadow-sm">
        {/* Soft background ambient flares */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-olive-100/50 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-terracotta-100/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* Logo Badge & Origin */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-olive via-sand to-terracotta opacity-60 blur group-hover:opacity-100 transition duration-500" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white bg-[#464A37] shadow-md flex items-center justify-center p-0.5">
                <img
                  src="/artlife-logo.png"
                  alt="Artlife Fusion Emblem"
                  className="w-full h-full object-contain rounded-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="absolute -bottom-1 -right-0.5 bg-terracotta text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm tracking-wider uppercase">
                ALF
              </div>
            </div>

            <div className="mt-2.5 flex items-center space-x-1 text-[11px] text-brown-700 font-medium">
              <MapPin className="w-3 h-3 text-terracotta" />
              <span>Kigali, Rwanda</span>
            </div>

            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 border border-olive-200 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
              <span>Artlife Studio Active</span>
            </div>
          </div>

          {/* Artist Bio & Statement Teaser */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-olive-100 text-olive-800 border border-olive-200">
                Visual Artist & Creative Entrepreneur
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif italic text-brown-700 bg-sand-200/60 border border-sand-300">
                Founder, Artlife Rwanda
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900 tracking-tight leading-tight">
              Cedrick Gisimba
            </h1>

            <p className="text-xs sm:text-sm text-brown-700 leading-relaxed max-w-3xl">
              I use art as a way to connect, inspire, and create opportunities, especially for children and young people.
              For almost a decade, I’ve been using painting, creative activities, and the TBRI approach to create spaces
              where children can feel safe, express themselves, build confidence, and discover their creativity.
            </p>

            <blockquote className="border-l-3 border-terracotta pl-3 py-1 text-xs sm:text-[13px] italic text-brown-800 font-serif bg-terracotta-50/50 rounded-r-lg">
              “Through Artlife Rwanda, I’m exploring how art can grow beyond the canvas into workshops, exhibitions,
              creative products, branding, and sustainable opportunities for young artists.”
            </blockquote>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5">
              <div className="p-2 rounded-lg bg-white border border-sand-200/90 text-center lg:text-left shadow-xs">
                <div className="text-base sm:text-lg font-serif font-bold text-terracotta">10+ Yrs</div>
                <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Dedicated Practice</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-sand-200/90 text-center lg:text-left shadow-xs">
                <div className="text-base sm:text-lg font-serif font-bold text-olive">TBRI</div>
                <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Child Healing</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-sand-200/90 text-center lg:text-left shadow-xs">
                <div className="text-base sm:text-lg font-serif font-bold text-midnight-900">Acrylics</div>
                <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Palette Knife</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-sand-200/90 text-center lg:text-left shadow-xs">
                <div className="text-base sm:text-lg font-serif font-bold text-brown-700">Kigali</div>
                <div className="text-[10px] text-brown-600 font-semibold tracking-wide uppercase">Rwanda Base</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <button
                onClick={() => setActiveSubTab('statement')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-olive hover:bg-olive-600 text-white text-xs font-semibold transition-all shadow-xs active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Full Story</span>
              </button>

              <button
                onClick={() => setActiveSubTab('palette')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-bone-100 text-midnight-900 text-xs font-semibold border border-sand-200/90 transition-all active:scale-95 shadow-xs"
              >
                <Palette className="w-3.5 h-3.5 text-terracotta" />
                <span>Brand Color Palette</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-bone-100 text-brown-700 text-xs font-medium border border-sand-200/90 transition-all shadow-xs"
                title="Share profile link"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SUB-NAVIGATION TABS ================= */}
      <div className="flex items-center justify-start sm:justify-center border-b border-sand-200/90 pb-2 overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 px-1">
        <button
          onClick={() => setActiveSubTab('statement')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'statement'
              ? 'bg-olive text-white shadow-xs font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>The Artist Statement</span>
        </button>

        <button
          onClick={() => setActiveSubTab('philosophy')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'philosophy'
              ? 'bg-olive text-white shadow-xs font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Brush className="w-3.5 h-3.5" />
          <span>Mediums & Light Philosophy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('impact')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'impact'
              ? 'bg-olive text-white shadow-xs font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-terracotta" />
          <span>TBRI & Children Mission</span>
        </button>

        <button
          onClick={() => setActiveSubTab('palette')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'palette'
              ? 'bg-olive text-white shadow-xs font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Color Palette & Brand Identity</span>
        </button>
      </div>

      {/* ================= TAB 1: ARTIST STATEMENT & STORY ================= */}
      {activeSubTab === 'statement' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4 bg-white border border-sand-200/90 rounded-2xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center space-x-2 text-terracotta text-[10px] font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>My Artist Statement</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900 leading-snug">
                “I am Cedrick Gisimba, a Rwandan visual artist.”
              </h2>

              <div className="prose max-w-none text-brown-700 text-xs sm:text-sm leading-relaxed space-y-3">
                <p>
                  I have been drawn to art since I was young. In high school, whenever I had free time, I would find myself
                  drawing in my notebooks—mostly faces, people I imagined, or characters from movies that caught my attention.
                  At the time, I was simply enjoying creating. I did not know that it would eventually become such an important
                  part of my life.
                </p>

                <p>
                  One moment that encouraged me to take art more seriously was a drawing competition at my school. I was chosen
                  to represent the school, and being recognized for something I naturally enjoyed gave me confidence to keep going.
                </p>

                <div className="p-4 rounded-xl bg-bone-100 border-l-3 border-olive my-4 shadow-xs">
                  <h4 className="text-[10px] font-bold text-olive uppercase tracking-wider mb-1">
                    The Father’s Portrait & Studio Origin
                  </h4>
                  <p className="text-midnight-900 italic font-serif text-xs sm:text-sm m-0 leading-relaxed">
                    “Later, I made my first painting of my father. He liked it and encouraged me to have a space where I could
                    continue creating. That small studio became the place where my practice grew, and it is still an important part
                    of my work today.”
                  </p>
                </div>

                <p>
                  Over the years, I have learned through different experiences. I enjoyed looking through art books and studying
                  the work of artists from earlier generations. Their paintings helped me understand different ways of working
                  with color, form, and technique and encouraged me to experiment.
                </p>

                <p>
                  Trainings and relationships with other artists also opened my mind to different ways of thinking about art.
                  All of these experiences have helped me slowly discover my own way of creating.
                </p>
              </div>
            </div>

            {/* Sidebar Milestones */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-sand-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                <h3 className="text-xs font-serif font-bold text-midnight-900 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-terracotta" />
                  <span>Key Milestones</span>
                </h3>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-sand-200">
                  <div className="relative pl-7">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-sand-400 border-2 border-white" />
                    <div className="text-xs font-bold text-midnight-900">High School Days</div>
                    <p className="text-[11px] text-brown-600 mt-0.5 leading-relaxed">
                      Filling notebook margins with sketches of imagined faces and cinema figures.
                    </p>
                  </div>

                  <div className="relative pl-7">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-olive border-2 border-white" />
                    <div className="text-xs font-bold text-olive">School Representation</div>
                    <p className="text-[11px] text-brown-600 mt-0.5 leading-relaxed">
                      Selected for drawing competition; spark of self-belief and artistic purpose.
                    </p>
                  </div>

                  <div className="relative pl-7">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-terracotta border-2 border-white" />
                    <div className="text-xs font-bold text-terracotta">First Painting: His Father</div>
                    <p className="text-[11px] text-brown-600 mt-0.5 leading-relaxed">
                      Encouraged by his father's support, founding the studio that anchors his work today.
                    </p>
                  </div>

                  <div className="relative pl-7">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-midnight-900 border-2 border-white" />
                    <div className="text-xs font-bold text-midnight-900">Master Studies & Community</div>
                    <p className="text-[11px] text-brown-600 mt-0.5 leading-relaxed">
                      Studying art history masters, peer collaborations, and expanding into Artlife Rwanda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Philosophy Quote Card */}
              <div className="bg-bone-100 border border-sand-200/90 rounded-2xl p-4 text-midnight-900 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-terracotta-100 text-terracotta flex items-center justify-center mb-2">
                  <Sun className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-serif font-bold text-midnight-900 mb-1">Art Beyond the Canvas</h4>
                <p className="text-[11px] leading-relaxed text-brown-700">
                  “For me, making art and sharing art are connected. I want to continue developing my own practice while
                  also helping create more opportunities for young people to experience creativity.”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MEDIUMS & LIGHT PHILOSOPHY ================= */}
      {activeSubTab === 'philosophy' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Acrylics & Palette Knives */}
            <div className="bg-white border border-sand-200/90 rounded-xl p-4 sm:p-5 hover:shadow-xs hover:border-olive transition flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive flex items-center justify-center mb-3 border border-olive-200">
                  <Brush className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-bold text-midnight-900 mb-1.5">
                  Acrylics & Palette Knives
                </h3>
                <p className="text-xs text-brown-700 leading-relaxed">
                  “I mainly work with acrylic paint, using brushes and palette knives. I enjoy combining figurative painting
                  with abstract marks, textures, and movement.”
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-200/80 flex items-center justify-between text-[11px] text-olive font-semibold">
                <span>Figurative + Abstract</span>
                <span className="font-mono text-brown-600">Impasto & Texture</span>
              </div>
            </div>

            {/* Card 2: Luminous Colors & Light */}
            <div className="bg-white border border-sand-200/90 rounded-xl p-4 sm:p-5 hover:shadow-xs hover:border-terracotta transition flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-terracotta-50 text-terracotta flex items-center justify-center mb-3 border border-terracotta-200">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-bold text-midnight-900 mb-1.5">
                  Luminous Colors as Hope
                </h3>
                <p className="text-xs text-brown-700 leading-relaxed">
                  “Luminous colors give my paintings energy and make the figures feel alive. I use light as a symbol of
                  hope and innocence—the possibility I see in children even when circumstances are not easy.”
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-200/80 flex items-center justify-between text-[11px] text-terracotta font-semibold">
                <span>Light as Metaphor</span>
                <span className="font-mono text-brown-600">Innocence & Resilience</span>
              </div>
            </div>

            {/* Card 3: The Power of Abstraction */}
            <div className="bg-white border border-sand-200/90 rounded-xl p-4 sm:p-5 hover:shadow-xs hover:border-sand-400 transition flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-bone-200 text-brown-700 flex items-center justify-center mb-3 border border-sand-300">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-bold text-midnight-900 mb-1.5">
                  Space for the Viewer
                </h3>
                <p className="text-xs text-brown-700 leading-relaxed">
                  “Not everything we feel can be explained through a face or realistic image. Sometimes a color, texture, or
                  movement says what words cannot. I leave space for the viewer’s own feelings.”
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-200/80 flex items-center justify-between text-[11px] text-brown-700 font-semibold">
                <span>Viewer Dialogue</span>
                <span className="font-mono text-brown-600">Beyond Words</span>
              </div>
            </div>
          </div>

          {/* Deep Insight Banner */}
          <div className="rounded-xl bg-bone-100 p-5 sm:p-6 border border-sand-200/90 shadow-xs">
            <div className="max-w-4xl space-y-2">
              <span className="text-[10px] font-semibold text-olive uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-terracotta" />
                <span>The Artistic Vision</span>
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-midnight-900">
                “Art has changed the way I see the world.”
              </h3>
              <p className="text-brown-700 text-xs sm:text-sm leading-relaxed">
                “It has made me pay more attention to people, society, nature, and the small things around me that can
                easily be missed. When I am creating, I feel connected to myself. Painting gives me a way to process what I
                see and experience and turn it into something that others can see and feel too.”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SOCIAL IMPACT & TBRI ================= */}
      {activeSubTab === 'impact' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 bg-white border border-sand-200/90 rounded-2xl p-5 sm:p-7 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta text-[10px] font-semibold">
                <Heart className="w-3 h-3" />
                <span>Trust-Based Relational Intervention</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900 leading-snug">
                Empowering Children through TBRI & Gisimba Programs
              </h2>

              <p className="text-brown-700 leading-relaxed text-xs sm:text-sm">
                “A lot of my work is inspired by children. They have been a big part of my life, and I have grown up
                seeing their different personalities, emotions, games, relationships, and everyday experiences. I am
                especially interested in the moments when children are simply being themselves—playing, imagining,
                laughing, exploring, or expressing something without thinking about how they are being seen.”
              </p>

              <p className="text-brown-700 leading-relaxed text-xs sm:text-sm">
                “When I paint children, I am not only interested in capturing what they look like. I am interested in what
                I can feel or imagine behind the image: their emotions, innocence, energy, dreams, and the possibilities
                that exist within them.”
              </p>

              <div className="p-3.5 rounded-xl bg-bone-100 border border-sand-200/90 space-y-1.5">
                <h4 className="text-[10px] font-bold text-olive uppercase tracking-wider">
                  Gisimba After School Programs
                </h4>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Through his experience with TBRI-informed approaches in Kigali, Cedrick teaches art to children who may
                  not have access to creative materials, giving them a sanctuary of safety, emotional expression, and
                  confidence building.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200/90 space-y-3 shadow-xs">
                <h3 className="text-sm font-serif font-bold text-midnight-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-terracotta" />
                  <span>The Four Pillars of Practice</span>
                </h3>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-bone-50 border border-sand-200/80">
                    <span className="w-5 h-5 rounded-md bg-terracotta-100 text-terracotta flex items-center justify-center shrink-0 font-bold text-[10px]">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Children</h4>
                      <p className="text-[10px] text-brown-600">Authentic play, unmasked emotion, and raw joy.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-bone-50 border border-sand-200/80">
                    <span className="w-5 h-5 rounded-md bg-olive-100 text-olive flex items-center justify-center shrink-0 font-bold text-[10px]">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Light</h4>
                      <p className="text-[10px] text-brown-600">Metaphor for hope, resilience, and inner truth.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-bone-50 border border-sand-200/80">
                    <span className="w-5 h-5 rounded-md bg-sand-200 text-brown-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Emotion</h4>
                      <p className="text-[10px] text-brown-600">Feelings that transcend literal facial expression.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-bone-50 border border-sand-200/80">
                    <span className="w-5 h-5 rounded-md bg-bone-300 text-midnight-900 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      4
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Freedom to Create</h4>
                      <p className="text-[10px] text-brown-600">Safe, non-judgmental space for imagination.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-bone-100 border border-sand-200/90 shadow-xs">
                <div className="flex items-center space-x-1.5 text-olive text-[11px] font-semibold mb-1">
                  <Globe2 className="w-3.5 h-3.5 text-terracotta" />
                  <span>Rwandan Art Community & Beyond</span>
                </div>
                <p className="text-xs text-brown-700 leading-relaxed">
                  “My hope is to contribute to a stronger art community in Rwanda and eventually connect with artists
                  and communities beyond Rwanda.”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: BRAND COLOR PALETTE & IDENTITY ================= */}
      {activeSubTab === 'palette' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white border border-sand-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-terracotta uppercase">
                  Official Brand Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900 tracking-tight mt-0.5">
                  Artlife Fusion Color Palette
                </h2>
                <p className="text-xs text-brown-600 font-serif italic mt-0.5">
                  “Art In Motion” — Harmonizing Rwandan Earth, Light, and Vitality
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/artlife-palette.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bone-100 hover:bg-bone-200 text-xs font-medium text-midnight-900 border border-sand-200/90 transition shadow-xs"
                >
                  <span>View Original Card</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Official Palette Card Preview */}
            <div className="mt-4 rounded-xl overflow-hidden border border-sand-200/90 bg-bone-50 p-2 sm:p-3 shadow-xs">
              <img
                src="/artlife-palette.png"
                alt="Artlife Fusion Official Color Palette Card"
                className="w-full rounded-lg object-contain max-h-72 mx-auto"
              />
            </div>
          </div>

          {/* Interactive Swatches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_PALETTE.map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={color.name}
                  className="rounded-xl bg-white border border-sand-200/90 overflow-hidden shadow-xs transition hover:shadow-xs hover:border-olive"
                >
                  {/* Swatch color block */}
                  <div
                    className="h-20 sm:h-22 w-full relative flex items-end justify-between p-3 transition"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs ${
                        color.isLight ? 'bg-midnight-900 text-white' : 'bg-white text-midnight-900'
                      }`}
                    >
                      {color.hex}
                    </span>

                    <button
                      onClick={() => handleCopyColor(color.hex)}
                      className={`p-1 rounded-md text-[11px] font-medium transition shadow-xs flex items-center gap-1 ${
                        color.isLight
                          ? 'bg-midnight-900 text-white hover:bg-black'
                          : 'bg-white text-midnight-900 hover:bg-bone-100'
                      }`}
                      title={`Copy ${color.hex}`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[9px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[9px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Swatch details */}
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-serif font-bold text-midnight-900">{color.name}</h4>
                      <span className="text-[9px] text-terracotta font-semibold uppercase tracking-wider">
                        {color.role.split('&')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-brown-600 leading-relaxed">{color.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= CLOSING EMBLEM & INVITATION ================= */}
      <section className="rounded-2xl border border-sand-200/90 bg-bone-100 p-6 sm:p-7 text-center relative overflow-hidden shadow-xs">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#464A37] border-2 border-white p-0.5 flex items-center justify-center shadow-sm">
            <img src="/artlife-logo.png" alt="ALF" className="w-full h-full object-contain rounded-full" />
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">
            Artlife Rwanda • Art In Motion
          </h3>

          <p className="text-xs sm:text-[13px] text-brown-700 leading-relaxed">
            “At the heart of my work are children, light, emotion, and the freedom to create. I want my paintings
            to have beauty, but also to make people feel something, see something differently, or discover their own
            meaning within the work.”
          </p>

          <p className="text-[11px] text-terracotta font-serif italic font-semibold">— Cedrick Gisimba, Kigali, Rwanda</p>
        </div>
      </section>
    </div>
  );
};
