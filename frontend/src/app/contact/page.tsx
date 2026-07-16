'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
 return (
 <div className="min-h-screen pt-24 bg-gray-50 pb-20">
 
 {/* Header */}
 <section className="py-12 bg-white border-b border-gray-100">
 <div className="container mx-auto px-4 text-center">
 <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
 Get in <span className="text-nss-blue">Touch</span>
 </motion.h1>
 <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
 Have questions about volunteering or our initiatives? We'd love to hear from you.
 </motion.p>
 </div>
 </section>

 <section className="container mx-auto px-4 py-16">
 <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
 
 {/* Contact Info Cards */}
            <div className="lg:w-1/3 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-nss-blue">
                  <MapPin />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Our Location</h4>
                  <p className="text-sm text-gray-600">AB-323(AB-01), VIT Bhopal University, Bhopal-Indore Highway, Kothrikalan, Sehore, Madhya Pradesh - 466114</p>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-nss-red">
                  <Mail />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                  <p className="text-sm text-gray-600">nss@vitbhopal.ac.in</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                  <Clock />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                  <p className="text-sm text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:w-2/3">
              <div className="glass-card p-8 md:p-10 rounded-3xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form action="mailto:nss@vitbhopal.ac.in" method="POST" encType="text/plain" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input type="text" name="Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-nss-blue outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" name="Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-nss-blue outline-none" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input type="text" name="Subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-nss-blue outline-none" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea rows={5} name="Message" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-nss-blue outline-none resize-none" placeholder="Your message here..."></textarea>
                  </div>
                  <button type="submit" className="w-full md:w-auto px-8 py-4 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">
                    Send Message
                  </button>
                </form>
 </div>
 </motion.div>
 </div>
 </section>
 
 {/* Map (Placeholder) */}
 <section className="container mx-auto px-4 mt-8">
 <div className="w-full h-96 bg-gray-200 rounded-3xl flex items-center justify-center text-gray-500 overflow-hidden relative">
 <div className="absolute inset-0 opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=VIT+Bhopal&zoom=15&size=800x400&sensor=false')] bg-cover bg-center"></div>
 <span className="relative z-10 font-bold bg-white/80 px-4 py-2 rounded-full">Interactive Map Placeholder</span>
 </div>
 </section>

 </div>
 );
}
