'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, MapPin, Clock, MessageCircle, 
  Sparkles, ExternalLink, Send, ArrowRight, CheckCircle2
} from 'lucide-react';
import api from '@/lib/axios';

const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YoutubeIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
);

export default function ContactPage() {
  const [honeypot, setHoneypot] = useState('');
  const [formLoadTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const socialChannels = [
    {
      title: 'Official WhatsApp Community',
      subtitle: 'Join our official community for instant event updates, drive circulars & announcements.',
      icon: MessageCircle,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      buttonText: 'Join WhatsApp',
      linkUrl: 'https://www.whatsapp.com/channel/0029VbBFSgS8qIzvpLL2Ye1W',
      hoverBorder: 'hover:border-emerald-400'
    },
    {
      title: 'Official Instagram Handle',
      handle: '@nssvitbhopal',
      subtitle: 'Official Instagram handle for event highlights, notifications, drives & updates.',
      icon: InstagramIcon,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
      buttonText: 'Follow @nssvitbhopal',
      linkUrl: 'https://www.instagram.com/nssvitbhopal/',
      hoverBorder: 'hover:border-rose-400'
    },
    {
      title: 'NSS Unfiltered',
      handle: '@nssvitb_unfiltered',
      subtitle: 'Catch candid behind-the-scenes moments, campus volunteer life, fun reels & bloopers.',
      icon: Sparkles,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      buttonText: 'Follow Unfiltered',
      linkUrl: 'https://www.instagram.com/nssvitb_unfiltered/',
      hoverBorder: 'hover:border-purple-400'
    },
    {
      title: 'LinkedIn Network',
      handle: 'NSS Unit, VIT Bhopal',
      subtitle: 'Connect with us for professional outreach, alumni networking & societal impact reports.',
      icon: LinkedinIcon,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      buttonText: 'Connect on LinkedIn',
      linkUrl: 'https://www.linkedin.com/company/nss-vitb/posts/',
      hoverBorder: 'hover:border-blue-400'
    },
    {
      title: 'Join Us on YouTube',
      handle: 'NSS Unit VIT Bhopal',
      subtitle: 'Watch event recaps, camp documentaries, awareness films & volunteer talk shows.',
      icon: YoutubeIcon,
      iconColor: 'text-red-600 bg-red-50 border-red-100',
      buttonText: 'Join Us on YouTube',
      linkUrl: 'https://www.youtube.com/@nationalservicescheme-vitb5083',
      hoverBorder: 'hover:border-red-400'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Basic bot check: form filled in under 1 second is almost certainly a bot
      if (Date.now() - formLoadTime < 1000) {
        setSubmitSuccess(true);
        return;
      }
      await api.post('/contact', { ...formData, website_hp: honeypot });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pb-24 font-sans relative overflow-hidden">
      
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Header (Top Badge Removed as requested) */}
      {/* Seamlessly Blended Header Section */}
      <section className="py-10 sm:py-14 relative z-10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-black tracking-widest text-nss-red uppercase px-3.5 py-1 bg-red-50 rounded-full border border-red-200/80 inline-block mb-3 shadow-xs">
            Connect & Outreach
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-center mb-3 bg-gradient-to-r from-nss-blue via-blue-900 to-nss-red bg-clip-text text-transparent"
          >
            Get in Touch with NSS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal text-center"
          >
            Have questions about volunteer recruitment, blood donation camps, or community initiatives? We would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Official Community Hub - Modern Sleek Interactive Rows/Cards */}
      <section className="container mx-auto px-4 pt-10 max-w-5xl">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md mb-14 border-t-4 border-t-nss-blue">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Connect With Our Community
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Follow our verified handles for active announcements, drives, and behind-the-scenes stories.
            </p>
          </div>

          <div className="space-y-3">
            {socialChannels.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={'p-4 sm:p-4.5 bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ' + item.hoverBorder}
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div className={'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ' + item.iconColor}>
                      <Icon size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-nss-blue transition-colors">
                          {item.title}
                        </h3>
                        {item.handle && (
                          <span className="text-[11px] font-semibold text-gray-400">
                            ({item.handle})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-nss-blue group-hover:text-blue-800 transition-colors shrink-0 bg-blue-50/60 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100">
                    <span>{item.buttonText}</span>
                    <ExternalLink size={13} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Details & Message Form */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Contact Information Cards (1/3) */}
          <div className="lg:w-1/3 space-y-4 w-full">
            <div className="p-6 rounded-2xl border border-slate-200/90 shadow-md flex gap-4 bg-white/95 backdrop-blur-md hover:shadow-xl hover:border-blue-400/80 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-nss-blue">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Our Location</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">
                  AB-323 (AB-01), VIT Bhopal University, Bhopal-Indore Highway, Kothrikalan, Sehore, Madhya Pradesh - 466114
                </p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl border border-slate-200/90 shadow-md flex gap-4 bg-white/95 backdrop-blur-md hover:shadow-xl hover:border-blue-400/80 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 text-nss-red">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Email Queries</h4>
                <a href="mailto:nss@vitbhopal.ac.in" className="text-xs text-nss-blue font-bold hover:underline block mb-1">
                  nss@vitbhopal.ac.in
                </a>
                <p className="text-[11px] text-gray-400">For student drives and collaborations</p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl border border-slate-200/90 shadow-md flex gap-4 bg-white/95 backdrop-blur-md hover:shadow-xl hover:border-blue-400/80 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Office Hours</h4>
                <p className="text-xs text-gray-600">Monday - Friday</p>
                <p className="text-xs font-semibold text-gray-800">9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Message Form (2/3) - Connected to Backend Admin Portal! */}
          <div className="lg:w-2/3 w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg border-t-4 border-t-nss-red">
            <h3 className="text-xl font-black text-gray-900 mb-2">Send us a Direct Message</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Fill out this form and your message will be forwarded directly to the NSS Admin desk.
            </p>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="text-base font-black text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for reaching out. Your inquiry has been sent to our NSS administrators, and we will follow up with you via college email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. yourname@vitbhopal.ac.in"
                      className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Query regarding Blood Donation Volunteer Hours"
                    className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message or inquiry here..."
                    className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-nss-blue to-blue-900 hover:from-blue-900 hover:to-nss-red text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-950/20 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={15} /> {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
