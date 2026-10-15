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
    <div className="space-y-12 sm:space-y-16 pb-16 animate-fadeIn">
      {/* ================= HEADER ================= */}
      <section className="rounded-3xl border border-sand-300 bg-gradient-to-b from-bone-50 via-white to-bone-100 p-8 sm:p-14 text-center shadow-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive-100 text-olive-800 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-terracotta" />
            <span>Connect with Cedrick Gisimba</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-midnight-900 tracking-tight">
            Contact the Studio
          </h1>

          <p className="text-sm sm:text-base text-brown-700 leading-relaxed font-light">
            Inquiries regarding original painting acquisitions, custom commissions, exhibitions, gallery collaborations,
            and TBRI youth workshops in Kigali and worldwide.
          </p>
        </div>
      </section>

      {/* ================= CONTENT GRID: FORM + STUDIO DETAILS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sand-300 p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto border border-olive-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-midnight-900">Message Received</h3>
              <p className="text-sm text-brown-700 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your inquiry regarding <strong>{formData.inquiryType}</strong> has
                been delivered. Cedrick will review your message and reply promptly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', inquiryType: 'Artwork Acquisition', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-olive hover:bg-olive-600 text-white text-xs font-semibold transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold text-midnight-900">Send an Inquiry</h2>
                <p className="text-xs text-brown-600">
                  Please provide details about your interest or project.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-midnight-900">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Claire Uwase"
                    className="w-full px-4 py-2.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-midnight-900">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="claire@example.com"
                    className="w-full px-4 py-2.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-midnight-900">Inquiry Purpose *</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 focus:outline-none focus:border-olive focus:bg-white transition cursor-pointer"
                >
                  <option value="Artwork Acquisition">Acquiring an Original Artwork</option>
                  <option value="Custom Commission">Custom Portrait / Painting Commission</option>
                  <option value="Exhibition Collaboration">Exhibition or Gallery Representation</option>
                  <option value="TBRI Youth Workshop">TBRI Art Workshop / Youth Initiative</option>
                  <option value="Studio Visit">Studio Visit in Kigali, Rwanda</option>
                  <option value="Press & Media">Press, Interview & Media</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-midnight-900">Message / Request Details *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about the piece you are interested in, your timeline, or your collaboration ideas..."
                  className="w-full px-4 py-2.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-terracotta/20 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message to Studio</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Studio & Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-xl font-serif font-bold text-midnight-900">Studio & Location</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-olive-100 text-olive flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-midnight-900">Location</h4>
                  <p className="text-xs text-brown-600 mt-0.5">
                    Kigali, Rwanda • East Africa
                  </p>
                  <p className="text-[11px] text-brown-500">In-person visits available by appointment.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-bone-200 text-brown-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-midnight-900">Studio Hours</h4>
                  <p className="text-xs text-brown-600 mt-0.5">
                    Monday – Friday: 9:00 AM – 6:00 PM (CAT)
                  </p>
                  <p className="text-[11px] text-brown-500">Saturday: By special appointment.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-midnight-900">TBRI & Programs</h4>
                  <p className="text-xs text-brown-600 mt-0.5">
                    Gisimba After School Creative Center
                  </p>
                  <p className="text-[11px] text-brown-500">Kigali community workshops & child mentorship.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Emblem & Art in Motion Card */}
          <div className="bg-bone-100 rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#464A37] border-2 border-white p-1 flex items-center justify-center shadow-md">
              <img src="/artlife-logo.png" alt="ALF" className="w-full h-full object-contain rounded-full" />
            </div>

            <div>
              <h4 className="text-base font-serif font-bold text-midnight-900">Artlife Fusion</h4>
              <p className="text-xs text-terracotta font-serif italic mt-0.5">Art in Motion</p>
            </div>

            <p className="text-xs text-brown-700 leading-relaxed font-light">
              “Through Artlife Rwanda, I’m exploring how art can grow beyond the canvas into workshops, exhibitions,
              creative products, branding, and sustainable opportunities for young artists.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
