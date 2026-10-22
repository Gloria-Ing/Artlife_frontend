import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Heart,
  Clock,
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Artwork Acquisition',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate swift confirmation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-12 animate-fadeIn">
      {/* ================= HEADER ================= */}
      <section className="rounded-2xl border border-sand-200/90 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-5 sm:p-7 md:p-8 text-center shadow-xs">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[10px] font-semibold">
            <Mail className="w-3 h-3 text-terracotta" />
            <span>Connect with Cedrick Gisimba</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-midnight-900 tracking-tight">
            Contact the Studio
          </h1>

          <p className="text-xs sm:text-sm text-brown-700 leading-relaxed font-light">
            Inquiries regarding original painting acquisitions, custom commissions, exhibitions, gallery collaborations,
            and TBRI youth workshops in Kigali and worldwide.
          </p>
        </div>
      </section>

      {/* ================= CONTENT GRID: FORM + STUDIO DETAILS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-7 shadow-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto border border-olive-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-midnight-900">Message Received</h3>
              <p className="text-xs text-brown-700 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your inquiry regarding <strong>{formData.inquiryType}</strong> has
                been delivered. Cedrick will review your message and reply promptly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', inquiryType: 'Artwork Acquisition', message: '' });
                }}
                className="mt-2 px-4 py-2 rounded-lg bg-olive hover:bg-olive-600 text-white text-xs font-semibold transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-midnight-900">Send an Inquiry</h2>
                <p className="text-[11px] text-brown-600">
                  Please provide details about your interest or project.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-midnight-900">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Claire Uwase"
                    className="w-full px-3 py-1.5 bg-bone-50 border border-sand-200/90 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-midnight-900">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="claire@example.com"
                    className="w-full px-3 py-1.5 bg-bone-50 border border-sand-200/90 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-midnight-900">Inquiry Purpose *</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-3 py-1.5 bg-bone-50 border border-sand-200/90 rounded-lg text-xs text-midnight-900 focus:outline-none focus:border-olive focus:bg-white transition cursor-pointer"
                >
                  <option value="Artwork Acquisition">Acquiring an Original Artwork</option>
                  <option value="Custom Commission">Custom Portrait / Painting Commission</option>
                  <option value="Exhibition Collaboration">Exhibition or Gallery Representation</option>
                  <option value="TBRI Youth Workshop">TBRI Art Workshop / Youth Initiative</option>
                  <option value="Studio Visit">Studio Visit in Kigali, Rwanda</option>
                  <option value="Press & Media">Press, Interview & Media</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-midnight-900">Message / Request Details *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about the piece you are interested in, your timeline, or your collaboration ideas..."
                  className="w-full px-3 py-1.5 bg-bone-50 border border-sand-200/90 rounded-lg text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message to Studio</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Studio & Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-sand-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
            <h3 className="text-base font-serif font-bold text-midnight-900">Studio & Location</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-olive-100 text-olive flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-terracotta" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-midnight-900">Location</h4>
                  <p className="text-[11px] text-brown-600 mt-0.5">
                    Kigali, Rwanda • East Africa
                  </p>
                  <p className="text-[10px] text-brown-500">In-person visits available by appointment.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-bone-200 text-brown-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-midnight-900">Studio Hours</h4>
                  <p className="text-[11px] text-brown-600 mt-0.5">
                    Monday – Friday: 9:00 AM – 6:00 PM (CAT)
                  </p>
                  <p className="text-[10px] text-brown-500">Saturday: By special appointment.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-midnight-900">TBRI & Programs</h4>
                  <p className="text-[11px] text-brown-600 mt-0.5">
                    Gisimba After School Creative Center
                  </p>
                  <p className="text-[10px] text-brown-500">Kigali community workshops & child mentorship.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Emblem & Art in Motion Card */}
          <div className="bg-bone-100 rounded-2xl border border-sand-200/90 p-4 sm:p-5 shadow-xs space-y-2.5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#464A37] border-2 border-white p-0.5 flex items-center justify-center shadow-xs">
              <img src="/artlife-logo.png" alt="ALF" className="w-full h-full object-contain rounded-full" />
            </div>

            <div>
              <h4 className="text-sm font-serif font-bold text-midnight-900">Artlife Fusion</h4>
              <p className="text-[11px] text-terracotta font-serif italic mt-0.5">Art in Motion</p>
            </div>

            <p className="text-[11px] text-brown-700 leading-relaxed font-light">
              “Through Artlife Rwanda, I’m exploring how art can grow beyond the canvas into workshops, exhibitions,
              creative products, branding, and sustainable opportunities for young artists.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
