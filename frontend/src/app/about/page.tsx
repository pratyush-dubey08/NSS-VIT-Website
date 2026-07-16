'use client';

import { motion } from 'framer-motion';
import { Target, Heart, CheckCircle2, ShieldCheck, Users, TreePine, Globe, Award, Lightbulb, HandHeart, Quote, Sun, User, Calendar, MessageCircle, Flag } from 'lucide-react';

export default function AboutPage() {
 const missionPoints = [
"To empower students by fostering a deep sense of social responsibility and volunteerism through meaningful community service initiatives.",
"To promote inclusive development by engaging in activities that address critical social issues such as education, healthcare, sanitation, and environmental conservation.",
"To encourage youth leadership and teamwork, enabling students to become proactive changemakers in society.",
"To instill ethical values and a sense of duty towards marginalized communities, ensuring holistic personal and professional growth.",
"To collaborate with government bodies, NGOs, and local communities to drive sustainable and impactful change."
 ];

 const visionPoints = [
"To build a compassionate and service-driven community where young individuals lead the way in social transformation and nation-building.",
"To establish NSS Unit, VIT Bhopal University as a center of excellence in social service, where students contribute meaningfully to the betterment of society.",
"To create a long-lasting impact by implementing sustainable community development projects focused on education, health, and environmental sustainability.",
"To nurture a generation of responsible citizens who uphold the values of selflessness, inclusivity, and integrity while working towards a progressive and equitable society.",
"To bridge the gap between privileged and underprivileged communities, ensuring that every individual gets the opportunity to lead a dignified and empowered life."
 ];

 const corePrinciples = [
 { title:"Social Responsibility", desc:"Committed to addressing key social issues through meaningful service.", icon: Globe },
 { title:"Selfless Service", desc: 'Upholding the motto"Not Me, But You"by prioritizing community needs.', icon: HandHeart },
 { title:"Leadership & Teamwork", desc:"Encouraging initiative, collaboration, and problem-solving.", icon: Users },
 { title:"Inclusivity & Equality", desc:"Ensuring equal opportunities for all, especially the underprivileged.", icon: Target },
 { title:"Sustainable Development", desc:"Focusing on long-term impact through environmental and social initiatives.", icon: TreePine },
 { title:"Community Engagement", desc:"Working with communities for effective, real-world solutions.", icon: Heart },
 { title:"Skill Development", desc:"Enhancing critical thinking, communication, and leadership skills.", icon: Lightbulb },
 { title:"Integrity & Accountability", desc:"Maintaining ethical standards and transparency in all activities.", icon: ShieldCheck }
 ];

 return (
 <div className="min-h-screen pt-24 bg-gray-50 pb-20">
 
 {/* Who are we Section */}
 <section className="py-16 container mx-auto px-4 max-w-5xl">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 className="bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-gray-100"
 >
 <div className="text-center mb-10">
 <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
 Who are we <span className="text-nss-red">?</span>
 </h1>
 <div className="w-24 h-1.5 bg-nss-blue mx-auto rounded-full"></div>
 </div>
 
 <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
 <p>
 NSS Unit, VIT Bhopal University is an official unit under the National Service Scheme (NSS), a flagship initiative by the Ministry of Youth Affairs and Sports, Government of India. Established with the vision of nurturing social responsibility, leadership, and community engagement, the unit comprises around 250 dedicated volunteers committed to serving society.
 </p>
 <p>
 Following the motto —"Not Me, But You", NSS Unit, VIT Bhopal University actively engages in a wide range of community service initiatives, including education programs, environmental sustainability efforts, health awareness campaigns, and rural development projects. Through various activities, our volunteers strive to make a lasting impact on society while developing essential leadership and teamwork skills.
 </p>
 </div>
 </motion.div>
 </section>

 {/* The Essence of NSS Section */}
 <section className="py-16 container mx-auto px-4 max-w-7xl">
 <div className="text-center mb-16">
 <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
 The Essence of NSS
 </h2>
 <div className="w-24 h-1.5 bg-nss-red mx-auto rounded-full"></div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {/* Motto */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
 className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform"
 >
 <div className="w-14 h-14 bg-red-50 text-nss-red rounded-2xl flex items-center justify-center mb-6">
 <Quote size={28} />
 </div>
 <h3 className="text-2xl font-bold mb-3 text-gray-900">The Motto</h3>
 <p className="text-xl font-bold text-nss-blue mb-1">"Not Me, But You"</p>
 <p className="text-gray-600 font-medium mb-4">स्वयं से पहले आप</p>
 <p className="text-gray-600 text-sm leading-relaxed">
 Reflects the essence of democratic living and upholds the need for selfless service. It signifies that the welfare of an individual depends on the welfare of society.
 </p>
 </motion.div>

 {/* The Symbol */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
 className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform"
 >
 <div className="w-14 h-14 bg-blue-50 text-nss-blue rounded-2xl flex items-center justify-center mb-6">
 <Sun size={28} />
 </div>
 <h3 className="text-2xl font-bold mb-3 text-gray-900">The Symbol & Badge</h3>
 <p className="text-gray-600 text-sm leading-relaxed mb-3">
 Based on the giant Rath Wheel of the Konark Sun Temple. The 8 bars represent 24 hours of the day, reminding volunteers to be ready for service round the clock.
 </p>
 <ul className="text-sm text-gray-600 space-y-1">
 <li><span className="font-bold text-nss-red">Red color:</span> Energy, spirit, and active nature.</li>
 <li><span className="font-bold text-nss-blue">Navy Blue color:</span> Represents the cosmos.</li>
 </ul>
 </motion.div>

 {/* Inspiration */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
 className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform"
 >
 <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
 <User size={28} />
 </div>
 <h3 className="text-2xl font-bold mb-3 text-gray-900">Inspiration</h3>
 <p className="text-lg font-bold text-gray-800 mb-2">Swami Vivekananda</p>
 <p className="text-gray-600 text-sm leading-relaxed">
 The youth icon of India, Swami Vivekananda, is the inspirational figure for the National Service Scheme, recognized during the International Youth Year 1985.
 </p>
 </motion.div>

 {/* Foundation */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
 className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform"
 >
 <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
 <Calendar size={28} />
 </div>
 <h3 className="text-2xl font-bold mb-3 text-gray-900">Foundation</h3>
 <p className="text-lg font-bold text-gray-800 mb-2">September 24, 1969</p>
 <p className="text-gray-600 text-sm leading-relaxed">
 Launched during the Mahatma Gandhi Centenary year to foster social responsibility, consciousness, and self-motivated discipline among students in higher education.
 </p>
 </motion.div>

 {/* Salutation */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
 className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform"
 >
 <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
 <MessageCircle size={28} />
 </div>
 <h3 className="text-2xl font-bold mb-3 text-gray-900">Salutation</h3>
 <p className="text-xl font-bold text-purple-700 mb-2">"Jai Hind"</p>
 <p className="text-gray-600 text-sm leading-relaxed">
 The official greeting used among NSS members, symbolizing patriotism, unity, and a shared commitment to the nation's progress.
 </p>
 </motion.div>

 {/* Current Theme */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
 className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform"
 >
 <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
 <Flag size={28} />
 </div>
 <h3 className="text-2xl font-bold mb-3 text-gray-900">Theme (2025-26)</h3>
 <p className="text-base font-bold text-gray-800 mb-2 text-balance leading-snug">
 "Mera Yuva Bharat evam Digital Saksharta ke liye Yuva"
 </p>
 <p className="text-gray-600 text-sm leading-relaxed">
 (Youth for My Youthful India and Digital Literacy). The official theme designated for regular and special camping activities.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Mission & Vision Section */}
 <section className="py-12 container mx-auto px-4 max-w-7xl mt-10">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
        NSS Unit, VIT Bhopal University
      </h2>
      <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
        Our Mission, Vision, and Core Principles guiding the unit towards impactful social transformation and nation-building.
      </p>
      <div className="w-24 h-1.5 bg-nss-blue mx-auto rounded-full mt-8"></div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
 
 {/* Mission */}
 <motion.div 
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 id="mission"
 className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-t-8 border-t-nss-red border-x border-b border-gray-100"
 >
 <div className="flex items-center gap-4 mb-8">
 <div className="p-4 bg-red-50 rounded-2xl text-nss-red">
 <Heart size={40} />
 </div>
 <h2 className="text-4xl font-black text-gray-900">Mission</h2>
 </div>
 
 <ul className="space-y-6">
 {missionPoints.map((point, index) => (
 <li key={index} className="flex items-start gap-4">
 <div className="mt-1 flex-shrink-0 text-nss-red">
 <CheckCircle2 size={24} />
 </div>
 <p className="text-gray-700 text-lg leading-relaxed">{point}</p>
 </li>
 ))}
 </ul>
 </motion.div>

 {/* Vision */}
 <motion.div 
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 id="vision"
 className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-t-8 border-t-nss-blue border-x border-b border-gray-100"
 >
 <div className="flex items-center gap-4 mb-8">
 <div className="p-4 bg-blue-50 rounded-2xl text-nss-blue">
 <Target size={40} />
 </div>
 <h2 className="text-4xl font-black text-gray-900">Vision</h2>
 </div>
 
 <ul className="space-y-6">
 {visionPoints.map((point, index) => (
 <li key={index} className="flex items-start gap-4">
 <div className="mt-1 flex-shrink-0 text-nss-blue">
 <CheckCircle2 size={24} />
 </div>
 <p className="text-gray-700 text-lg leading-relaxed">{point}</p>
 </li>
 ))}
 </ul>
 </motion.div>

 </div>
 </section>

 {/* Core Principles Section */}
 <section className="py-20 container mx-auto px-4 max-w-7xl">
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-[#383d8a] text-white p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
 <div className="absolute bottom-0 left-0 w-96 h-96 bg-nss-red/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
 
 <div className="relative z-10">
 <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
 Core Principles guiding the NSS Unit
 </h2>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 md:gap-y-12">
 {corePrinciples.map((principle, index) => (
 <div key={index} className="flex gap-6 group">
 <div className="flex-shrink-0 mt-1">
 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
 <principle.icon size={28} className="text-white"/>
 </div>
 </div>
 <div>
 <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
 <span className="text-nss-red font-black">{index + 1}.</span> 
 {principle.title}
 </h3>
 <p className="text-blue-100 text-lg leading-relaxed">
 {principle.desc}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 </section>

 </div>
 );
}
