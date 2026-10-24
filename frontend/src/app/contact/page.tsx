'use client';

import { motion } from 'framer-motion';
import { 
  Mail, MapPin, Clock, MessageCircle, 
  Sparkles, ExternalLink, HeartHandshake, Send, ArrowRight
} from 'lucide-react';

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
  const socialChannels = [
    {
      title: 'Join Our Official WhatsApp Community',
      badge: 'WhatsApp',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: MessageCircle,
      subtitle: 'Official announcements & drives',
      linkText: 'Join WhatsApp',
      linkUrl: 'https://www.whatsapp.com/channel/0029VbBFSgS8qIzvpLL2Ye1W',
      highlightBorder: 'hover:border-emerald-300'
    },
    {
      title: 'Follow Us on Instagram',
      badge: 'Instagram',
      badgeColor: 'bg-rose-100 text-rose-800',
      icon: InstagramIcon,
      subtitle: '@nssvitbhopal',
      linkText: 'Follow on Instagram',
      linkUrl: 'https://www.instagram.com/nssvitbhopal/',
      highlightBorder: 'hover:border-rose-300'
    },
    {
      title: 'Follow NSS Unfiltered',
      badge: 'BTS & Campus',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: Sparkles,
      subtitle: '@nssvitb_unfiltered',
      linkText: 'Follow Unfiltered',
      linkUrl: 'https://www.instagram.com/nssvitb_unfiltered/',
      highlightBorder: 'hover:border-purple-300'
    },
    {
      title: 'Connect on LinkedIn',
      badge: 'LinkedIn',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: LinkedinIcon,
      subtitle: 'NSS Unit, VIT Bhopal',
      linkText: 'Connect on LinkedIn',
      linkUrl: 'https://www.linkedin.com/company/nss-vitb/posts/',
      highlightBorder: 'hover:border-blue-300'
    },
    {
      title: 'Subscribe on YouTube',
      badge: 'YouTube',
      badgeColor: 'bg-red-100 text-red-800',
      icon: YoutubeIcon,
      subtitle: 'NSS Unit VIT Bhopal',
      linkText: 'Subscribe on YouTube',
      linkUrl: 'https://www.youtube.com/@nationalservicescheme-vitb5083',
      highlightBorder: 'hover:border-red-300'
    }
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 bg-white pb-24">
      
      {/* Header */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-nss-blue text-xs font-bold mb-4">
            <HeartHandshake size={14} /> NSS Unit • VIT Bhopal University
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight text-center mb-3">
            Get in <span className="text-nss-blue">Touch</span> & Connect
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal text-center">
            Have questions about volunteer recruitment, blood donation camps, or community service? We would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Official Social Channels Hub Section (Clean, Compact, No Linktree) */}
      <section className="container mx-auto px-4 pt-10 max-w-6xl">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-12">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Connect With Our Community
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 font-normal">
              Stay connected with NSS Unit, VIT Bhopal across all our official handles.
            </p>
          </div>

          {/* Social Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4 border-t border-white/10">
            {socialChannels.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={'p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group ' + item.highlightBorder}
                >
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Icon size={18} />
                      </div>
                      <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + item.badgeColor}>
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm leading-snug group-hover:text-blue-200 transition-colors">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-[11px] text-blue-200/70 font-medium mt-1">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-blue-300 group-hover:text-white flex items-center gap-1 transition-colors pt-2 border-t border-white/5">
                    {item.linkText} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Details & Message Form */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Contact Information Cards (1/3) */}
          <div className="lg:w-1/3 space-y-4 w-full">
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-gray-200/80 shadow-xs flex gap-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-nss-blue">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Our Location</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  AB-323 (AB-01), VIT Bhopal University, Bhopal-Indore Highway, Kothrikalan, Sehore, Madhya Pradesh - 466114
                </p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-gray-200/80 shadow-xs flex gap-4 bg-white">
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
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-gray-200/80 shadow-xs flex gap-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Office Hours</h4>
                <p className="text-xs text-gray-600">Monday - Friday</p>
                <p className="text-xs font-semibold text-gray-800">9:00 AM - 5:00 PM</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Message Form (2/3) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:w-2/3 w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
            <h3 className="text-xl font-black text-gray-900 mb-2">Send us a Direct Message</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Fill out this form and a student coordinator will get back to your query via college email.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Message sent successfully! Our NSS representative will get back to you shortly.');
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
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
                  placeholder="e.g. Query regarding Blood Donation Volunteer Hours"
                  className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message or inquiry here..."
                  className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-nss-blue hover:bg-blue-900 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} /> Send Message
              </button>
            </form>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
