'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  TreePine, 
  Globe, 
  Award, 
  Lightbulb, 
  HandHeart, 
  Quote, 
  Sun, 
  User, 
  Calendar, 
  MessageCircle, 
  Flag,
  ArrowRight,
  Image as ImageIcon,
  Compass,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [expandedInitiativeIndex, setExpandedInitiativeIndex] = useState<number | null>(null);

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
    { title: "Social Responsibility", desc: "Committed to addressing key social issues through meaningful service.", icon: Globe },
    { title: "Selfless Service", desc: 'Upholding the motto "Not Me, But You" by prioritizing community needs.', icon: HandHeart },
    { title: "Leadership & Teamwork", desc: "Encouraging initiative, collaboration, and problem-solving.", icon: Users },
    { title: "Inclusivity & Equality", desc: "Ensuring equal opportunities for all, especially the underprivileged.", icon: Target },
    { title: "Sustainable Development", desc: "Focusing on long-term impact through environmental and social initiatives.", icon: TreePine },
    { title: "Community Engagement", desc: "Working with communities for effective, real-world solutions.", icon: Heart },
    { title: "Skill Development", desc: "Enhancing critical thinking, communication, and leadership skills.", icon: Lightbulb },
    { title: "Integrity & Accountability", desc: "Maintaining ethical standards and transparency in all activities.", icon: ShieldCheck }
  ];

  const initiatives = [
    {
      title: "National Youth Parliament",
      desc: "The NSS Unit of VIT Bhopal University organizes the National Youth Parliament to encourage students to understand parliamentary procedures, democratic values, and the functioning of Indian democracy. The initiative provides a platform for students to discuss national issues, express their views, and participate in structured debates. Through activities such as mock parliamentary proceedings and discussions on important policy matters, students develop public speaking, critical thinking, leadership, and decision-making skills. The programme also encourages youth participation in nation-building and promotes responsible citizenship."
    },
    {
      title: "Mega Tree Plantation Drive",
      desc: "The NSS Unit of VIT Bhopal University conducts Mega Tree Plantation Drives to promote environmental conservation and sustainable living. Volunteers participate in plantation activities across the university campus and other designated areas, contributing to the development of greener surroundings. The initiative highlights the importance of increasing green cover, protecting biodiversity, and addressing environmental challenges. Volunteers are also encouraged to understand the responsibility of caring for planted trees beyond the plantation event. Through collective participation, the drive promotes environmental awareness and a lasting commitment to nature."
    },
    {
      title: "Blood Donation Camp",
      desc: "The NSS Unit of VIT Bhopal University organizes Blood Donation Camps to encourage voluntary blood donation and promote social responsibility among students and the university community. Conducted with the support of medical professionals, these camps provide an opportunity for eligible donors to contribute towards saving lives. The initiative spreads awareness about the importance of maintaining an adequate blood supply for patients in need of medical treatment and emergencies. By encouraging voluntary participation, the camp promotes compassion, community service, and a culture of helping others."
    },
    {
      title: "Free Health Check-Up Camp",
      desc: "The NSS Unit of VIT Bhopal University organizes Free Health Check-Up Camps to improve access to basic healthcare and promote preventive health awareness. These camps include general health consultations, eye check-ups, dental examinations, and other relevant medical services, depending on the programme. Medical professionals guide participants and help them understand the importance of regular health assessments and personal hygiene. The initiative supports the well-being of students and community members while encouraging early attention to potential health concerns. It reflects the NSS commitment to accessible healthcare and community welfare."
    },
    {
      title: "Annual NSS Unit Camp",
      desc: "The Annual NSS Unit Camp brings volunteers together to participate in community service, awareness programmes, educational activities, and personal development initiatives. Through activities such as cleanliness drives, educational outreach, health awareness sessions, cultural programmes, and community interaction, volunteers engage with local needs and social challenges. The camp also encourages teamwork, discipline, leadership, and cooperation among participants. By combining service with experiential learning, the initiative helps students understand their responsibilities towards society and strengthens the spirit of volunteerism."
    },
    {
      title: "Nukkad Natak & Social Awareness Campaigns",
      desc: "The NSS Unit of VIT Bhopal University uses Nukkad Natak, or street theatre, as an engaging medium to spread awareness about important social issues. Through performances and public interactions, volunteers address topics such as voting awareness through Ungli Par Tilak, women empowerment, anti-drug awareness, road safety, cyber security, child welfare, human rights, and environmental responsibility. These performances communicate meaningful messages in an accessible and relatable manner, encouraging people to reflect on social challenges and adopt responsible practices. The initiative develops volunteers’ communication skills while promoting positive social change."
    },
    {
      title: "Har Ghar Tiranga Campaign",
      desc: "The NSS Unit of VIT Bhopal University participates in the Har Ghar Tiranga Campaign to promote patriotism, national pride, and respect for the Indian National Flag. The initiative encourages students and community members to learn about the significance of the Tricolour and its place in India's national identity. Through awareness activities, public engagement, and participation in the campaign, volunteers help spread the message of unity and collective responsibility. The campaign connects citizens with the spirit of India's independence and encourages active participation in celebrating the nation's heritage."
    },
    {
      title: "Swachhata Abhiyan & Cleanliness Drives",
      desc: "The NSS Unit of VIT Bhopal University conducts Swachhata Abhiyan activities to promote cleanliness, hygiene, and responsible waste management. Volunteers participate in cleanliness drives across the campus and community spaces, encouraging people to maintain clean surroundings and adopt better sanitation practices. These activities highlight the importance of individual responsibility in creating healthier public spaces and reducing environmental pollution. Through collective action and awareness, the initiative supports the vision of a cleaner and more sustainable environment."
    },
    {
      title: "Water and Food for Birds Initiative",
      desc: "The NSS Unit of VIT Bhopal University undertakes the Water and Food for Birds Initiative to support birds, particularly during the hot summer months when access to water and food can become difficult. Volunteers arrange water containers and food for birds at suitable locations, encouraging care for local wildlife. The initiative also raises awareness about the importance of protecting birds and creating bird-friendly surroundings. By promoting small but meaningful acts of kindness towards nature, the programme develops compassion for living beings and strengthens environmental responsibility among volunteers."
    },
    {
      title: "Washroom Restoration",
      desc: "The NSS Unit of VIT Bhopal University supports the improvement of sanitation facilities in rural educational institutions through initiatives such as girls’ toilet and washroom restoration. These efforts aim to provide students with cleaner, safer, and more hygienic facilities while promoting dignity, health, and well-being. By addressing essential infrastructure needs in schools, the initiative highlights the importance of adequate sanitation in creating a supportive learning environment, particularly for girls. It reflects the university’s commitment to community development and practical, needs-based social service."
    },
    {
      title: "Cloth and Stationery Donation Drive",
      desc: "The NSS Unit of VIT Bhopal University organizes Cloth and Stationery Donation Drives to support individuals and children who may have limited access to essential resources. Volunteers collect and distribute usable clothing, educational stationery, and other relevant supplies to beneficiaries in need. The initiative promotes generosity, resource sharing, and social responsibility while helping reduce waste through the reuse of usable items. By supporting both basic needs and educational requirements, the drive encourages a culture of compassion and community participation."
    },
    {
      title: "Water Cooler Installation Initiative",
      desc: "The NSS Unit of VIT Bhopal University undertakes initiatives to improve access to drinking water through the installation of water coolers at selected locations based on community needs. These efforts aim to provide a convenient source of drinking water for students and other people using the facilities. Access to drinking water is particularly important during the summer months, when adequate hydration supports health and well-being. The initiative reflects a practical approach to community service by addressing an essential everyday need and promoting public welfare."
    },
    {
      title: "Village Outreach Programme",
      desc: "The NSS Unit of VIT Bhopal University conducts Village Outreach Programmes to connect students with rural communities and understand their needs and challenges. Volunteers participate in community interactions, educational activities, awareness campaigns, cleanliness initiatives, and other service-oriented programmes based on local requirements. These engagements help build stronger relationships between the university and surrounding communities while encouraging students to apply their learning beyond the classroom. The programme promotes empathy, social awareness, teamwork, and meaningful participation in rural development."
    },
    {
      title: "NSS Week Celebration",
      desc: "The NSS Unit of VIT Bhopal University celebrates NSS Week to highlight the values of community service, volunteerism, leadership, and social responsibility. The celebration brings volunteers together through a range of service activities, awareness programmes, competitions, and community engagement initiatives. It provides an opportunity to recognise the contribution of NSS volunteers and encourage more students to participate in socially meaningful work. Through these activities, NSS Week strengthens team spirit and reinforces the motto of selfless service and collective action."
    },
    {
      title: "Independence Day & Republic Day Celebrations",
      desc: "The NSS Unit of VIT Bhopal University participates in Independence Day and Republic Day celebrations to promote patriotism, constitutional values, and national unity among students. Volunteers contribute through event support, flag-related activities, awareness programmes, and other celebrations organised by the university. These occasions provide an opportunity to reflect on India's freedom struggle, democratic foundations, and the responsibilities of citizenship. Through active participation, NSS volunteers help foster respect for the nation and encourage a spirit of unity, discipline, and service."
    },
    {
      title: "Fit India Rally",
      desc: "The NSS Unit of VIT Bhopal University promotes fitness and healthy living through activities such as the Fit India Rally. The initiative encourages students and community members to incorporate physical activity into their daily routines and understand the importance of maintaining a healthy lifestyle. Through rallies and fitness awareness activities, volunteers spread messages about physical well-being, regular exercise, and the prevention of sedentary habits. The programme reinforces the connection between personal fitness, mental well-being, and a healthier society."
    },
    {
      title: "Cultural Programmes (Vibgyor and Nirvana)",
      desc: "The NSS Unit of VIT Bhopal University organizes signature cultural celebrations such as Vibgyor and Nirvana to celebrate artistic heritage, diversity, and youth talent. Vibgyor channels creative expression across multifaceted art forms, dance, and music to communicate profound social messages, while Nirvana provides an introspective platform celebrating unity, mindfulness, and youth synergy. These flagship cultural gatherings reinforce mutual respect, team bonding, and national integration among students while keeping Indian cultural traditions alive."
    }
  ];

  // Program officers section removed per requirements

  return (
    <div className="min-h-screen pt-24 sm:pt-28 bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pb-24 font-sans text-gray-900 relative overflow-hidden">
      
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* 1. Who Are We Section */}
      <section id="who-we-are" className="py-16 container mx-auto px-4 max-w-5xl scroll-mt-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-md p-8 md:p-14 rounded-3xl shadow-xl border border-slate-200/90 border-t-4 border-t-nss-blue"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-center mb-3 bg-gradient-to-r from-nss-blue via-blue-900 to-nss-red bg-clip-text text-transparent">
              Who are we <span className="text-nss-red">?</span>
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-nss-blue to-nss-red mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6 text-base md:text-lg text-gray-700 leading-relaxed font-normal text-justify">
            <p>
              NSS Unit, VIT Bhopal University is an official unit under the National Service Scheme (NSS), a flagship initiative by the Ministry of Youth Affairs and Sports, Government of India. Established with the vision of nurturing social responsibility, leadership, and community engagement, the unit comprises over 250 dedicated volunteers committed to serving society with distinction and honor.
            </p>
            <p>
              Following the noble motto — <span className="font-bold text-nss-blue">"Not Me, But You"</span>, the NSS Unit of VIT Bhopal University actively engages in an expansive portfolio of community service initiatives. These include educational outreach in rural schools, environmental sustainability and plantation drives, preventive health camps, and sustainable village development. Through these endeavors, our volunteers cultivate practical leadership, empathy, and organizational excellence while generating enduring positive change.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2. The Essence of NSS Section */}
      <section id="essence" className="pt-4 pb-8 container mx-auto px-4 max-w-7xl scroll-mt-28">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-nss-red">Core Foundation</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-1 mb-3 tracking-tight">
            The Essence of NSS
          </h2>
          <div className="w-24 h-1.5 bg-nss-red mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Motto */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-md border border-slate-200/90 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-400/80 transition-all"
          >
            <div className="w-14 h-14 bg-red-50 text-nss-red rounded-2xl flex items-center justify-center mb-6">
              <Quote size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">The Motto</h3>
            <p className="text-lg font-black text-nss-blue mb-1">"Not Me, But You"</p>
            <p className="text-gray-500 font-medium text-xs mb-4">स्वयं से पहले आप</p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
              Reflects the essence of democratic living and upholds the need for selfless service. It signifies that the welfare of an individual depends on the welfare of society as a whole.
            </p>
          </motion.div>

          {/* The Symbol */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-md border border-slate-200/90 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-400/80 transition-all"
          >
            <div className="w-14 h-14 bg-blue-50 text-nss-blue rounded-2xl flex items-center justify-center mb-6">
              <Sun size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">The Symbol & Badge</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 text-justify">
              Based on the giant Rath Wheel of the Konark Sun Temple. The 8 bars represent 24 hours of the day, reminding volunteers to be ready for selfless service round the clock.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><span className="font-bold text-nss-red">Red Color:</span> Energy, spirit, and active zeal.</li>
              <li><span className="font-bold text-nss-blue">Navy Blue:</span> Represents the cosmos and unity.</li>
            </ul>
          </motion.div>

          {/* Inspiration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-md border border-slate-200/90 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-400/80 transition-all"
          >
            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <User size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Inspiration</h3>
            <p className="text-base font-black text-gray-800 mb-2">Swami Vivekananda</p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
              The national youth icon of India, Swami Vivekananda, represents the enduring source of inspiration for the National Service Scheme, recognized during International Youth Year 1985.
            </p>
          </motion.div>

          {/* Foundation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-md border border-slate-200/90 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-400/80 transition-all"
          >
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Foundation</h3>
            <p className="text-base font-black text-gray-800 mb-2">September 24, 1969</p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
              Launched during the Mahatma Gandhi Centenary year to foster social responsibility, community consciousness, and voluntary discipline among university students.
            </p>
          </motion.div>

          {/* Salutation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-md border border-slate-200/90 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-400/80 transition-all"
          >
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Salutation</h3>
            <p className="text-base font-black text-purple-700 mb-2">"Jai Hind"</p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
              The official greeting shared among NSS members, symbolizing patriotism, solidarity, and an unshakeable commitment to the nation\'s collective development.
            </p>
          </motion.div>

          {/* Current Theme */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-md border border-slate-200/90 hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-400/80 transition-all"
          >
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Flag size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Official Theme</h3>
            <p className="text-sm font-black text-gray-800 mb-2">"Mera Yuva Bharat & Digital Literacy"</p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-justify">
              Designated focus empowering Indian youth with digital capabilities, community technology access, and grassroots civic engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section id="mission-vision" className="pt-4 pb-10 container mx-auto px-4 max-w-7xl scroll-mt-28">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-1 mb-3 tracking-tight">
            Mission & Vision
          </h2>
          <div className="w-24 h-1.5 bg-nss-blue mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border-t-8 border-t-nss-red border-x border-b border-gray-100"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 bg-red-50 rounded-2xl text-nss-red">
                <Heart size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Our Mission</h2>
            </div>
            
            <ul className="space-y-4">
              {missionPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 text-nss-red">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify">{point}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border-t-8 border-t-nss-blue border-x border-b border-gray-100"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-nss-blue">
                <Target size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Our Vision</h2>
            </div>
            
            <ul className="space-y-4">
              {visionPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 text-nss-blue">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify">{point}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 4. WHAT WE DO: 17 Key Initiatives Cards (3 in a row, expandable, clean links) */}
      <section id="what-we-do" className="py-20 bg-slate-50/70 border-y border-gray-200/60 scroll-mt-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-nss-red">Core Initiatives</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-1 mb-3 tracking-tight">
              What We Do?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore the key social action initiatives, health programs, environmental campaigns, and community outreach drives spearheaded by NSS Unit, VIT Bhopal University.
            </p>
            <div className="w-24 h-1.5 bg-nss-blue mx-auto rounded-full mt-4"></div>
          </div>

          {/* 3 Cards In A Line Desktop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {initiatives.map((item, index) => {
              const isExpanded = expandedInitiativeIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-nss-blue">
                        NSS Initiative
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 group-hover:text-nss-blue transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Expandable Brief with toggle */}
                    <div 
                      onClick={() => setExpandedInitiativeIndex(isExpanded ? null : index)}
                      className="cursor-pointer mb-5 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
                      title="Click to view full brief"
                    >
                      <p className={`text-xs sm:text-sm text-gray-600 leading-relaxed text-justify transition-all ${
                        isExpanded ? 'whitespace-pre-line' : 'line-clamp-4'
                      }`}>
                        {item.desc}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-nss-blue mt-2 select-none group-hover:underline">
                        {isExpanded ? (
                          <>Show less <ChevronUp size={12} /></>
                        ) : (
                          <>Read full initiative details <ChevronDown size={12} /></>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Clean Action Links */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                      title="View Photo Album in Gallery"
                    >
                      <ImageIcon size={13} className="text-nss-blue" /> View Photos
                    </Link>

                    <Link
                      href="/activities"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nss-blue hover:bg-blue-800 text-white font-bold text-[11px] rounded-xl transition-colors shadow-2xs cursor-pointer"
                      title="Participate in Activities"
                    >
                      <span>Participate</span> <ArrowRight size={12} />
                    </Link>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Core Values & Principles Section */}
      <section id="core-values" className="py-20 container mx-auto px-4 max-w-7xl scroll-mt-28">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#383d8a] text-white p-8 md:p-14 rounded-[36px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Guiding Core Values
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
              The fundamental principles that guide our volunteers in every project, campaign, and community interaction.
            </p>
            <div className="w-20 h-1.5 bg-nss-red mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {corePrinciples.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all"
                >
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4 text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-xs text-gray-200 leading-relaxed text-justify">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Program officers section removed */}

    </div>
  );
}
