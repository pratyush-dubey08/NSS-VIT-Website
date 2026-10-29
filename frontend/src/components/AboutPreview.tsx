'use client';

import { motion } from 'framer-motion';
import { Target, Heart } from 'lucide-react';

export default function AboutPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-red-50/20 via-slate-50/80 to-blue-50/30 relative overflow-hidden">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -z-10 select-none">
        <img src="/images/nss-logo.webp" alt="" className="w-[450px] h-[450px] object-contain" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <span className="text-xs font-black tracking-widest text-nss-red uppercase px-3.5 py-1 bg-red-50 rounded-full border border-red-200/80 inline-block mb-3 shadow-xs">
              About Us
            </span>
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-r from-nss-blue via-blue-900 to-nss-red bg-clip-text text-transparent">
              Who are we?
            </h3>
            <p className="text-gray-700 text-base md:text-lg mb-4 leading-relaxed text-justify font-normal">
              NSS Unit, VIT Bhopal University is an official unit under the National Service Scheme (NSS), a flagship initiative by the Ministry of Youth Affairs and Sports, Government of India. Established with the vision of nurturing social responsibility, leadership, and community engagement, the unit comprises around 250 dedicated volunteers committed to serving society.
            </p>
            <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed text-justify font-normal">
              Following the motto — <strong className="text-nss-blue font-bold">"Not Me, But You"</strong>, NSS Unit, VIT Bhopal University actively engages in a wide range of community service initiatives, including education programs, environmental sustainability efforts, health awareness campaigns, and rural development projects. Through various activities, our volunteers strive to make a lasting impact on society while developing essential leadership and teamwork skills.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="/about" 
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-nss-blue via-blue-900 to-nss-blue text-white rounded-full font-bold hover:shadow-xl hover:shadow-blue-950/20 hover:scale-[1.02] transition-all duration-300 group"
              >
                Know More About Us <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a 
                href="/about#what-we-do" 
                className="inline-flex items-center px-6 py-3.5 bg-white border-2 border-nss-red text-nss-red hover:bg-red-50 rounded-full font-bold hover:shadow-lg hover:shadow-red-950/15 hover:scale-[1.02] transition-all duration-300 group"
              >
                What We Do? <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex flex-col gap-6"
          >
            {/* Mission Card - Crimson Red Accent */}
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-lg shadow-red-900/5 border border-slate-200/90 border-l-4 border-l-nss-red transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/15 hover:-translate-y-1.5 relative group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-nss-red mb-4 group-hover:bg-nss-red group-hover:text-white transition-colors duration-300 shadow-xs">
                <Heart size={26} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-nss-red transition-colors">Our Mission</h4>
              <p className="text-gray-700 mb-4 text-justify leading-relaxed">To empower students by fostering a deep sense of social responsibility and volunteerism through meaningful community service initiatives.</p>
              <a href="/about#mission" className="text-nss-red font-extrabold text-sm inline-flex items-center group-hover:text-red-700 transition-colors">
                Read Full Mission <span className="ml-1 group-hover:translate-x-1.5 transition-transform">→</span>
              </a>
            </div>
            
            {/* Vision Card - Deep Navy Blue Accent */}
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-lg shadow-blue-900/5 border border-slate-200/90 border-l-4 border-l-nss-blue transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/15 hover:-translate-y-1.5 relative group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-nss-blue mb-4 group-hover:bg-nss-blue group-hover:text-white transition-colors duration-300 shadow-xs">
                <Target size={26} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-nss-blue transition-colors">Our Vision</h4>
              <p className="text-gray-700 mb-4 text-justify leading-relaxed">To build a compassionate and service-driven community where young individuals lead the way in social transformation and nation-building.</p>
              <a href="/about#vision" className="text-nss-blue font-extrabold text-sm inline-flex items-center group-hover:text-blue-800 transition-colors">
                Read Full Vision <span className="ml-1 group-hover:translate-x-1.5 transition-transform">→</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
