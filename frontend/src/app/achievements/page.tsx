'use client';

import { motion } from 'framer-motion';
import { Award, Star, Trophy, Target, MapPin, Calendar, Users, Flag, Shield, Medal, BookOpen } from 'lucide-react';

const CamperCard = ({ name, regNo, role, image, delay = 0, color = "blue" }: any) => {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/10 to-nss-blue/10 border-blue-100 text-nss-blue",
    purple: "from-purple-500/10 to-indigo-500/10 border-purple-100 text-purple-600",
    emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-100 text-emerald-600",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-100 text-amber-600",
    rose: "from-rose-500/10 to-pink-500/10 border-rose-100 text-rose-600",
  };
  
  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className="group relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${selectedColor.split(' ')[0]} ${selectedColor.split(' ')[1]} rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500`}></div>
      <div className={`relative bg-white/70 backdrop-blur-xl border ${selectedColor.split(' ')[2]} p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden h-full`}>
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-5 relative bg-gray-100 flex items-center justify-center z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Users size={40} className="text-gray-300" />
          )}
        </div>
        
        <h4 className="text-xl font-bold text-gray-900 mb-1 z-10">{name}</h4>
        {regNo && <p className={`text-sm font-bold ${selectedColor.split(' ')[3]} mb-2 z-10`}>{regNo}</p>}
        {role && (
          <span className={`inline-flex items-center px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm ${selectedColor.split(' ')[3]} text-xs font-black uppercase tracking-widest z-10 shadow-sm border border-black/5 mt-auto`}>
            {role}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function AwardeesPage() {
  return (
    <div className="min-h-screen pt-24 bg-slate-50 pb-32 overflow-hidden selection:bg-nss-blue selection:text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-none"
          >
            Awardees & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-nss-blue to-indigo-600">Campers</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Honoring the exceptional dedication, leadership, and outstanding achievements of our NSS volunteers and program officers on State and National platforms.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl space-y-32 relative z-10">
        
        {/* 1. NIC */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10"></div>
            
            <div className="w-full lg:w-1/3 flex justify-center">
               <div className="relative w-72 h-80">
                  <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 opacity-10 transition-transform duration-500 hover:rotate-12"></div>
                  <div className="absolute inset-0 bg-white p-2 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center">
                    <CamperCard 
                      name="Rishabh Kabra" 
                      regNo="21MSI10017" 
                      role="State Representative"
                      color="blue"
                      image="https://ui-avatars.com/api/?name=Rishabh+Kabra&background=2563EB&color=fff&size=256&bold=true"
                    />
                  </div>
               </div>
            </div>
            
            <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
              <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-black uppercase tracking-widest">
                <Flag size={18} /> National Integration Camp (NIC)
              </div>
              <h3 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Representing VIT Bhopal & Madhya Pradesh
              </h3>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                Rishabh Kabra was selected to be the esteemed representative of VIT Bhopal University and Madhya Pradesh for the National Level NSS National Integration Camp (NIC), promoting national harmony and cultural exchange.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                  <MapPin className="text-blue-600 shrink-0 mt-1" size={24} />
                  <p className="text-slate-700 font-semibold">C.C.S. Agricultural University, Hisar, Haryana</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                  <Shield className="text-blue-600 shrink-0 mt-1" size={24} />
                  <p className="text-slate-700 font-semibold">Ministry of Youth Affairs and Sports, Govt. of India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. State Level Pachore */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-slate-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-emerald-900/20 border border-slate-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
          >
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-900/40 to-transparent rounded-tr-full -z-10"></div>
            
            <div className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <CamperCard 
                  name="Rishabh Kabra" 
                  regNo="21MSI10017" 
                  color="emerald"
                  delay={0.1}
                  image="https://ui-avatars.com/api/?name=Rishabh+Kabra&background=059669&color=fff&size=256&bold=true"
                />
                <CamperCard 
                  name="Khushi Desai" 
                  regNo="22BOE10027" 
                  color="emerald"
                  delay={0.2}
                  image="https://ui-avatars.com/api/?name=Khushi+Desai&background=10B981&color=fff&size=256&bold=true"
                />
            </div>
            
            <div className="w-full lg:w-7/12 space-y-6 flex flex-col items-start text-left">
              <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-black uppercase tracking-widest border border-emerald-500/30">
                <Award size={18} /> State Level Leadership Training Camp 2024
              </div>
              <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                Excellence in Public Awareness & Leadership
              </h3>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                Chosen for the State-Level Leadership Training Camp conducted by the Ministry of Higher Education, Govt. of Madhya Pradesh at Pachore. Their selection was made based on outstanding contributions to public awareness programs, such as <strong className="text-emerald-400">medical camps and street plays</strong>.
              </p>
              <div className="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 italic text-slate-200 shadow-inner">
                "Their work was admired by Assistant Vice President Ms. Kadambari Vishwanathan, Program Officer Dr. Vinod Bhatt, Dr. Abha Gupta, and other officials. Their commitment reflects the essence of NSS leadership and service."
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. State Level Chitrakoot */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-slate-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-rose-900/20 border border-slate-800 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden text-white"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-rose-900/40 to-transparent rounded-bl-full -z-10"></div>
            
            <div className="w-full lg:w-7/12 space-y-6 flex flex-col items-start text-left">
              <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-sm font-black uppercase tracking-widest border border-rose-500/30">
                <Award size={18} /> State Level Leadership Training Camp 2026
              </div>
              <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                Excellence in Social Welfare & Leadership
              </h3>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                Chosen for the State-Level Leadership Training Camp at Chitrakoot. Representing VIT Bhopal University under the leadership category, their immense contribution to social welfare and community development was highly recognized.
              </p>
              <div className="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 italic text-slate-200 shadow-inner">
                "Their dedication was applauded by the Vice Chancellor of VIT Bhopal University, Dr. Satish Kr. Modh. Their commitment reflects the true essence of NSS leadership."
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold border border-white/20 mt-4 backdrop-blur-md">
                  <Calendar size={20} className="text-rose-400" /> 8th - 14th March 2026 • Chitrakoot
              </div>
            </div>

            <div className="w-full lg:w-5/12 space-y-8 relative z-10">
              
              {/* Program Officer Featured Mini-Card */}
              <div className="bg-gradient-to-r from-rose-500/20 to-rose-600/10 border border-rose-500/30 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md">
                <div className="w-20 h-20 shrink-0 bg-white/10 p-1 rounded-full backdrop-blur-sm border border-white/20">
                   <div className="w-full h-full bg-gray-100 rounded-full overflow-hidden flex items-center justify-center relative">
                     <img src="https://ui-avatars.com/api/?name=Vinod+Bhatt&background=E11D48&color=fff&size=256&bold=true" alt="Dr. Vinod Bhatt" className="w-full h-full object-cover" />
                   </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-rose-300 text-xs font-black uppercase tracking-widest mb-1">
                     <Star size={12} className="fill-rose-400 text-rose-400" /> Program Officer
                  </div>
                  <h4 className="text-2xl font-black text-white">Dr. Vinod Bhatt</h4>
                </div>
              </div>

              {/* Volunteers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CamperCard 
                  name="Pratyush Dubey" 
                  regNo="23BAI10595"
                  color="rose"
                  delay={0.1}
                  image="https://ui-avatars.com/api/?name=Pratyush+Dubey&background=E11D48&color=fff&size=256&bold=true"
                />
                <CamperCard 
                  name="Shivani Nikam" 
                  regNo="24BEY10074"
                  color="rose"
                  delay={0.2}
                  image="https://ui-avatars.com/api/?name=Shivani+Nikam&background=E11D48&color=fff&size=256&bold=true"
                />
              </div>

            </div>
          </motion.div>
        </section>

        {/* 4. National Youth Parliament */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-indigo-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-indigo-900/20 border border-indigo-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="w-full lg:w-1/3 flex justify-center relative z-10">
               <div className="relative w-72 h-80">
                  <div className="absolute inset-0 bg-yellow-400 rounded-3xl -rotate-6 opacity-20 transition-transform duration-500 hover:-rotate-12"></div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md p-2 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center">
                    <CamperCard 
                      name="Nandine Pandey" 
                      role="State Representative"
                      color="amber"
                      image="https://ui-avatars.com/api/?name=Nandine+Pandey&background=F59E0B&color=fff&size=256&bold=true"
                    />
                  </div>
               </div>
            </div>
            
            <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
              <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-xl text-sm font-black uppercase tracking-widest border border-yellow-400/30">
                <Trophy size={18} /> National Youth Parliament 2025
              </div>
              <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                Top 10 at Nodal Level: <span className="text-indigo-300">Viksit Bharat Youth Parliament</span>
              </h3>
              <p className="text-indigo-100 text-lg md:text-xl leading-relaxed">
                The event witnessed a remarkable confluence of youthful energy and intellectual discourse across Bhopal, Sehore, and Vidisha districts on the transformative theme of <strong className="text-white">“One Nation, One Election.”</strong>
              </p>
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-5 shadow-inner">
                <Medal className="text-yellow-400 shrink-0 mt-1" size={32} />
                <p className="text-white font-medium text-lg leading-relaxed">
                  Amidst fierce competition, Nandine Pandey's outstanding performance earned her the honour of representing the Nodal District (Bhopal) at the State Youth Parliament in the Madhya Pradesh Assembly.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 5. National Youth Parliament 2026 */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-indigo-950 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-indigo-900/20 border border-indigo-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
          >
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="w-full lg:w-1/3 flex justify-center relative z-10">
               <div className="relative w-72 h-80">
                  <div className="absolute inset-0 bg-yellow-400 rounded-3xl rotate-6 opacity-20 transition-transform duration-500 hover:rotate-12"></div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md p-2 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center">
                    <CamperCard 
                      name="Nandine Pandey" 
                      role="Sehore Representative"
                      color="amber"
                      image="https://ui-avatars.com/api/?name=Nandine+Pandey&background=F59E0B&color=fff&size=256&bold=true"
                    />
                  </div>
               </div>
            </div>
            
            <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
              <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-xl text-sm font-black uppercase tracking-widest border border-yellow-400/30">
                <Trophy size={18} /> National Youth Parliament 2026
              </div>
              <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                Representing <span className="text-indigo-300">Sehore District</span>
              </h3>
              <p className="text-indigo-100 text-lg md:text-xl leading-relaxed">
                Continuing her outstanding journey in youth advocacy and democratic discourse, Nandine Pandey was once again selected for the prestigious National Youth Parliament.
              </p>
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-5 shadow-inner">
                <Medal className="text-yellow-400 shrink-0 mt-1" size={32} />
                <p className="text-white font-medium text-lg leading-relaxed">
                  Building upon her previous success, she proudly represented the Sehore district in 2026, showcasing exemplary leadership and oratorical skills on a significant platform.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 6. My Bharat Budget Quest */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-orange-900/5 border border-slate-100 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 -z-10"></div>
            
            <div className="w-full lg:w-1/3 flex justify-center">
               <div className="relative w-72 h-80">
                  <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-6 opacity-10 transition-transform duration-500 hover:rotate-12"></div>
                  <div className="absolute inset-0 bg-white p-2 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center">
                    <CamperCard 
                      name="Maulik Dubey" 
                      role="Finalist"
                      color="amber"
                      image="https://ui-avatars.com/api/?name=Maulik+Dubey&background=F97316&color=fff&size=256&bold=true"
                    />
                  </div>
               </div>
            </div>
            
            <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
              <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-black uppercase tracking-widest border border-orange-100">
                <BookOpen size={18} /> My Bharat Budget Quest 2026
              </div>
              <h3 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Selected for the <span className="text-orange-600">Final Round</span>
              </h3>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                Maulik Dubey has showcased exceptional analytical and financial acumen, earning a highly coveted spot in the final round of the prestigious My Bharat Budget Quest. His achievement is a matter of immense pride for the NSS Unit, VIT Bhopal University.
              </p>
              <div className="grid grid-cols-1 gap-4 pt-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                  <MapPin className="text-orange-500 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-slate-700 font-semibold">Aaryabhat Sabhagar, LNCT College, Patel Nagar, Bhopal</p>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2"><Calendar size={14}/> 11th - 13th April, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
