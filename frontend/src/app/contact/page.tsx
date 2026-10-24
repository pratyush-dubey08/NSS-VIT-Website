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
      title: 'Official WhatsApp Channel',
      badge: 'Official Announcements',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: MessageCircle,
      iconBg: 'bg-emerald-50 text-emerald-600',
      description: 'Get instant official notifications about new drives, event registrations, volunteer hours, and campus updates.',
      linkText: 'Join WhatsApp Channel',
      linkUrl: 'https://www.whatsapp.com/channel/0029VbBFSgS8qIzvpLL2Ye1W',
      highlightBorder: 'hover:border-emerald-300'
    },
    {
      title: '@nssvitbhopal',
      badge: 'Official Instagram',
      badgeColor: 'bg-rose-100 text-rose-800',
      icon: InstagramIcon,
      iconBg: 'bg-rose-50 text-rose-600',
      description: 'Official flagship handle for event highlights, guest inaugurations, blood donation drives, and official circulars.',
      linkText: 'Follow @nssvitbhopal',
      linkUrl: 'https://www.instagram.com/nssvitbhopal/',
      highlightBorder: 'hover:border-rose-300'
    },
    {
      title: '@nssvitb_unfiltered',
      badge: 'BTS & Campus Life',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600',
      description: 'The candid, behind-the-scenes side of NSS! Fun reels, volunteer moments, prep bloopers, camp diaries & volunteer life.',
      linkText: 'Follow @nssvitb_unfiltered',
      linkUrl: 'https://www.instagram.com/nssvitb_unfiltered/',
      highlightBorder: 'hover:border-purple-300'
    },
    {
      title: 'NSS Unit, VIT Bhopal',
      badge: 'LinkedIn Network',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: LinkedinIcon,
      iconBg: 'bg-blue-50 text-blue-600',
      description: 'Connect professionally for organizational outreach, alumni network, certificates, and societal impact reports.',
      linkText: 'Connect on LinkedIn',
      linkUrl: 'https://www.linkedin.com/company/nss-vitb/posts/',
      highlightBorder: 'hover:border-blue-300'
    },
    {
      title: 'NSS Unit YouTube Channel',
      badge: 'Video Documentaries',
      badgeColor: 'bg-red-100 text-red-800',
      icon: YoutubeIcon,
      iconBg: 'bg-red-50 text-red-600',
      description: 'Watch event recaps, camp documentaries, awareness films, volunteer testimonials, and keynote talks.',
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

      {/* Official Linktree & Social Channels Hub Section */}
      <section className="container mx-auto px-4 pt-12 max-w-6xl">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-12">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/10 text-blue-200 border border-white/15 inline-block mb-3">
                Official NSS Linktree Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                All NSS Unit Links in One Place
              </h2>
              <p className="text-sm text-blue-100/80 leading-relaxed font-normal">
                Join our official WhatsApp community, follow our main Instagram handle, catch BTS moments on NSS Unfiltered, and connect on LinkedIn via our verified Linktree portal.
              </p>
            </div>

            <a
              href="https://linktr.ee/nssunit__vitbhopal"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white hover:bg-blue-50 text-slate-900 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl shrink-0 cursor-pointer"
            >
              <ExternalLink size={16} className="text-nss-blue" /> Open linktr.ee/nssunit__vitbhopal
            </a>
          </div>

          {/* Social Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8 pt-8 border-t border-white/10">
            {socialChannels.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={'p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group ' + item.highlightBorder}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Icon size={20} />
                      </div>
                      <span className={'text-[10px] font-bold px-2.5 py-0.5 rounded-full ' + item.badgeColor}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-blue-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-blue-100/70 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-blue-300 group-hover:text-white flex items-center gap-1.5 transition-colors">
                    {item.linkText} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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
                <h4 className="font-bold text-gray-900 text-sm mb-1">Email Us</h4>
                <a href="mailto:nss@vitbhopal.ac.in" className="text-xs text-gray-600 hover:text-nss-blue font-mono font-medium">
                  nss@vitbhopal.ac.in
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-gray-200/80 shadow-xs flex gap-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Working Hours</h4>
                <p className="text-xs text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Message Form (2/3) */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="lg:w-2/3 w-full">
            <div className="p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xs bg-white">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Send us a Message</h3>
              <p className="text-xs text-gray-500 mb-6">Have inquiries regarding partnerships or campus drives? Drop us a note:</p>

              <form action="mailto:nss@vitbhopal.ac.in" method="POST" encType="text/plain" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      name="Name" 
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium" 
                      placeholder="e.g. Rahul Sharma" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address (@vitbhopal.ac.in)</label>
                    <input 
                      type="email" 
                      name="Email" 
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium" 
                      placeholder="yourname@vitbhopal.ac.in" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    name="Subject" 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium" 
                    placeholder="Subject of your message..." 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea 
                    rows={4} 
                    name="Message" 
                    required 
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50/50 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all font-medium resize-none" 
                    placeholder="Write your query or message here..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto px-8 py-3 bg-nss-blue hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send size={14} /> Send Message
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
