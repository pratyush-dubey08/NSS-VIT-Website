export interface IAlumnus {
  name: string;
  batch: string;
  status: 'Placed' | 'Higher Studies';
  company?: string;
  designation?: string;
  linkedin?: string;
  portfolio?: string;
  photoUrl: string;
  city: string;
  state?: string;
  mapHub: 'noida' | 'bengaluru' | 'pune' | 'bhopal' | 'dubai';
  message: string;
  cherished?: string;
}

export const alumniData: IAlumnus[] = [
  // 2021 Batch
  {
    name: "Rishabh Kabra",
    batch: "2021",
    status: "Placed",
    company: "SD Biosensors",
    designation: "Business Analyst",
    city: "Noida / Delhi-NCR",
    state: "Uttar Pradesh",
    mapHub: "noida",
    linkedin: "https://www.linkedin.com/in/kabrarishabh/",
    photoUrl: "/images/alumni/rishabh-kabra.webp",
    message: "Breathtaking, Worth every moment",
    cherished: "People"
  },
  {
    name: "Mukesh Kumar Ghosh",
    batch: "2021",
    status: "Higher Studies",
    company: "MS Ramaiah University of Applied Sciences",
    designation: "M.Tech in AIML",
    city: "Bengaluru",
    state: "Karnataka",
    mapHub: "bengaluru",
    linkedin: "https://www.linkedin.com/in/mukesh-kumar-ghosh-5835b7220",
    photoUrl: "/images/alumni/mukesh-kumar-ghosh.webp",
    message: "Through various community service activities, I learned the importance of empathy, teamwork, leadership, and social responsibility. The 240+ hours of service and earning the NSS 'B' Certificate strengthened my confidence, communication, and problem-solving skills while instilling a strong sense of discipline and commitment. These experiences have not only shaped me into a more responsible individual but have also played a significant role in my professional journey.",
    cherished: "Working with diverse communities taught me empathy, humility, and the true value of giving back to society. Every activity reinforced the belief that even small efforts can create a lasting impact."
  },
  {
    name: "Shreya Gupta",
    batch: "2021",
    status: "Placed",
    company: "FIREAI",
    designation: "AI Business Analyst",
    city: "Delhi-NCR",
    state: "Delhi NCR",
    mapHub: "noida",
    linkedin: "",
    photoUrl: "/images/alumni/shreya-gupta.webp",
    message: "Being part of the NSS Unit at VIT Bhopal was truly transformative for me. Participating in the district-level NSS camp and conducting medical survey camps as part of community outreach gave me a deeper sense of empathy and social responsibility. It taught me how to work with diverse groups of people, communicate effectively, and take ownership of tasks in real, on-ground situations — skills that have stayed with me well beyond the camp.",
    cherished: "The one thing I cherished most was the sense of genuine human connection I built during the medical survey camps. Meeting people from different backgrounds, listening to their concerns, and being able to contribute — even in a small way — to their well-being gave me a perspective that no classroom or workplace could offer."
  },

  // 2022 Batch
  {
    name: "Nitank Dasondi",
    batch: "2022",
    status: "Placed",
    company: "Novome Technologies",
    designation: "Business Analyst",
    city: "Noida",
    state: "Uttar Pradesh",
    mapHub: "noida",
    linkedin: "https://www.linkedin.com/in/nitank-dasondi-20b246203",
    photoUrl: "/images/alumni/nitank-dasondi.webp",
    message: "The NSS Unit at VIT Bhopal University has been one of the most influential experiences in shaping my personality and professional outlook. It taught me that leadership is not about holding a position but about taking responsibility, serving others, and inspiring people through actions. From coordinating the Mega Plantation Drive, earning the NSS 'B' Certificate, leading district-level NSS initiatives, and leading the Discipline Team for Advitya Fest, every experience strengthened my leadership, communication, teamwork, and decision-making skills.",
    cherished: "When I first joined NSS, I hardly knew anyone. But somewhere between working together, sharing responsibilities, and helping others, those strangers became some of my closest friends. We joined NSS to serve society, but in the process, NSS transformed us."
  },
  {
    name: "Ayush Saxena",
    batch: "2022",
    status: "Placed",
    company: "Novome Technologies",
    designation: "Data Operation Analyst",
    city: "Bengaluru",
    state: "Karnataka",
    mapHub: "bengaluru",
    linkedin: "https://www.linkedin.com/in/ayush-saxena-74732b2a7",
    photoUrl: "/images/alumni/ayush-saxena.webp",
    message: "To be honest, my time with the NSS unit at VIT Bhopal completely changed how I see things. Working on ground-level community projects and leading that massive tree plantation drive wasn't just about ticking off volunteer hours; it honestly taught me how to actually listen, stay calm when things go sideways, and manage large teams under pressure. Professionally, pulling off these large-scale events gave me the kind of real-world leadership and execution experience that classrooms just can't teach.",
    cherished: "Honestly, the absolute best part of my NSS journey wasn't just the work we did, but the incredible family I found through it especially during our 7-day residential camp. Working shoulder to shoulder day and night for a social cause turned a massive campus into a place that truly felt like home."
  },
  {
    name: "Ayush Raj",
    batch: "2022",
    status: "Placed",
    company: "Airbus",
    designation: "Full Stack Developer",
    city: "Bengaluru",
    state: "Karnataka",
    mapHub: "bengaluru",
    linkedin: "https://www.linkedin.com/in/ayushrajspeaks",
    photoUrl: "/images/alumni/ayush-raj.webp",
    message: "NSS transformed my perspective, proving that true personal growth stems from selfless service. It instilled in me the discipline, empathy, and leadership required to drive meaningful change. Working at the grassroots level revealed the unmatched power of collective community action. The ethos of 'Not Me But You' remains the unwavering compass that guides my journey.",
    cherished: "The one thing I cherished most was the profound sense of belonging we built; through shared challenges and selfless service, a group of dedicated volunteers quickly turned into friends, and eventually into a family."
  },
  {
    name: "Omanshi Kaushal",
    batch: "2022",
    status: "Placed",
    company: "Airbus",
    designation: "Software Developer",
    city: "Bengaluru",
    state: "Karnataka",
    mapHub: "bengaluru",
    linkedin: "https://www.linkedin.com/in/omanshi-kaushal-42532924b/",
    portfolio: "https://portfolio-website-omanshi.vercel.app/",
    photoUrl: "/images/alumni/omanshi-kaushal.webp",
    message: "The NSS Unit, VIT Bhopal University, has been one of the most defining parts of my university journey. It gave me opportunities to lead impactful community initiatives, work with diverse teams, and develop confidence, empathy, and responsibility. The experiences I gained through NSS not only shaped me into a better individual but also strengthened my leadership, communication, and organizational skills, which continue to support my personal growth and professional aspirations.",
    cherished: "What I cherished most about NSS was how it gave everyone a platform to shine. Every voice was heard, every opinion mattered, and every talent was celebrated. Somewhere along the way, we became more than just a college community, we became a family, a home away from home that I'll always cherish."
  },
  {
    name: "Harshit Parwal",
    batch: "2022",
    status: "Higher Studies",
    company: "University of Birmingham Dubai",
    designation: "Master's student",
    city: "Dubai",
    state: "United Arab Emirates",
    mapHub: "dubai",
    linkedin: "https://www.linkedin.com/in/harshit-parwal-417566251",
    photoUrl: "/images/alumni/harshit-parwal.webp",
    message: "The unit significantly influenced various facets of my life, from aiding those in need to empowering me to maximize my potential, enabling me to find the right direction and gain the courage to forge my own path.",
    cherished: "The ability to be at ground zero where you realise how far you are able to push yourself and being able to lead the best projects with my mentors i look up to. To have 1 day at the camp as equal to everyone else again."
  },
  {
    name: "Tanishk Agarwal",
    batch: "2022",
    status: "Placed",
    company: "LTIMINDTREE",
    designation: "SDE",
    city: "Pune / Mumbai",
    state: "Maharashtra",
    mapHub: "pune",
    linkedin: "",
    photoUrl: "/images/alumni/tanishk-agarwal.webp",
    message: "Being a part of the NSS Unit at VIT Bhopal University has been a truly enriching experience. It taught me the importance of teamwork, leadership, and social responsibility through community service activities. Volunteering in various initiatives helped me build confidence, improve my communication skills, and develop empathy toward society.",
    cherished: "The one thing I cherished most as an NSS volunteer was the opportunity to make a meaningful impact on people's lives through service. Seeing the positive difference our efforts made gave me a deep sense of purpose."
  },
  {
    name: "Sudarshan Chandravanshi",
    batch: "2022",
    status: "Higher Studies",
    company: "VIT Bhopal University",
    designation: "Research Scholar",
    city: "Bhopal",
    state: "Madhya Pradesh",
    mapHub: "bhopal",
    linkedin: "https://www.linkedin.com/in/sudarshan-chandravanshi-7b6765251",
    photoUrl: "/images/alumni/sudarshan-chandravanshi.webp",
    message: "The National Service Scheme (NSS) has played a significant role in shaping my personality and outlook on life. Through NSS, I learned the importance of selfless service, teamwork, discipline, and social responsibility. Participating in various community service activities helped me understand the challenges faced by society and inspired me to contribute to the welfare of others. NSS also improved my leadership, communication, and problem-solving skills.",
    cherished: "I am proud to be an NSS volunteer, and I will always cherish the lessons and memories it has given me."
  },
  {
    name: "Ambika Sharma",
    batch: "2022",
    status: "Higher Studies",
    company: "Postgraduate Studies",
    designation: "Master's Scholar",
    city: "Bhopal / Jaipur",
    state: "Madhya Pradesh",
    mapHub: "bhopal",
    linkedin: "",
    photoUrl: "/images/alumni/ambika-sharma.webp",
    message: "NSS gave me valuable experiences, helped me become more disciplined and responsible, and improved my teamwork and communication skills.",
    cherished: "The memories I made with my friends while working together and serving the community are what I cherish the most."
  }
];
