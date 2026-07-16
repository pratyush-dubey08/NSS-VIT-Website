'use client';

import { motion } from 'framer-motion';
import { Target, Shield, Heart } from 'lucide-react';

export default function AboutPreview() {
 return (
 <section className="py-24 bg-gray-50">
 <div className="container mx-auto px-4">
 <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
 
 <motion.div 
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="lg:w-1/2"
 >
 <h2 className="text-sm font-bold tracking-widest text-nss-red uppercase mb-3">About Us</h2>
 <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
 Who are we?
 </h3>
 <p className="text-gray-600 text-lg mb-4 leading-relaxed">
 NSS Unit, VIT Bhopal University is an official unit under the National Service Scheme (NSS), a flagship initiative by the Ministry of Youth Affairs and Sports, Government of India. Established with the vision of nurturing social responsibility, leadership, and community engagement, the unit comprises around 250 dedicated volunteers committed to serving society.
 </p>
 <p className="text-gray-600 text-lg mb-8 leading-relaxed">
 Following the motto —"Not Me, But You", NSS Unit, VIT Bhopal University actively engages in a wide range of community service initiatives, including education programs, environmental sustainability efforts, health awareness campaigns, and rural development projects. Through various activities, our volunteers strive to make a lasting impact on society while developing essential leadership and teamwork skills.
 </p>

 <a href="/about"className="inline-flex items-center px-6 py-3 bg-nss-blue text-white rounded-full font-bold hover:bg-blue-900 hover:shadow-lg transition-all group">
 Know More About Us <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
 </a>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="lg:w-1/2 flex flex-col gap-6"
 >
 <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 relative group">
 <Heart className="text-nss-red mb-4"size={32} />
 <h4 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h4>
 <p className="text-gray-600 mb-4">To empower students by fostering a deep sense of social responsibility and volunteerism through meaningful community service initiatives.</p>
 <a href="/about#mission"className="text-nss-blue font-bold text-sm inline-flex items-center group-hover:text-nss-red transition-colors">
 Read Full Mission <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
 </a>
 </div>
 
 <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 relative group">
 <Target className="text-blue-500 mb-4"size={32} />
 <h4 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h4>
 <p className="text-gray-600 mb-4">To build a compassionate and service-driven community where young individuals lead the way in social transformation and nation-building.</p>
 <a href="/about#vision"className="text-nss-blue font-bold text-sm inline-flex items-center group-hover:text-nss-red transition-colors">
 Read Full Vision <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
 </a>
 </div>
 </motion.div>

 </div>
 </div>
 </section>
 );
}
