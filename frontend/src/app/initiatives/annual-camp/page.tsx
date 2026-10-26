'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Newspaper, 
  Image as ImageIcon, 
  ArrowRight,
  Sun,
  Heart,
  Users,
  Award,
  Sparkles,
  BookOpen,
  FolderOpen,
  X,
  ZoomIn
} from 'lucide-react';
import Link from 'next/link';

// Common Routine Schedule
const commonDailyRoutine = [
  {
    id: 'prabhat-pheri',
    title: 'Prabhat Pheri (Morning Awareness Procession)',
    desc: 'Each day at dawn begins with a lively Prabhat Pheri through the village lanes. Volunteers chant uplifting slogans and sing devotional Ramdhuni accompanied by dholak, cymbals, and traditional instruments. This musical initiative awakens community spirit, fosters spiritual harmony, and spreads vital awareness messages on cleanliness, education, and health directly to rural doorsteps.'
  },
  {
    id: 'yoga-pt',
    title: 'Spiritual Yoga & Physical Fitness (PT)',
    desc: 'Following the morning procession, a dedicated physical training and yoga session is conducted. Volunteers engage in warm-up routines, stretching, pranayama, and guided meditation. This practice instills physical endurance, mental clarity, and discipline, equipping participants with the energy and serenity required for intensive community service.'
  },
  {
    id: 'breakfast',
    title: 'Self-Prepared Community Breakfast',
    desc: 'Upholding the core NSS principle of self-reliance (Aatmanirbharta), breakfast is prepared collectively by the volunteers themselves in the camp kitchen. Teams work in harmony managing culinary preparation, service, and kitchen sanitation, cultivating humility, cooperation, and shared responsibility.'
  },
  {
    id: 'shramdaan',
    title: 'Shramdaan & Village Development Drives',
    desc: 'The central service block of each day is dedicated to community action across the village. Volunteers conduct village-wide cleanliness campaigns (Swachhata Abhiyan), clearing streets, drainage pathways, and public premises. Depending on the schedule, teams also execute extensive tree plantation drives, medical and health check-up surveys, door-to-door socio-economic assessments, and donation drives distributing clothes, books, and educational stationery to underprivileged children.'
  },
  {
    id: 'nature-trekking',
    title: 'Nature Trekking & Eco-Exploration',
    desc: 'On one designated day during the 7-day camp, the morning routine transitions into an adventurous nature trekking expedition to surrounding hills and forest ranges (such as Kusmania mountain ranges or the Astha Wildlife Range). This invigorating outdoor experience builds physical stamina, fosters deep appreciation for local biodiversity and ecology, and strengthens unity and camaraderie among the volunteer contingent.'
  },
  {
    id: 'lunch',
    title: 'Lunch for Volunteers',
    desc: 'A daily wholesome and nutritious lunch prepared at the camp kitchen for all NSS volunteers. This provides an essential resting and recharging break between morning field drives and afternoon intellectual sessions, allowing volunteers to relax, bond, and reflect on the morning’s outreach.'
  },
  {
    id: 'baudhik-satra',
    title: 'Baudhik Satra (Intellectual Discourse Sessions)',
    desc: 'An essential academic and social pillar of the camp where distinguished guest dignitaries, university leadership, and domain specialists deliver interactive lectures on pressing societal themes. Topics span cyber security, artificial intelligence in agriculture, child safety, women empowerment, road safety, and civic duties. Notably, village residents and youth sit side-by-side with volunteers, making this an enriching inclusive forum of mutual learning.'
  },
  {
    id: 'competitions',
    title: 'Inter-Volunteer Creative Competitions',
    desc: 'To foster creativity, healthy competition, and intellectual engagement, varied contests are held between volunteer groups. These include rangoli making on social themes (Mera Yuva Bharat, Beti Bachao), poster painting, extempore speech, debate, and essay writing.'
  },
  {
    id: 'outdoor-activities',
    title: 'Outdoor Activities (Games, Awareness Rallies & Street Plays)',
    desc: 'Late afternoon field engagements where, depending on the day’s scheduled plan, volunteers engage in traditional NSS team-building games (Rumaal Jhappata, Kitne Bhai Kitne, Ram-Ravana Yudh), lead thematic public awareness rallies through the village streets, or perform impactful street plays (Nukkad Natak) on social issues at central village intersections to engage and educate the local community.'
  },
  {
    id: 'cultural-evening',
    title: 'Cultural Evening',
    desc: 'The evening culminates in an uplifting cultural program open to the village residents. Volunteers present diverse folk dances, patriotic music, instrumental recitals, and inspirational poetry celebrating India’s cultural heritage, strengthening deep community bonds.'
  },
  {
    id: 'dinner-debriefing',
    title: 'Dinner & Daily Debriefing',
    desc: 'Following dinner, volunteers assemble for their daily debriefing. Group leaders summarize achievements, evaluate challenges faced during the day, review community feedback, and establish the operational roster for the upcoming morning.'
  },
  {
    id: 'grand-campfire',
    title: 'Grand Campfire & Farewell Gathering (Final Night)',
    desc: 'Conducted exclusively on the final night of the seven-day camp, the traditional grand campfire brings together all volunteers, faculty coordinators, and village elders. Surrounded by the warmth of the fire, volunteers share their personal reflections, sing patriotic and folk songs, celebrate the week’s accomplishments, and bid an emotional farewell to the village.'
  }
];

// 16 Authentic Real Field Camp Action Photos from ANC 2026, 2025, and 2024 (No captions)
const heroCampPhotos = [
  // ANC 2026 (Gram Borkheda)
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792972948/nss_vit_website/ydmr2p4ujlvf9ndo7bid.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792972947/nss_vit_website/n8zsqhoxdjxk04deef3p.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792972947/nss_vit_website/wmbx7z6cherz2c6bb6ho.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792972950/nss_vit_website/dahu2hum58xsjin9vdyh.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792972951/nss_vit_website/ydknfiudozriwy9hffqp.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792972953/nss_vit_website/wgbcglj9rsbjskzsjyqr.jpg',
  
  // ANC 2025 (Gram Jafarabad)
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973350/nss_vit_website/b8mka7okpwddhvqmbnwg.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973350/nss_vit_website/zetb4kqynx8chdgnr7uc.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973350/nss_vit_website/vqyfkoem9wufzhmyanqx.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973352/nss_vit_website/zgosydolpn5j4sduudux.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973354/nss_vit_website/k8mgq1trsh5kyuti1ztw.jpg',

  // ANC 2024 (Gram Kachnariya)
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969136/nss_vit_website/kj4tf366p1t6ji2zp8nm.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969136/nss_vit_website/yxlhufykeahoj6rpkhfo.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969137/nss_vit_website/vtaka2byoxsmtwz1hzqb.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969138/nss_vit_website/op6s1amaspjjvpwrmw4l.jpg',
  'https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969139/nss_vit_website/yorqqztbkh1rrqt9smvt.jpg'
];

// Press Releases from Press relaese folder for ANC 2026 (No captions)
const pressReleases2026 = [
  '/images/press_2026/IMG-20260324-WA0010.jpg',
  '/images/press_2026/IMG-20260324-WA0011.jpg',
  '/images/press_2026/IMG-20260324-WA0012.jpg',
  '/images/press_2026/IMG-20260324-WA0013.jpg',
  '/images/press_2026/IMG-20260324-WA0014.jpg',
  '/images/press_2026/IMG-20260324-WA0015.jpg',
  '/images/press_2026/IMG-20260324-WA0016.jpg',
  '/images/press_2026/IMG-20260324-WA0017.jpg',
];

export default function AnnualCampPage() {
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [activeCampYear, setActiveCampYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [selectedPressImage, setSelectedPressImage] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // Auto-transition header photos every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pb-24 font-sans text-gray-900 relative overflow-hidden">
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Hero Header Section */}
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl shadow-2xl bg-slate-900 border border-gray-100 mb-8"
        >
          {/* Direct "See more..." Link to Special Camp Albums on Top-Right */}
          <Link
            href="/gallery?category=camps"
            className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Explore All Special Camps in Gallery"
          >
            <FolderOpen size={14} className="text-amber-400" />
            <span>See more...</span>
            <ArrowRight size={13} />
          </Link>

          {/* Inner Image Grid with Smooth Live Transition & Proper Full Height without Cropping */}
          <div className="rounded-3xl overflow-hidden bg-slate-950">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
              {[0, 1, 2, 3].map((slot) => {
                const photoIdx = (slideIndex * 4 + slot) % heroCampPhotos.length;
                const photoSrc = heroCampPhotos[photoIdx];

                return (
                  <div key={slot} className="relative aspect-[4/3] sm:aspect-[16/10] md:h-52 rounded-2xl overflow-hidden bg-slate-900 group">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={photoSrc}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <img 
                          src={photoSrc} 
                          alt="Camp Photography" 
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Full Unclipped Badge */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white px-6 sm:px-10 md:px-14 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-gray-200/90 flex items-center justify-center max-w-[92%]">
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-nss-blue tracking-tight text-center uppercase whitespace-nowrap">
              7 Day Annual NSS Unit Camp
            </h1>
          </div>
        </motion.div>

        {/* 2 Well-crafted Introductory Paragraphs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 md:mt-16 max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed font-normal text-justify"
        >
          <p className="text-base sm:text-lg leading-relaxed">
            The 7 Day Annual NSS Unit Camp, organized each academic year by the National Service Scheme (NSS) Unit of VIT Bhopal University, represents a premier rural immersion initiative held in villages across Sehore district, Madhya Pradesh. Grounded firmly in the foundational motto of <span className="font-bold text-nss-blue">"Not Me, But You"</span>, the primary objective of this week-long camp is the holistic development and betterment of rural villages. Student volunteers live within the village community and work tirelessly to execute every possible measure that improves the lives of the villagers—from village-wide cleanliness campaigns (Swachhata Abhiyan) and health check-ups to school teaching, plantation drives, and social awareness campaigns.
          </p>
          
          <p className="text-base sm:text-lg leading-relaxed">
            Through this selfless dedication to village upliftment, the camp simultaneously serves as a transformative platform for volunteers’ own personal growth. By experiencing rural life firsthand, overcoming real-world challenges, and collaborating closely with village residents and local administration, students cultivate humility, crisis management, leadership, and emotional resilience. This deep bond between youth and rural society instills lifelong civic empathy, empowering volunteers to evolve into responsible, socially conscious nation-builders.
          </p>
        </motion.div>



        <hr className="my-16 border-t border-gray-200/80 max-w-4xl mx-auto" />

        {/* SECTION: Standard Daily Camp Schedule (Interactive Click to Expand) */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-nss-red">Camp Life & Routine</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Standard Daily Camp Schedule
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
              Every day at the 7 Day Annual NSS Unit Camp follows a structured, disciplined schedule combining community service, self-reliance, physical fitness, intellectual enrichment, and cultural harmony.
            </p>
          </div>

          <div className="space-y-3">
            {commonDailyRoutine.map((item, index) => {
              const isExpanded = activeRoutineId === item.id;
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:border-nss-blue/50"
                >
                  <button
                    onClick={() => setActiveRoutineId(isExpanded ? null : item.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                      <span className="w-8 h-8 rounded-xl bg-blue-50 text-nss-blue font-black text-xs flex items-center justify-center shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg bg-gray-100 text-gray-600 shrink-0">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 pt-1 border-t border-gray-100 bg-slate-50/40"
                      >
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify font-normal">
                          {item.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>


        </section>

        <hr className="my-16 border-t border-gray-200/80 max-w-4xl mx-auto" />

        {/* SECTION: Annual Special Camp Editions (2026, 2025, 2024 Day-by-Day Documentation) */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-nss-blue">Special Camp Editions</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Annual NSS Unit Camps Overview
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
              Explore the detailed chronological documentation of our 7 Day Annual NSS Unit Camps held across villages in Sehore district.
            </p>

            {/* Year Switcher Buttons */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[
                { year: '2026', village: 'Gram Borkheda' },
                { year: '2025', village: 'Gram Jafarabad' },
                { year: '2024', village: 'Gram Kachnariya' }
              ].map(item => (
                <button
                  key={item.year}
                  onClick={() => setActiveCampYear(item.year as any)}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex flex-col items-center ${
                    activeCampYear === item.year
                      ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>Camp {item.year}</span>
                  <span className={`text-[10px] font-normal ${activeCampYear === item.year ? 'text-gray-300' : 'text-gray-500'}`}>
                    {item.village}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CAMP 2026 REPORT */}
          {activeCampYear === '2026' && (
            <motion.div
              key="camp-2026"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 space-y-10"
            >
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Annual NSS Unit Camp 2026
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  Location: Gram Borkheda, Tehsil Ashta, District Sehore
                </p>
              </div>

              {/* Day-by-Day Breakdown (English Translated) */}
              <div className="space-y-8">
                
                {/* Day 1 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 1: Camp Commencement, Flag Hoisting & Village Exploration
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The 7 Day Annual NSS Unit Camp 2026 commenced with immense enthusiasm and energy. The ceremonial inauguration and traditional flag hoisting ceremony were conducted on the university premises by Honorable Pro Vice Chancellor Dr. T.B. Sridharan and Registrar Mr. K.K. Nair. Following the inaugural ceremony, an awareness rally and vibrant cultural performances were presented by the volunteers, filling the campus with patriotic fervor. In the subsequent phase, the volunteer contingent traveled to the camp site at Government Middle School in Gram Borkheda, Tehsil Ashta, where the residential camp was formally established. All operational activities were smoothly coordinated under the guidance of NSS Faculty Coordinators Dr. Vinod Bhatt, Dr. Dev Brat Gupta, Dr. Geetanjali Giri, and Ms. Deepti Bhojwani.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    A major highlight of the opening day was the extensive Village Exploration (Gram Bhraman), providing volunteers with direct exposure to rural realities. Volunteers toured the entire village to understand local socio-cultural and economic dynamics, interacting with farming families regarding agricultural practices, livestock rearing, rural cottage industries, water conservation, and village education. The volunteers disseminated key information regarding personal hygiene, health awareness, and mutual cooperation, laying a resilient foundation for the forthcoming welfare programs.
                  </p>
                </div>

                {/* Day 2 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 2: Morning Procession, Formal Inauguration, Cyber Security & Cultural Evening
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The second day began with a spirited Prabhat Pheri through the streets of Gram Borkheda, spreading awareness messages with devotional melodies and creating an encouraging community atmosphere. Following the morning rally, the formal inauguration of the camp was held in the gracious presence of University Vice President Mr. Sankar Viswanathan, Pro Vice Chancellor Dr. T.B. Sridharan, Government Middle School Principal Mr. Brijendra Singh Verma, and Gram Sarpanch Smt. Mankunwar Bai. The dignitaries motivated the volunteers towards dedicated service. Honorable Vice President advised villagers on maintaining healthy lifestyle habits, including the regular consumption of warm water for digestive wellness, and exhorted students to pursue their academic studies with rigorous focus and integrity.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    During the intellectual session, Dr. Pushpendra Singh Pateja delivered an insightful lecture on Cyber Security in the modern digital era, highlighting password strength, two-factor authentication, phishing awareness, and safe internet banking for rural users. Later, awareness rallies focusing on women empowerment and civic duties were conducted. The day concluded with sports matches showcasing disciplined teamwork, followed by a theatrical cultural presentation centered on "Shiv-Sati to Shiv-Parvati" that deeply captivated the community.
                  </p>
                </div>

                {/* Day 3 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 3: Free Medical Camp, Cloth Donation Drive, AI in Rural Development & Traditional Games
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Day three opened with physical fitness exercises and an awareness procession focused on preventive healthcare. Subsequently, a comprehensive Free Medical Health Camp was conducted at Gram Borkheda from 10:00 AM to 04:00 PM, providing free health consultations, vitals screening, and essential medicines to over 250 rural patients. Concurrently, volunteers conducted a Cloth Donation Drive, distributing approximately 300 warm and usable clothing items directly to underprivileged families.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    In the intellectual session, Dr. Pritam Suman addressed the potential of Artificial Intelligence (AI) and modern digital technologies in advancing rural economies. He illustrated how AI-driven weather forecasting, soil quality testing, and crop disease diagnosis can significantly bolster agricultural yield. The evening featured energetic traditional NSS games like "Kitne Bhai Kitne", "Ram-Ravana Yudh", and "Rumaal Jhappata", culminating in a powerful theatrical recital of "Krishna’s Final Warning" from the Mahabharata.
                  </p>
                </div>

                {/* Day 4 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 4: Morning Procession, Nature Trekking to Kusmania Hills & Puppet Theatre
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The fourth day commenced with an energetic morning assembly and procession with traditional dholak rhythms and devotional songs. The day’s flagship initiative saw all volunteers embark on a scenic nature trek to the Kusmania mountain ranges near Ashta. Immersing themselves in the pure wilderness, volunteers studied regional flora and fauna, developed team coordination while negotiating rugged terrains, and reaffirmed their commitment to ecological conservation and sustainable living.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    In the evening, a specialized puppet theatre (Kathputli) program was organized at the village square. Folk artists conveyed vital social lessons regarding education, de-addiction, and mutual harmony through captivating storytelling, providing both intellectual enlightenment and wholesome entertainment for volunteers and villagers alike.
                  </p>
                </div>

                {/* Day 5 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 5: Cleanliness Drive, School Teaching, Social Media Awareness Play & Cultural Diversity
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Dedicated to environmental sanitation, volunteers initiated an extensive Cleanliness Campaign (Swachhata Abhiyan) cleaning village streets, public drainage lines, and temple surroundings while engaging door-to-door on the message: "Cleanliness is not merely a habit, but our civic duty." During the day’s educational outreach, Ms. Deepti Bhojwani, Assistant Professor and NSS Program Officer, taught school students using interactive pedagogy and engaging learning aids.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    In the intellectual colloquium, senior volunteers Mr. Rishabh Kabra, Ms. Khushi Desai, and Mr. Ayush Karkare shared their experiences from National and State NSS camps, motivating volunteers on leadership, career vision, and social responsibility. A street play (Nukkad Natak) on social media awareness and digital balance was performed for the youth. The day concluded with a vibrant cultural showcase honoring folk traditions across diverse Indian states, celebrating unity in diversity.
                  </p>
                </div>

                {/* Day 6 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 6: Tree Plantation, Stationery Donation, Child Rights Session & Campfire
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Following the morning Prabhat Pheri, volunteers conducted clean-up and a targeted Tree Plantation Drive across designated open grounds in the village, with residents pledging to nurture the planted saplings. Volunteers also distributed educational stationery kits and books to primary school students to encourage continuous schooling.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The intellectual session focused on "Child Welfare and Human Rights", with guest speakers discussing child protection laws, eradication of child labor, and female education. A powerful street play on Women Empowerment was performed in the village center. As night fell, a grand Campfire was lit where volunteers shared personal transformations, performed folk music, and celebrated lifelong camaraderie.
                  </p>
                </div>

                {/* Day 7 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-nss-blue pl-3">
                    Day 7: Farewell Procession, Valedictory Ceremony & Certificate Distribution
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The concluding day began with a profoundly emotional Prabhat Pheri as village elders, youth, and women bid an affectionate farewell to the volunteers who had become an integral part of their community. In the formal Valedictory Closing Ceremony, Mr. Rahul Singh Parihar, NSS Program Officer and ETI Trainer from Barkatullah University, delivered an inspiring address highlighting that NSS is a potent vehicle for character building and nation service. He encouraged volunteers to uphold discipline, self-preparation, and patriotism to represent the institution at national forums and the prestigious Kartavya Path parade.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Certificates of participation were awarded to all volunteers in recognition of their exemplary dedication. The volunteers expressed heartfelt gratitude to NSS Program Officers Dr. Vinod Bhatt, Dr. Dev Brat Gupta, Dr. Geetanjali Giri, and Ms. Deepti Bhojwani for their steadfast leadership, bringing the transformative 7 Day Annual NSS Unit Camp to a memorable conclusion.
                  </p>
                </div>

              </div>

              {/* Press Release Coverage & Gallery Link */}
              <div className="pt-8 border-t border-gray-100 space-y-6">
                <div>
                  <h4 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Newspaper size={18} className="text-nss-blue" /> Published Media & Press Releases (ANC 2026)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pressReleases2026.map((imgSrc, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedPressImage(imgSrc)}
                        className="bg-white p-2.5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-nss-blue/50 transition-all cursor-pointer group flex items-center justify-center aspect-[3/4] overflow-hidden"
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={imgSrc} 
                            alt="ANC 2026 Press Release" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <span className="p-2 rounded-full bg-white/95 text-slate-900 shadow-sm"><ZoomIn size={18} /></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <div>
                    <h5 className="font-black text-gray-900 text-sm sm:text-base">View Complete Photo Album from ANC 2026</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Explore 72+ high-resolution photos in the dedicated ANC 2026 gallery album.</p>
                  </div>
                  <Link
                    href="/gallery/6a68983ebe9b0736f01570f9"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-nss-blue hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <ImageIcon size={15} /> Visit ANC 2026 Album <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </motion.div>
          )}

          {/* CAMP 2025 REPORT */}
          {activeCampYear === '2025' && (
            <motion.div
              key="camp-2025"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 space-y-10"
            >
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Annual NSS Unit Camp 2025
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  Location: Gram Jafarabad, Tehsil Ashta, District Sehore | Dates: 24th - 30th January 2025
                </p>
              </div>

              {/* Day-by-Day Breakdown (English Translated) */}
              <div className="space-y-8">
                
                {/* Day 1 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 1 (24 Jan 2025): Camp Flag-Off, Cleanliness Drive & Discussion Sessions
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Vice Chancellor Dr. Senthil Kumar Arumugam flagged off the volunteer caravan towards Gram Jafarabad, extending warm wishes for the successful execution of the camp. Upon arriving at the Government Higher School premises, more than 100 student volunteers immediately initiated a thorough cleanliness drive across the school campus and adjoining surroundings. Subsequently, volunteers engaged in structured discussion sessions where responsibilities were distributed and operational committees established. Experienced trainers delivered introductory addresses on leadership, community engagement, and civic discipline. The opening day concluded with an evening cultural program showcasing folk dance, drama, and poetry reflecting rural and contemporary harmony.
                  </p>
                </div>

                {/* Day 2 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 2 (25 Jan 2025): Morning Procession, Official Inauguration & Road Safety Session
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The second day commenced with an early morning Prabhat Pheri through the village, singing devotional hymns and folk tunes to foster community bonding. The formal inauguration of the camp took place with Station House Officer (SHO) of Ashta Tehsil, Mr. Girish Dubey, presiding as the Chief Guest, alongside School Principal Mr. Vijay Singh Jaiswal and Sarpanch Representative Mr. Babulal Verma. During the intellectual colloquium aligned with Madhya Pradesh Road Safety Month, senior traffic officials educated volunteers on traffic regulations, helmet and seatbelt compliance, and defensive driving. Volunteers later conducted an extensive village walk assessing agriculture, water conservation, and livestock practices, finishing the evening with a vibrant Rangoli competition on "Mera Yuva Bharat" and women empowerment.
                  </p>
                </div>

                {/* Day 3 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 3 (26 Jan 2025): 76th Republic Day Celebration, Flag Hoisting & Kusmania Hill Trek
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    On the auspicious occasion of the 76th Republic Day, volunteers commenced the morning with patriotic hymns during the Prabhat Pheri. The unit participated in the ceremonial Flag Hoisting ceremony at the government school, presenting patriotic songs, recitations, and inspiring cultural performances for the assembled villagers and children. In the afternoon, volunteers embarked on an adventurous mountain trek through the scenic Kusmania range in Ashta. Negotiating rugged terrain under the open skies, volunteers strengthened their team spirit, physical resilience, and environmental knowledge regarding regional biodiversity and conservation.
                  </p>
                </div>

                {/* Day 4 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 4 (27 Jan 2025): School Student Mentorship, Free Dental Camp & Traditional Games
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Following an energetic morning awareness march, volunteers devoted the morning to mentoring school students in village classrooms, providing academic guidance, resolving learning difficulties, and donating essential stationery. Concurrently, from 9:00 AM to 1:00 PM, a Free Dental Check-Up Camp was conducted where over 100 rural residents received oral hygiene consultations, scaling, and prescribed medications from expert dentists. In the late afternoon, traditional NSS outdoor games like "Kitne Bhai Kitne", "Ram-Ravana Yudh", and "Rumaal Jhappata" rejuvenated volunteer spirits and reinforced group harmony.
                  </p>
                </div>

                {/* Day 5 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 5 (28 Jan 2025): Swachhata Drive, Women Empowerment Street Play & Leadership Session
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Volunteers undertook an exhaustive village cleanliness drive, clearing waste and educating households on segregation and waste management. In the village center, an impactful street play (Nukkad Natak) on Women Empowerment, girl child education, and domestic violence prevention was performed to widespread praise from local residents. The intellectual session featured national NSS veterans Mr. Ghanashyam Bamaniya and youth officer Mr. Raj Kumar Verma, who guided the volunteers on the ethos of selfless service and civic leadership.
                  </p>
                </div>

                {/* Day 6 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 6 (29 Jan 2025): Morning Rallies, Dignitaries Intellectual Session & Campfire Night
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The sixth day opened with a village march advocating for water conservation and environmental hygiene. In the intellectual session, Dr. Anant Kumar Saxena and Mr. Rahul Singh Parihar (NSS ETI Barkatullah University), alongside university leadership, addressed the volunteers, illuminating the profound impact of NSS discipline on long-term character building. The night culminated in a memorable Campfire ceremony where students gathered around the blazing flames, sharing stories, folk songs, and reflecting on the transformative lessons of the week.
                  </p>
                </div>

                {/* Day 7 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
                    Day 7 (30 Jan 2025): Emotional Farewell, Agricultural Study Tour & Valedictory Ceremony
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The final morning procession was filled with deep emotion as village residents came out to express heartfelt gratitude to the departing volunteers. Volunteers undertook an Agricultural Study Tour through surrounding farms, conversing with local farmers regarding irrigation, crop cycles, and organic farming techniques. The camp formally concluded with a Valedictory Ceremony and certificate distribution honoring outstanding volunteers, cementing memories of selfless community service.
                  </p>
                </div>

              </div>

              {/* Press Release Coverage & Gallery Link */}
              <div className="pt-8 border-t border-gray-100 space-y-6">
                <div>
                  <h4 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Newspaper size={18} className="text-emerald-700" /> Published Media & Press Releases (ANC 2025)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200">
                      <img src="/images/gallery/events_2025/image1.png" alt="2025 Press Release 1" className="w-full h-auto rounded-xl shadow-xs" />
                      <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">Camp Inauguration & Health Camp Media Coverage</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200">
                      <img src="/images/gallery/events_2025/image2.png" alt="2025 Press Release 2" className="w-full h-auto rounded-xl shadow-xs" />
                      <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">Republic Day & Community Service Feature</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div>
                    <h5 className="font-black text-gray-900 text-sm sm:text-base">View Complete Photo Album from ANC 2025</h5>
                  </div>
                  <Link
                    href="/gallery/6a666e30050b5c6502e8421e"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <ImageIcon size={15} /> Visit ANC 2025 Album <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </motion.div>
          )}

          {/* CAMP 2024 REPORT */}
          {activeCampYear === '2024' && (
            <motion.div
              key="camp-2024"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 space-y-10"
            >
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Annual NSS Unit Camp 2024
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  Location: Gram Kachnariya, District Sehore | Concluded: 14th February 2024
                </p>
              </div>

              {/* Day-by-Day Breakdown */}
              <div className="space-y-8">
                
                {/* Day 1 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 1: Commencement, Campus Preparation & Rural Outreach
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Vice Chancellor Dr. Senthil Kumar Arumugam and Secretary Dr. Debasish Adhikari flagged off the caravan towards Gram Kachnariya in Sehore district. Over 55 student volunteers arrived at Kachnariya Middle School, immediately organizing a comprehensive cleanliness drive across the school campus. Detailed discussion sessions were held to formulate schedules and distribute operational responsibilities. Subsequently, volunteers went door-to-door across the village inviting residents to actively participate in the seven-day camp initiatives.
                  </p>
                </div>

                {/* Day 2 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 2: Formal Inauguration, Interactive School Teaching & Substance Abuse Play
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The official inauguration was presided over by Vice Chancellor Dr. Senthil Kumar Arumugam, alongside Government Middle School Principal Vikram Singh Mevada, Village Secretary Ramesh Sen, Dhansingh Makwana, and Narsingh Mevada. In the village school, volunteers introduced innovative teaching aids and interactive games to make learning enjoyable for rural students. An intellectual session on mental health and emotional well-being was organized. Later, volunteers staged a compelling street play (Nukkad Natak) highlighting the grave dangers of drug addiction and substance abuse, inspiring village youth to embrace sobriety.
                  </p>
                </div>

                {/* Day 3 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 3: Yoga Practice, Cleanliness Drive & Women Empowerment Session
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    The morning began with a peaceful awareness walk and an hour-long yoga and physical exercise session promoting personal health and wellness. Volunteers executed a cleanliness campaign across the village roads. During the intellectual session, extensive discussions were held on Women Empowerment and self-reliance, encouraging women to assume leadership in education and local employment. The evening concluded with an enriching cultural program and Sundar Kand recitation exploring spiritual self-reliance and dedicated community service.
                  </p>
                </div>

                {/* Day 4 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 4: Meditation, Village Exploration & Astha Wildlife Range Trek
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Following a morning yoga and mindfulness assembly, volunteers conducted village exploration to study grassroots issues and local livelihoods. Later in the day, the contingent embarked on an invigorating trek towards the Astha Wildlife Range. Immersing in natural beauty, the trek functioned as a revitalizing detox from urban life, improving stamina, mental resilience, and ecological awareness among the participants.
                  </p>
                </div>

                {/* Day 5 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 5: Medical Survey, NSS Ethics Lecture & Brick-Kiln Community Immersion
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    Volunteers conducted a comprehensive medical and sanitation survey across rural households, assessing water quality, sanitation, and primary healthcare access. In the intellectual session, Mr. Ghanashyam Bamaniya delivered an enlightening discourse on the NSS Code of Conduct, integrity, and ethical service. In the afternoon, volunteers visited a local brick-making facility, witnessing the hard labor of kiln workers, gaining profound empathy for rural artisans, and bridging the divide between urban students and rural livelihoods.
                  </p>
                </div>

                {/* Day 6 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 6: Mega Health Camp (250+ Patients), School Lunch & Voting Awareness Play
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    A major free health camp was established at the village panchayat building under the supervision of Dr. R.K. Verma and the medical team from Sehore Sadar Hospital, conducting health checkups for over 250 villagers. Volunteers also distributed toys and nutritious meals to government school children. Later, senior volunteer Ashish Mevada and Dr. Vinod Bhatt guided volunteers on the value of education and public outreach. Volunteers performed a captivating street play advocating for democratic voting rights and civic responsibility ahead of the 2024 general elections.
                  </p>
                </div>

                {/* Day 7 */}
                <div className="space-y-3">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    Day 7: Final Cleanliness Drive, Ceremonial Parade & Valedictory Ceremony
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                    On the final day (February 14, 2024), volunteers executed a final cleanliness drive through village alleys. A ceremonial parade was conducted paying tribute to the National Flag, with Mr. Rahul Singh Parihar taking the salute. The grand closing ceremony featured Registrar Dr. Debasish Adhikari, Assistant Director of Student Welfare Anant Kant Shukla, and guests Rahul Singh Parmar and Ajay Singh. Participation certificates were awarded to all volunteers, concluding a remarkable week of personal growth and transformative rural service.
                  </p>
                </div>

              </div>

              {/* Press Release Coverage & Gallery Link */}
              <div className="pt-8 border-t border-gray-100 space-y-6">
                <div>
                  <h4 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Newspaper size={18} className="text-amber-700" /> Published Media & Press Releases (ANC 2024)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200">
                      <img src="/images/gallery/events_2025/image28.png" alt="2024 Press Release 1" className="w-full h-auto rounded-xl shadow-xs" />
                      <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">Newspaper Coverage - Kachnariya Camp Cleanliness Drive</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200">
                      <img src="/images/gallery/events_2025/image29.png" alt="2024 Press Release 2" className="w-full h-auto rounded-xl shadow-xs" />
                      <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">Health Camp & Valedictory Closing Feature</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <div>
                    <h5 className="font-black text-gray-900 text-sm sm:text-base">View Complete Photo Album from ANC 2024</h5>
                  </div>
                  <Link
                    href="/gallery/6a666e30050b5c6502e8421d"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <ImageIcon size={15} /> Visit ANC 2024 Album <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </motion.div>
          )}

        </section>

      </div>

      {/* Interactive Press Release Lightbox Modal */}
      <AnimatePresence>
        {selectedPressImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPressImage(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-3 flex flex-col"
            >
              <button
                onClick={() => setSelectedPressImage(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer shadow-md"
                title="Close Lightbox"
              >
                <X size={20} />
              </button>
              <div className="overflow-auto max-h-[85vh] p-1 sm:p-2 flex items-center justify-center">
                <img src={selectedPressImage} alt="Press Release Zoom" className="w-full h-auto rounded-xl object-contain mx-auto" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
