'use client';

import { motion } from 'framer-motion';
import { Mail, BookOpen, Award, Users } from 'lucide-react';

// --- Types ---
interface Leader {
  name: string;
  designation: string;
  institution: string;
  tier: number;
}

interface ProgramOfficer {
  name: string;
  designation: string;
  bio: string;
}

// --- Data ---
const leadershipData: Leader[] = [
  { name: 'Dr. G. Viswanathan', designation: 'Founder & Chancellor', institution: 'VIT Bhopal University, India', tier: 1 },
  
  { name: 'Dr. Sankar Viswanathan', designation: 'Vice President', institution: 'VIT Bhopal, India', tier: 2 },
  { name: 'Ms. Kadhambari S. Viswanathan', designation: 'Assistant Vice President', institution: 'VIT Bhopal, India', tier: 2 },
  { name: 'Mrs. Ramni Balasundaram', designation: 'Trustee', institution: 'VIT Bhopal, India', tier: 2 },
  
  { name: 'Prof. Satish Kumar Modh', designation: 'Vice-Chancellor', institution: 'VIT Bhopal University, India', tier: 3 },
  { name: 'Prof. T. B. Sridharan', designation: 'Pro-Vice Chancellor', institution: 'VIT Bhopal University, India', tier: 3 },
  { name: 'Dr. Gyan Prakash Mishra', designation: 'Registrar', institution: 'VIT Bhopal University, India', tier: 3 },
];

const programOfficersData: ProgramOfficer[] = [
  {
    name: 'Dr. Vinod Bhatt',
    designation: 'Program Officer',
    bio: 'Dr. Vinod Bhatt is an accomplished scholar, researcher, and writer specializing in English Literature and Journalism. He has had 22 years of teaching and administrative experience, for which he has been the main force in fusing literature and mass communication to create unique pedagogic strategies. An Associate Professor in VIT Bhopal University, he personally guides students and research scholars. He holds a Ph.D. in Canadian Literature. Dr. Bhatt is a registered Ph.D. guide and has supervised numerous research scholars. He has published 42 research papers, with nine appearing in Scopus-indexed journals. His academic engagements include participation in over 48 conferences, and he serves as an editor and reviewer for four international journals. He has also chaired conferences at prestigious institutions such as Amity University Dubai and Singapore. In recognition of his contributions, he was honored with the IWA Bogdani Prize (Belgium) in 2023.'
  },
  {
    name: 'Dr. Devbrat Gupta',
    designation: 'Program Officer',
    bio: 'Dr. Dev Brat Gupta is MA and M.Phil. in English Literature and Ph.D. in ELT from Vikram University, Ujjain. Having 16 years of experience in teaching and administration and 12 years of experience in research, he has worked at all levels of academics such as Academic Head and HoD. Presently at VIT Bhopal University, he has authored five research papers, presented 12 national and international conferences, and attended several workshops, seminars, and FDPs. Moreover, he is a member, editor, and reviewer of five international peer-reviewed journals. Dr. Devbrat has also given expert talks on communication skills, professional communication, and soft skills in engineering colleges and universities in India.'
  },
  {
    name: 'Dr. Geetanjali Giri',
    designation: 'Program Officer',
    bio: 'Dr. Geetanjali Giri is a Doctorate from Indian Institute of Science, Bengaluru and Master of Science in Physics from Banaras Hindu University. Along With 3 years of Postdoctoral experience from Institut Laue-Langevein, Grenoble France, she is an experienced computational quantum scientist with a strong background in high-performance computing (HPC) simulations, data analysis, and solid-state chemistry. With 75 citations she has published 5 papers in internationally reputed journals with high impact factors. She has been awarded best oral presentation in International symposium and has been Department of Science and Technology INSPIRE awardee from 2007-2019. Moreover, she is passionate about innovation and pushing the boundaries of quantum science in the research industry.'
  },
  {
    name: 'Dr. Dipti Bhojwani',
    designation: 'Program Officer',
    bio: 'Dr. Dipti Bhojwani is a dedicated Program Officer at VIT Bhopal University. (Full biographical information will be updated shortly).'
  }
];

// --- Components ---

const LeaderCard = ({ leader, delay }: { leader: Leader, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 w-full max-w-sm mx-auto"
  >
    <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl border-2 border-white shadow-inner">
      {/* Placeholder for Photo - Initials */}
      {leader.name.split(' ').map(n => n[0]).join('').substring(0, 2).replace('.', '')}
    </div>
    <div>
      <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-1">{leader.name}</h3>
      <p className="text-nss-red font-semibold text-sm mb-1">{leader.designation}</p>
      <p className="text-gray-500 text-xs">{leader.institution}</p>
    </div>
  </motion.div>
);

const ProgramOfficerCard = ({ officer, index }: { officer: ProgramOfficer, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row group"
  >
    {/* Photo Placeholder Area */}
    <div className="md:w-1/3 bg-slate-50 border-r border-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
      
      <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 border-8 border-white shadow-lg flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
         <span className="text-gray-400 font-bold text-3xl">
           {officer.name.split(' ').map(n => n[0]).join('').substring(0, 2).replace('.', '')}
         </span>
      </div>
      
      <div className="mt-6 text-center relative z-10">
        <h3 className="text-2xl font-black text-gray-900 mb-1">{officer.name}</h3>
        <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-nss-blue rounded-full text-xs font-bold uppercase tracking-wider">
          {officer.designation}
        </span>
      </div>
    </div>
    
    {/* Bio Area */}
    <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center relative">
      <div className="absolute top-8 right-8 text-gray-100 opacity-50">
        <BookOpen size={100} strokeWidth={1} />
      </div>
      
      <h4 className="text-xl font-bold text-gray-900 mb-4 relative z-10 flex items-center gap-2">
        <Award className="text-nss-red" size={24} /> About {officer.name}
      </h4>
      <p className="text-gray-600 leading-relaxed relative z-10 text-justify">
        {officer.bio}
      </p>
    </div>
  </motion.div>
);

export default function TeamPage() {
  const tier1 = leadershipData.filter(l => l.tier === 1);
  const tier2 = leadershipData.filter(l => l.tier === 2);
  const tier3 = leadershipData.filter(l => l.tier === 3);

  return (
    <div className="min-h-screen pt-24 bg-[#FAFAFA] pb-32 selection:bg-nss-blue selection:text-white">
      
      {/* Header Section */}
      <section className="py-16 md:py-24 text-center container mx-auto px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue to-blue-600">Leadership</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium">
            Meet the visionaries, dedicated officers, and coordinators who guide and lead the NSS Unit at VIT Bhopal University.
          </p>
        </motion.div>
      </section>

      {/* College Leadership Section */}
      <section className="container mx-auto px-4 mb-32 relative">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          
          {/* Tier 1 */}
          <div className="flex justify-center">
            {tier1.map((leader, idx) => (
              <LeaderCard key={idx} leader={leader} delay={0.1} />
            ))}
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
            {tier2.map((leader, idx) => (
              <LeaderCard key={idx} leader={leader} delay={0.2 + (idx * 0.1)} />
            ))}
          </div>

          {/* Tier 3 */}
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
            {tier3.map((leader, idx) => (
              <LeaderCard key={idx} leader={leader} delay={0.5 + (idx * 0.1)} />
            ))}
          </div>

        </div>
      </section>

      {/* Program Officers Section */}
      <section className="container mx-auto px-4 mb-32 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Program <span className="text-nss-red">Officers</span>
          </motion.h2>
          <p className="text-lg text-slate-600">The guiding force behind our community service initiatives.</p>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-12">
          {programOfficersData.map((officer, idx) => (
            <ProgramOfficerCard key={idx} officer={officer} index={idx} />
          ))}
        </div>
      </section>

    </div>
  );
}
