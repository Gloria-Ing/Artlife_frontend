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
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* ================= HERO PROFILE HEADER ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-sand-300 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-6 sm:p-10 md:p-14 shadow-lg">
        {/* Soft background ambient flares */}
        <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-olive-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-24 h-96 w-96 rounded-full bg-terracotta-100/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Logo Badge & Origin */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-olive via-sand to-terracotta opacity-70 blur-md group-hover:opacity-100 transition duration-700" />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white bg-[#464A37] shadow-xl flex items-center justify-center p-1">
                <img
                  src="/artlife-logo.png"
                  alt="Artlife Fusion Emblem"
                  className="w-full h-full object-contain rounded-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="absolute -bottom-2 -right-1 bg-terracotta text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white shadow-md tracking-wider uppercase">
                ALF
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-1.5 text-xs text-brown-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span>Kigali, Rwanda</span>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive-100 text-olive-800 border border-olive-200 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
              <span>Artlife Studio Active</span>
            </div>
          </div>

          {/* Artist Bio & Statement Teaser */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-olive-100 text-olive-800 border border-olive-200">
                Visual Artist & Creative Entrepreneur
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-serif italic text-brown-700 bg-sand-200/60 border border-sand-300">
                Founder, Artlife Rwanda
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-midnight-900 tracking-tight leading-tight">
              Cedrick Gisimba
            </h1>

            <p className="text-base sm:text-lg text-brown-700 font-light leading-relaxed max-w-3xl">
              I use art as a way to connect, inspire, and create opportunities, especially for children and young people.
              For almost a decade, I’ve been using painting, creative activities, and the TBRI approach to create spaces
              where children can feel safe, express themselves, build confidence, and discover their creativity.
            </p>

            <blockquote className="border-l-4 border-terracotta pl-4 py-1.5 text-sm sm:text-base italic text-brown-800 font-serif bg-terracotta-50/50 rounded-r-xl">
              “Through Artlife Rwanda, I’m exploring how art can grow beyond the canvas into workshops, exhibitions,
              creative products, branding, and sustainable opportunities for young artists.”
            </blockquote>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3.5 rounded-xl bg-white border border-sand-300 text-center lg:text-left shadow-sm">
                <div className="text-xl sm:text-2xl font-serif font-bold text-terracotta">10+ Yrs</div>
                <div className="text-[11px] text-brown-600 font-semibold tracking-wide uppercase">Dedicated Practice</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-sand-300 text-center lg:text-left shadow-sm">
                <div className="text-xl sm:text-2xl font-serif font-bold text-olive">TBRI</div>
                <div className="text-[11px] text-brown-600 font-semibold tracking-wide uppercase">Child Healing</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-sand-300 text-center lg:text-left shadow-sm">
                <div className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">Acrylics</div>
                <div className="text-[11px] text-brown-600 font-semibold tracking-wide uppercase">Palette Knife</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-sand-300 text-center lg:text-left shadow-sm">
                <div className="text-xl sm:text-2xl font-serif font-bold text-brown-700">Kigali</div>
                <div className="text-[11px] text-brown-600 font-semibold tracking-wide uppercase">Rwanda Base</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setActiveSubTab('statement')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-olive hover:bg-olive-600 text-white text-sm font-semibold transition-all shadow-md shadow-olive/20 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Story</span>
              </button>

              <button
                onClick={() => setActiveSubTab('palette')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-bone-100 text-midnight-900 text-sm font-semibold border border-sand-300 transition-all active:scale-95 shadow-sm"
              >
                <Palette className="w-4 h-4 text-terracotta" />
                <span>Brand Color Palette</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-bone-100 text-brown-700 text-sm font-medium border border-sand-300 transition-all shadow-sm"
                title="Share profile link"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SUB-NAVIGATION TABS ================= */}
      <div className="flex items-center justify-start sm:justify-center border-b border-sand-300 pb-3 overflow-x-auto no-scrollbar gap-2 sm:gap-3 px-1">
        <button
          onClick={() => setActiveSubTab('statement')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'statement'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>The Artist Statement</span>
        </button>

        <button
          onClick={() => setActiveSubTab('philosophy')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'philosophy'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Brush className="w-4 h-4" />
          <span>Mediums & Light Philosophy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('impact')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'impact'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Heart className="w-4 h-4 text-terracotta" />
          <span>TBRI & Children Mission</span>
        </button>

        <button
          onClick={() => setActiveSubTab('palette')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeSubTab === 'palette'
              ? 'bg-olive text-white shadow-sm font-semibold'
              : 'text-brown-700 hover:text-midnight-900 hover:bg-bone-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Color Palette & Brand Identity</span>
        </button>
      </div>

      {/* ================= TAB 1: ARTIST STATEMENT & STORY ================= */}
      {activeSubTab === 'statement' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6 bg-white border border-sand-300 rounded-2xl p-6 sm:p-10 shadow-sm">
              <div className="flex items-center space-x-2.5 text-terracotta text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>My Artist Statement</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900">
                “I am Cedrick Gisimba, a Rwandan visual artist.”
              </h2>

              <div className="prose max-w-none text-brown-800 text-base leading-relaxed space-y-4">
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

                <div className="p-6 rounded-2xl bg-bone-100 border-l-4 border-olive my-6 shadow-sm">
                  <h4 className="text-xs font-bold text-olive uppercase tracking-wider mb-2">
                    The Father’s Portrait & Studio Origin
                  </h4>
                  <p className="text-midnight-900 italic font-serif text-base sm:text-lg m-0 leading-relaxed">
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
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-sand-300 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-serif font-semibold text-midnight-900 flex items-center gap-2 mb-4">
                  <Compass className="w-4 h-4 text-terracotta" />
                  <span>Key Milestones</span>
                </h3>

                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sand-300">
                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-sand-400 border-2 border-white" />
                    <div className="text-xs font-bold text-midnight-900">High School Days</div>
                    <p className="text-xs text-brown-600 mt-0.5">
                      Filling notebook margins with sketches of imagined faces and cinema figures.
                    </p>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-olive border-2 border-white" />
                    <div className="text-xs font-bold text-olive">School Representation</div>
                    <p className="text-xs text-brown-600 mt-0.5">
                      Selected for drawing competition; spark of self-belief and artistic purpose.
                    </p>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-terracotta border-2 border-white" />
                    <div className="text-xs font-bold text-terracotta">First Painting: His Father</div>
                    <p className="text-xs text-brown-600 mt-0.5">
                      Encouraged by his father's support, founding the studio that anchors his work today.
                    </p>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-midnight-900 border-2 border-white" />
                    <div className="text-xs font-bold text-midnight-900">Master Studies & Community</div>
                    <p className="text-xs text-brown-600 mt-0.5">
                      Studying art history masters, peer collaborations, and expanding into Artlife Rwanda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Philosophy Quote Card */}
              <div className="bg-bone-100 border border-sand-300 rounded-2xl p-6 text-midnight-900 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta flex items-center justify-center mb-3">
                  <Sun className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-serif font-bold text-midnight-900 mb-1.5">Art Beyond the Canvas</h4>
                <p className="text-xs leading-relaxed text-brown-700">
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
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Acrylics & Palette Knives */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 hover:shadow-md hover:border-olive transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-olive-50 text-olive flex items-center justify-center mb-4 border border-olive-200">
                  <Brush className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-midnight-900 mb-2">
                  Acrylics & Palette Knives
                </h3>
                <p className="text-sm text-brown-700 leading-relaxed">
                  “I mainly work with acrylic paint, using brushes and palette knives. I enjoy combining figurative painting
                  with abstract marks, textures, and movement.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-200 flex items-center justify-between text-xs text-olive font-semibold">
                <span>Figurative + Abstract</span>
                <span className="font-mono text-brown-600">Impasto & Texture</span>
              </div>
            </div>

            {/* Card 2: Luminous Colors & Light */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 hover:shadow-md hover:border-terracotta transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-terracotta-50 text-terracotta flex items-center justify-center mb-4 border border-terracotta-200">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-midnight-900 mb-2">
                  Luminous Colors as Hope
                </h3>
                <p className="text-sm text-brown-700 leading-relaxed">
                  “Luminous colors give my paintings energy and make the figures feel alive. I use light as a symbol of
                  hope and innocence—the possibility I see in children even when circumstances are not easy.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-200 flex items-center justify-between text-xs text-terracotta font-semibold">
                <span>Light as Metaphor</span>
                <span className="font-mono text-brown-600">Innocence & Resilience</span>
              </div>
            </div>

            {/* Card 3: The Power of Abstraction */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 hover:shadow-md hover:border-sand-400 transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-bone-200 text-brown-700 flex items-center justify-center mb-4 border border-sand-300">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-midnight-900 mb-2">
                  Space for the Viewer
                </h3>
                <p className="text-sm text-brown-700 leading-relaxed">
                  “Not everything we feel can be explained through a face or realistic image. Sometimes a color, texture, or
                  movement says what words cannot. I leave space for the viewer’s own feelings.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand-200 flex items-center justify-between text-xs text-brown-700 font-semibold">
                <span>Viewer Dialogue</span>
                <span className="font-mono text-brown-600">Beyond Words</span>
              </div>
            </div>
          </div>

          {/* Deep Insight Banner */}
          <div className="rounded-2xl bg-bone-100 p-6 sm:p-8 border border-sand-300 shadow-sm">
            <div className="max-w-4xl space-y-3">
              <span className="text-xs font-semibold text-olive uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-terracotta" />
                <span>The Artistic Vision</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-midnight-900">
                “Art has changed the way I see the world.”
              </h3>
              <p className="text-brown-700 text-sm sm:text-base leading-relaxed">
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
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 bg-white border border-sand-300 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-terracotta-100 text-terracotta text-xs font-semibold">
                <Heart className="w-3.5 h-3.5" />
                <span>Trust-Based Relational Intervention</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900">
                Empowering Children through TBRI & Gisimba Programs
              </h2>

              <p className="text-brown-700 leading-relaxed text-sm sm:text-base">
                “A lot of my work is inspired by children. They have been a big part of my life, and I have grown up
                seeing their different personalities, emotions, games, relationships, and everyday experiences. I am
                especially interested in the moments when children are simply being themselves—playing, imagining,
                laughing, exploring, or expressing something without thinking about how they are being seen.”
              </p>

              <p className="text-brown-700 leading-relaxed text-sm sm:text-base">
                “When I paint children, I am not only interested in capturing what they look like. I am interested in what
                I can feel or imagine behind the image: their emotions, innocence, energy, dreams, and the possibilities
                that exist within them.”
              </p>

              <div className="p-5 rounded-xl bg-bone-100 border border-sand-300 space-y-2">
                <h4 className="text-xs font-bold text-olive uppercase tracking-wider">
                  Gisimba After School Programs
                </h4>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Through his experience with TBRI-informed approaches in Kigali, Cedrick teaches art to children who may
                  not have access to creative materials, giving them a sanctuary of safety, emotional expression, and
                  confidence building.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-sand-300 space-y-4 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-midnight-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-terracotta" />
                  <span>The Four Pillars of Practice</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-bone-50 border border-sand-200">
                    <span className="w-6 h-6 rounded-lg bg-terracotta-100 text-terracotta flex items-center justify-center shrink-0 font-bold text-xs">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Children</h4>
                      <p className="text-[11px] text-brown-600">Authentic play, unmasked emotion, and raw joy.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-bone-50 border border-sand-200">
                    <span className="w-6 h-6 rounded-lg bg-olive-100 text-olive flex items-center justify-center shrink-0 font-bold text-xs">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Light</h4>
                      <p className="text-[11px] text-brown-600">Metaphor for hope, resilience, and inner truth.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-bone-50 border border-sand-200">
                    <span className="w-6 h-6 rounded-lg bg-sand-200 text-brown-800 flex items-center justify-center shrink-0 font-bold text-xs">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Emotion</h4>
                      <p className="text-[11px] text-brown-600">Feelings that transcend literal facial expression.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-bone-50 border border-sand-200">
                    <span className="w-6 h-6 rounded-lg bg-bone-300 text-midnight-900 flex items-center justify-center shrink-0 font-bold text-xs">
                      4
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-midnight-900">Freedom to Create</h4>
                      <p className="text-[11px] text-brown-600">Safe, non-judgmental space for imagination.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bone-100 border border-sand-300 shadow-sm">
                <div className="flex items-center space-x-2 text-olive text-xs font-semibold mb-1">
                  <Globe2 className="w-4 h-4 text-terracotta" />
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
        <div className="space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white border border-sand-300 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-widest text-terracotta uppercase">
                  Official Brand Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900 tracking-tight mt-1">
                  Artlife Fusion Color Palette
                </h2>
                <p className="text-xs sm:text-sm text-brown-600 font-serif italic mt-0.5">
                  “Art In Motion” — Harmonizing Rwandan Earth, Light, and Vitality
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/artlife-palette.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bone-100 hover:bg-bone-200 text-xs font-medium text-midnight-900 border border-sand-300 transition shadow-sm"
                >
                  <span>View Original Card</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Official Palette Card Preview */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-sand-300 bg-bone-50 p-2 sm:p-4 shadow-sm">
              <img
                src="/artlife-palette.png"
                alt="Artlife Fusion Official Color Palette Card"
                className="w-full rounded-xl object-contain max-h-96 mx-auto"
              />
            </div>
          </div>

          {/* Interactive Swatches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BRAND_PALETTE.map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={color.name}
                  className="rounded-2xl bg-white border border-sand-300 overflow-hidden shadow-sm transition hover:shadow-md hover:border-olive"
                >
                  {/* Swatch color block */}
                  <div
                    className="h-28 w-full relative flex items-end justify-between p-4 transition"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded shadow ${
                        color.isLight ? 'bg-midnight-900 text-white' : 'bg-white text-midnight-900'
                      }`}
                    >
                      {color.hex}
                    </span>

                    <button
                      onClick={() => handleCopyColor(color.hex)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition shadow flex items-center gap-1 ${
                        color.isLight
                          ? 'bg-midnight-900 text-white hover:bg-black'
                          : 'bg-white text-midnight-900 hover:bg-bone-100'
                      }`}
                      title={`Copy ${color.hex}`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Swatch details */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-serif font-bold text-midnight-900">{color.name}</h4>
                      <span className="text-[10px] text-terracotta font-semibold uppercase tracking-wider">
                        {color.role.split('&')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-brown-600 leading-relaxed">{color.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= CLOSING EMBLEM & INVITATION ================= */}
      <section className="rounded-3xl border border-sand-300 bg-bone-100 p-8 sm:p-10 text-center relative overflow-hidden shadow-sm">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#464A37] border-2 border-white p-1 flex items-center justify-center shadow-md">
            <img src="/artlife-logo.png" alt="ALF" className="w-full h-full object-contain rounded-full" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900">
            Artlife Rwanda • Art In Motion
          </h3>

          <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
            “At the heart of my work are children, light, emotion, and the freedom to create. I want my paintings
            to have beauty, but also to make people feel something, see something differently, or discover their own
            meaning within the work.”
          </p>

          <p className="text-xs text-terracotta font-serif italic pt-1 font-semibold">— Cedrick Gisimba, Kigali, Rwanda</p>
        </div>
      </section>
    </div>
  );
};
