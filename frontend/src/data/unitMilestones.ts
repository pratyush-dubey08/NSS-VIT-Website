export interface MilestoneDetail {
  id: string;
  title: string;
  subtitle: string;
  category: 'environment' | 'health' | 'rural' | 'awareness' | 'culture' | 'institutional';
  categoryLabel: string;
  date: string;
  location: string;
  highlightStat: {
    value: string;
    label: string;
  };
  badges: string[];
  motto: string;
  dignitaries?: string[];
  paragraphs: string[];
  customHighlights?: {
    heading: string;
    items: {
      title: string;
      desc: string;
      iconType?: string;
    }[];
  };
  themePillColor?: string;
}

export const UNIT_MILESTONES: MilestoneDetail[] = [
  {
    id: 'mega-tree-plantation-2024',
    title: 'Mega Tree Plantation Drive 2024',
    subtitle: '10,000 Trees in a Single Day — Largest Single-Day Drive in Sehore',
    category: 'environment',
    categoryLabel: 'Environmental Conservation',
    date: '9 August 2024',
    location: 'Sehore District, Madhya Pradesh',
    highlightStat: {
      value: '10,000',
      label: 'Trees Planted in 1 Day'
    },
    badges: ['Largest Drive in Sehore', '1,000 Student Volunteers'],
    motto: '“Go Green, NSS! Go Green, VIT! Go Green, Bharat!”',
    dignitaries: [
      'District Magistrate (DM) of Sehore',
      'Dr. Vinod Bhatt (Programme Officer)',
      'Dr. Devbrat Gupta (Programme Officer)',
      'Dr. Shweta Singh (Programme Officer)'
    ],
    paragraphs: [
      'On 9 August 2024, NSS Unit, VIT Bhopal University, organized a landmark Mega Tree Plantation Drive in Sehore district, Madhya Pradesh, bringing together 1,000 student volunteers for an extraordinary mission of environmental conservation. In a single day, the volunteers planted 10,000 trees, making the initiative a remarkable achievement in large-scale community participation and environmental awareness.',
      'The drive was officially recognized as the largest single-day tree plantation initiative in Sehore district, highlighting the university’s unwavering commitment to sustainability and the transformative power of collective action.',
      'The event witnessed the presence of the District Magistrate (DM) of Sehore, whose visit added immense significance to the initiative and acknowledged the importance of youth-led ecological stewardship. The drive was successfully conducted under the steadfast guidance of NSS Programme Officers Dr. Vinod Bhatt, Dr. Devbrat Gupta, and Dr. Shweta Singh.',
      'Beyond the impressive number of saplings planted, the initiative aimed to cultivate deep environmental responsibility among students, encourage community participation, and inspire individuals to take meaningful action against ecological degradation. Rooted in the NSS motto “Not Me, But You,” the drive reflected the spirit of service, unity, and collective responsibility towards nature and society.'
    ],
    customHighlights: {
      heading: 'Key Drive Highlights',
      items: [
        { title: '1,000 Active Volunteers', desc: 'Mobilized from VIT Bhopal across multiple planting zones in Sehore.' },
        { title: 'District Leadership Presence', desc: 'Inaugurated and commended by the District Magistrate (DM) of Sehore.' },
        { title: 'Post-Plantation Stewardship', desc: 'Focus on long-term watering, geo-tagging, and survival care of planted saplings.' }
      ]
    }
  },
  {
    id: 'convocation-2024-volunteering',
    title: '5th Annual Convocation 2024 Management',
    subtitle: 'Leading a University-Wide Celebration Graced by Hon’ble CM Dr. Mohan Yadav',
    category: 'institutional',
    categoryLabel: 'Institutional Discipline & Protocol',
    date: '4 October 2024',
    location: 'Convocation Dome, VIT Bhopal University',
    highlightStat: {
      value: '200+',
      label: 'NSS Volunteers Deployed'
    },
    badges: ['State Dignitary Protocol', '5 Core Operational Wings'],
    motto: '“Not Me, But You — Professionalism, Leadership & Institutional Trust”',
    dignitaries: [
      'Dr. Mohan Yadav (Hon’ble Chief Minister of Madhya Pradesh)',
      'Dr. G. Viswanathan (Founder & Chancellor, VIT)',
      'University Dignitaries, Trustees & Deans',
      'Dr. Vinod Bhatt (NSS Programme Officer)'
    ],
    paragraphs: [
      'On 4 October 2024, VIT Bhopal University celebrated its prestigious 5th Annual Convocation Ceremony, marking a momentous milestone in the academic journey of the graduating batch of 2025. Behind the flawless execution of this mega event stood the dedicated volunteers of NSS Unit, VIT Bhopal University, who took complete responsibility for managing and executing several mission-critical aspects of the ceremony.',
      'The event commenced at the university’s Convocation Dome with over 1,800 attendees, including graduating students and their families. Approximately 200 NSS volunteers were deployed in synchronized coordination, led by core team leads under the mentorship of Programme Officer Dr. Vinod Bhatt.',
      'The grand ceremony was graced by the Hon’ble Chief Minister of Madhya Pradesh, Dr. Mohan Yadav, and the Chancellor of VIT, Dr. G. Viswanathan, alongside state and university dignitaries. The presence of high-profile VVIPs required supreme discipline, precision coordination, security compliance, and meticulous crowd management.',
      'Preparations commenced well in advance on 30 September 2024 with comprehensive venue briefings, position allocations, on-ground rehearsals, and liaison with university faculty. NSS volunteers successfully managed stage proceedings, VIP movements, degree distributions, food stall logistics, and post-ceremony clearing, establishing NSS as an indispensable pillar of institutional excellence.'
    ],
    customHighlights: {
      heading: '5 Specialized Operational Wings',
      items: [
        { title: '1. Registration Wing', desc: 'Smooth verification and welcome of 1,800+ graduating students and accompanying parents.' },
        { title: '2. Discipline & Security', desc: 'Maintaining impeccable order and ceremonial decorum throughout the Convocation Dome.' },
        { title: '3. Venue & Crowd Management', desc: 'Overseeing seating allocations, acoustic flow, and seamless guest transit across entry points.' },
        { title: '4. Food Stall Coordination', desc: 'Organized catering logistics, lunch token distribution, and refreshment facilitation.' },
        { title: '5. On-Stage & VVIP Coordination', desc: 'Direct protocol support for Chief Minister Dr. Mohan Yadav, Chancellor Dr. G. Viswanathan, and degree conferrals.' }
      ]
    }
  },
  {
    id: 'swachhta-hi-seva-2024',
    title: 'Swachhta Hi Seva Abhiyan 2024',
    subtitle: 'A Fortnight of Cleanliness, Upcycling & Community Awakening (19 Sept – 2 Oct)',
    category: 'awareness',
    categoryLabel: 'Civic Hygiene & Social Action',
    date: '19 September – 2 October 2024',
    location: 'Sehore & VIT Bhopal Campus',
    highlightStat: {
      value: '14 Days',
      label: 'Nationwide Action Campaign'
    },
    badges: ['Culminated on Gandhi Jayanti'],
    motto: '“Cleanliness is Civic Duty — Transforming Daily Habits for a Sustainable Future”',
    paragraphs: [
      'From 19 September to 2 October 2024, NSS Unit, VIT Bhopal University, actively participated in the Swachhta Hi Seva Abhiyan 2024 — a comprehensive multi-day nationwide initiative focused on sanitation, civic awareness, and environmental responsibility across Sehore district and campus.',
      'Rather than limiting the campaign to symbolic clean-up drives, the unit organized a multi-faceted series of educational, creative, and action-oriented activities including poster-making, awareness rallies, debates, essay writing, tree planting, street theatre (Nukkad Natak), and social documentary film-making.',
      'A standout highlight was the Upcycling Workshop held on 29 September 2024 at the Laboratory Complex. The workshop challenged university students to innovatively transform discarded items and waste materials into functional, aesthetic utility products, promoting circular economy principles.',
      'The campaign culminated on 2 October 2024 (Gandhi Jayanti), reinforcing Mahatma Gandhi’s enduring message that cleanliness and dignity of labor are integral components of true nation-building.'
    ],
    customHighlights: {
      heading: 'Campaign Spectrum',
      items: [
        { title: 'Upcycling Workshop (29 Sept)', desc: 'Conducted at Laboratory Complex to foster waste-to-wealth mindset and sustainable living.' },
        { title: 'Nukkad Natak & Street Rallies', desc: 'High-impact performances educating local residents on dry vs. wet waste segregation.' },
        { title: 'Literary & Artistic Contests', desc: 'Debates, essays, and poster contests exploring civic duty and freedom fighters’ values.' }
      ]
    }
  },
  {
    id: 'mega-blood-donation-camps',
    title: 'Mega Blood Donation Initiatives',
    subtitle: '1,500+ Units of Blood Donated to Save Lives and Strengthen Emergency Healthcare',
    category: 'health',
    categoryLabel: 'Healthcare & Life Saving',
    date: 'Ongoing & Annual Mega Drives',
    location: 'VIT Bhopal Health Centre & District Blood Banks',
    highlightStat: {
      value: '1,500+',
      label: 'Blood Units Collected'
    },
    badges: ['1,500+ Units Milestone', 'Red Cross & Govt Blood Bank Partner', 'Life-Saving Humanitarian Service'],
    motto: '“Donate Blood. Share Hope. Help Save Lives — Every Drop Counts, Every Donor Matters.”',
    paragraphs: [
      'NSS Unit, VIT Bhopal University, has been actively contributing to community healthcare through regular blood donation drives that mobilize hundreds of students, faculty, and staff members to donate voluntarily.',
      'The unit has achieved a cumulative milestone of over 1,500+ units of blood collected across organized mega camps and emergency replacement drives, directly benefiting government hospital blood banks, trauma centers, and thalassemia patients across the region.',
      'Each camp is organized in strict adherence to medical standards with experienced phlebotomists and medical teams. NSS volunteers lead donor counselling, pre-donation health screening, nutrition management, and post-donation donor care.',
      'Beyond emergency supply, the camps play a vital educational role by debunking common myths surrounding blood donation and building an enduring culture of voluntary empathy among youth.'
    ],
    customHighlights: {
      heading: 'Impact & Standards',
      items: [
        { title: '1,500+ Cumulative Units', desc: 'Directly replenishing regional blood banks and emergency trauma reserves.' },
        { title: 'Rigorous Medical Screening', desc: 'Comprehensive hemoglobin, BP, and vitals assessment prior to every voluntary donation.' },
        { title: 'Donor Care & Recognition', desc: 'Post-donation nutrition, hydration support, and donor certification for all participants.' }
      ]
    }
  },
  {
    id: 'campus-tree-canopy-5000',
    title: '5,000+ Trees Thriving Inside Campus',
    subtitle: 'Nurturing a Dense, Biodiverse Eco-Canopy Across VIT Bhopal University',
    category: 'environment',
    categoryLabel: 'Environmental Conservation',
    date: 'Ongoing Eco-Sustenance',
    location: 'VIT Bhopal University Campus',
    highlightStat: {
      value: '5,000+',
      label: 'Thriving Campus Trees'
    },
    badges: ['5,000+ Campus Canopy', 'Carbon Offset & Microclimate', 'Biodiversity Sanctuary'],
    motto: '“5,000+ Trees Inside Campus — Growing a Greener Tomorrow”',
    paragraphs: [
      'NSS Unit, VIT Bhopal University, is deeply committed to ecological restoration and long-term environmental sustainability. Through successive phases of targeted plantation drives and sustained maintenance, the campus now proudly shelters more than 5,000 thriving trees.',
      'This green canopy plays an indispensable role in maintaining local ecological balance, reducing heat island effects, enriching topsoil, and supporting diverse avian and insect biodiversity across the campus.',
      'NSS volunteers instill the philosophy that planting a tree is only the first step — regular watering, organic mulching, pruning, and protective fencing are consistently carried out through dedicated volunteer tree-warden batches.'
    ],
    customHighlights: {
      heading: 'Canopy Ecological Benefits',
      items: [
        { title: 'Microclimate Regulation', desc: 'Noticeably cooler ambient campus pathways and enhanced air purification.' },
        { title: 'Biodiversity Corridors', desc: 'Natural shelter and nesting habitats for regional birds, pollinators, and fauna.' },
        { title: 'Student Tree Stewardship', desc: 'Volunteer brigades assigned to monitor sapling growth and seasonal hydration.' }
      ]
    }
  },
  {
    id: 'nss-spotlight',
    title: 'NSS Spotlight Platform',
    subtitle: 'Celebrating Talent, Everyday Kindness & Grassroots Heroes',
    category: 'awareness',
    categoryLabel: 'Volunteer Recognition & Social Storytelling',
    date: 'Weekly Digital Series',
    location: 'Social Media & Campus Community',
    highlightStat: {
      value: '50+',
      label: 'Spotlight Stories Shared'
    },
    badges: ['Everyday Acts of Kindness', 'Volunteer Creativity', 'Social Media Showcase'],
    motto: '“Your Action. Your Story. Your Spotlight.”',
    paragraphs: [
      'NSS Spotlight is a signature initiative created to recognize and celebrate the diverse talents, individuality, and social contributions of NSS volunteers beyond standard duty routines.',
      'The initiative provides an empowering platform for student volunteers to showcase creative skills — from spoken word, singing, poetry, and digital art to cultural performances — while giving equal prominence to quiet, real-life acts of social empathy.',
      'Stories highlighted on Spotlight celebrate everyday heroes: teaching underprivileged children, caring for street animals, eliminating single-use plastic, planting saplings, donating clothes, and appreciating campus security and sanitary workers.',
      'Shared across NSS social media channels through bite-sized videos and written reflections, NSS Spotlight proves that true service is found in continuous everyday choices.'
    ],
    customHighlights: {
      heading: 'Spotlight Story Categories',
      items: [
        { title: 'Artistic & Cultural Expression', desc: 'Showcasing poetry, visual storytelling, and theatrical performances with social themes.' },
        { title: 'Everyday Compassion', desc: 'Celebrating volunteers who teach, rescue stray animals, or care for campus flora.' },
        { title: 'Community Gratitude', desc: 'Documenting heartfelt interactions and support for mess workers, guards, and housekeeping staff.' }
      ]
    }
  },
  {
    id: 'nss-impact-wall',
    title: 'NSS Impact Wall',
    subtitle: 'Weekly Educational Forum: “Know NSS” & “NSS Inspiration”',
    category: 'awareness',
    categoryLabel: 'Historical Heritage & Educational Series',
    date: 'Weekly Alternating Series',
    location: 'Digital Bulletins & Campus Displays',
    highlightStat: {
      value: 'Weekly',
      label: 'Educational Editions'
    },
    badges: ['“Know NSS” Series', '“NSS Inspiration” Series', 'Preserving NSS Legacy'],
    motto: '“Know the Legacy, Learn from Changemakers, Carry Forward ‘Not Me, But You’”',
    paragraphs: [
      'NSS Impact Wall is a weekly institutional initiative designed to educate student volunteers on the rich history, core principles, and iconic changemakers of the National Service Scheme.',
      'The initiative recognizes that genuine volunteerism comes from understanding the deeper philosophy behind the organization rather than treating events as routine checklist items.',
      'The Impact Wall operates on a structured weekly alternating format with two dedicated flagship segments: “Know NSS” and “NSS Inspiration”.'
    ],
    customHighlights: {
      heading: 'Two Alternating Weekly Segments',
      items: [
        {
          title: '1. “Know NSS” Segment',
          desc: 'Unpacking the origin (1969 Gandhi Centenary Year), the Konark Sun Temple chariot wheel logo, the NSS badge, motto “Not Me, But You”, foundational objectives, and institutional evolution.'
        },
        {
          title: '2. “NSS Inspiration” Segment',
          desc: 'Spotlighting inspiring NSS alumni, national awardees, civil servants, and grassroots changemakers whose lives embody selfless service, empathy, and social leadership.'
        }
      ]
    }
  },
  {
    id: 'nukkad-natak-street-theatre',
    title: 'Nukkad Natak — Street Theatre for Social Change',
    subtitle: 'Taking Powerful Social Messages to the Streets Across 4 Core Pillars',
    category: 'awareness',
    categoryLabel: 'Street Theatre & Social Reform',
    date: 'Regular Public Outreach',
    location: 'Public Squares, Bus Stations, Markets & Campus Domes',
    highlightStat: {
      value: '4 Core',
      label: 'Thematic Pillars'
    },
    badges: ['Voting Awareness', 'Women Empowerment', 'Social Media Overuse', 'Cleanliness & Swachhta'],
    motto: '“One Performance. One Powerful Message. A Step Towards Social Change.”',
    paragraphs: [
      'NSS Unit, VIT Bhopal University, uses Nukkad Natak (street theatre) as one of its most potent, high-impact mediums to break taboos, spark civic conscience, and communicate critical social messages directly to the public.',
      'Through energetic drum beats, sharp dialogues, evocative chorus chants, and relatable real-life dramatizations in busy public markets, rural choupals, and campus courtyards, NSS street performers make complex social dilemmas immediately understandable.',
      'Our street plays are purposefully architected around 4 defined thematic pillars, ensuring consistent, structured advocacy that challenges harmful societal status quos and prompts positive behavioral transformation.'
    ],
    customHighlights: {
      heading: '4 Core Thematic Pillars (Focused Direct Advocacy)',
      items: [
        {
          title: '1. Voting Awareness & Democratic Duty',
          desc: 'Highlighting the constitutional power of every single vote, eradicating voter apathy, educating youth on ethical non-partisan voting, and encouraging 100% election turnout.'
        },
        {
          title: '2. Women Empowerment & Gender Equality',
          desc: 'Challenging regressive patriarchal stereotypes, promoting women’s autonomy, safety, higher education, consent, and demanding zero tolerance for workplace and domestic discrimination.'
        },
        {
          title: '3. Overuse of Social Media & Digital Detox',
          desc: 'Depicting the psychological toll of digital addiction, doomscrolling, anxiety, real-world disconnection, and urging youth to cultivate mindful screen habits and authentic human relationships.'
        },
        {
          title: '4. Cleanliness, Waste Segregation & Civic Duty',
          desc: 'Addressing public littering, single-use plastic abuse, open dumping, and inspiring citizens to take personal ownership of clean streets, water bodies, and neighborhoods.'
        }
      ]
    }
  },
  {
    id: 'adopted-10-villages',
    title: 'Adoption of 10 Villages for Holistic Rural Development',
    subtitle: 'Bridging Campus Learning with Grassroots Rural Transformation',
    category: 'rural',
    categoryLabel: 'Grassroots Rural Empowerment',
    date: 'Long-term Adopted Communities',
    location: '10 Rural Villages around Sehore District',
    highlightStat: {
      value: '10',
      label: 'Adopted Villages'
    },
    badges: ['10 Rural Communities', 'Sustained Field Engagement', 'Need-Based Intervention'],
    motto: '“10 Villages. One Shared Responsibility. A Better Tomorrow Through Service.”',
    paragraphs: [
      'The NSS Unit of VIT Bhopal University has extended its social footprint deep into rural Madhya Pradesh through the formal adoption of 10 villages in the surrounding Sehore region.',
      'This signature initiative is built on sustained, continuous engagement rather than superficial one-off visits. Volunteers conduct door-to-door socio-economic surveys, listen to community elders, assess basic infrastructure gaps, and craft customized development programs.',
      'Key focus areas across all 10 adopted villages include rural hygiene, sanitation, primary health camps, school educational enrichment, digital literacy, water conservation awareness, and women’s self-help group motivation.',
      'For university students, direct rural exposure builds empathy, humility, and crisis-solving capabilities, converting classroom theory into meaningful societal contributions.'
    ],
    customHighlights: {
      heading: 'Strategic Pillars of Village Adoption',
      items: [
        { title: 'Grassroots Needs Assessment', desc: 'Structured surveys mapping healthcare access, drinking water quality, and school facilities.' },
        { title: 'Education & Child Development', desc: 'Conducting remedial classes, sports days, and distributing educational kits in village schools.' },
        { title: 'Civic & Hygiene Camps', desc: 'Organizing village sanitation drives, soak pit construction demos, and tree planting with villagers.' }
      ]
    }
  },
  {
    id: 'water-cooler-govt-schools',
    title: 'Installation of Water Coolers in Government Schools',
    subtitle: 'Providing Cold, Purified Drinking Water in Jafrabad & Bor Kheda Villages',
    category: 'rural',
    categoryLabel: 'Rural Infrastructure & Child Care',
    date: 'Recent Community Impact',
    location: 'Govt Schools at Jafrabad & Bor Kheda, Sehore District',
    highlightStat: {
      value: '2 Schools',
      label: 'Govt School Installations'
    },
    badges: ['Jafrabad Village', 'Bor Kheda Village', 'Safe Cold Drinking Water'],
    motto: '“A Simple Necessity. A Meaningful Contribution. A Healthier Learning Environment.”',
    paragraphs: [
      'As part of its concrete rural upliftment agenda, the NSS Unit of VIT Bhopal University funded and facilitated the complete installation of commercial-grade water coolers in government schools across two adopted villages: Jafrabad and Bor Kheda.',
      'In central Madhya Pradesh, scorching summer temperatures often exceed 42°C, causing severe dehydration, heat exhaustion, and diminished attendance among young schoolchildren who lack chilled or purified water at school.',
      'By identifying this critical everyday need and installing sturdy, high-capacity water coolers, NSS directly improved the physical well-being, dignity, and classroom comfort of hundreds of rural children.',
      'This initiative exemplifies the core philosophy of NSS: community service does not always require grandiose speeches — it requires identifying real, tangible pain points and solving them with heart and consistency.'
    ],
    customHighlights: {
      heading: 'Beneficiary School Locations',
      items: [
        {
          title: 'Government School, Jafrabad Village',
          desc: 'High-capacity water cooling system installed to serve all primary and middle school students and teaching staff.'
        },
        {
          title: 'Government School, Bor Kheda Village',
          desc: 'Complete installation with safety earthing and direct filtration, ensuring year-round cold water supply during harsh seasons.'
        }
      ]
    }
  },
  {
    id: 'nasha-mukt-abhiyan',
    title: 'Nasha Mukt Abhiyan — Towards an Addiction-Free Society',
    subtitle: 'Youth-Led Campaign for Substance Abuse Prevention and Mental Well-Being',
    category: 'awareness',
    categoryLabel: 'Substance Abuse Prevention',
    date: 'Annual Campaign & Awareness Cycles',
    location: 'University Campus, Hostels & Neighboring Townships',
    highlightStat: {
      value: 'Zero Tolerance',
      label: 'Against Substance Abuse'
    },
    badges: ['De-addiction Advocacy', 'Youth Mental Health', 'Community Pledge Drives'],
    motto: '“Choose Health. Reject Addiction. Build a Nasha Mukt Bharat.”',
    paragraphs: [
      'The NSS Unit of VIT Bhopal University is firmly committed to safeguarding youth and surrounding communities from the devastating perils of substance abuse through the Nasha Mukt Abhiyan.',
      'Substance addiction inflicts immense damage not only on an individual’s physical and emotional health, but also destroys academic futures, shatters families, and impedes national productivity.',
      'The initiative combines educational seminars, expert medical talks, peer counselling, anti-drug pledges, and street plays to demystify substance abuse, shatter social taboos, and encourage afflicted individuals to seek professional rehabilitation without shame.',
      'By fostering compassionate peer support and open dialogue, NSS empowers youth to make healthy, courageous lifestyle choices and act as active ambassadors for a drug-free India.'
    ],
    customHighlights: {
      heading: 'Action Dimensions',
      items: [
        { title: 'Interactive Peer Sessions', desc: 'Safe spaces for students to discuss mental wellness, peer pressure, and stress management.' },
        { title: 'Community Awareness Pledges', desc: 'Hundreds of students and citizens taking public oaths to stay substance-free.' },
        { title: 'Counselling & Support Referral', desc: 'Connecting vulnerable individuals with medical counsellors and professional rehabilitation resources.' }
      ]
    }
  },
  {
    id: 'national-youth-parliament',
    title: 'National Youth Parliament Leadership Forum',
    subtitle: 'Nurturing Orators, Democratic Discourse and Policy Champions',
    category: 'culture',
    categoryLabel: 'Civic Leadership & Democracy',
    date: 'Annual Parliamentary Cycles',
    location: 'District, State Assembly & National Stages',
    highlightStat: {
      value: 'State Finals',
      label: 'Representation Achieved'
    },
    badges: ['Parliamentary Protocol', 'Viksit Bharat Discourse', 'Public Policy Debate'],
    motto: '“Young Voices. Informed Minds. A Stronger Democracy.”',
    paragraphs: [
      'The National Youth Parliament initiative provides a high-caliber platform for NSS volunteers to immerse themselves in parliamentary debate, constitutional law, public policy analysis, and nation-building discourse.',
      'Rather than remaining passive observers of democratic governance, student participants research intricate national challenges — such as electoral reforms, economic equity, and environmental legislation — and debate them with legislative decorum and intellectual rigor.',
      'NSS VIT Bhopal volunteers have consistently demonstrated commanding eloquence, advancing through competitive district and nodal rounds to represent their region at the Madhya Pradesh State Legislative Assembly and national forums.',
      'The initiative sharpens public speaking, critical research, persuasive argumentation, and statesmanship, equipping the next generation to be visionary leaders of the world’s largest democracy.'
    ],
    customHighlights: {
      heading: 'Core Competency Building',
      items: [
        { title: 'Parliamentary Procedures', desc: 'Hands-on practice of bills, motions, question hours, and formal parliamentary etiquette.' },
        { title: 'Evidence-Based Oratory', desc: 'Training volunteers to articulate data-backed arguments on pressing national issues.' },
        { title: 'State Assembly Representation', desc: 'Consistent qualification of VIT Bhopal NSS delegates to state-level parliamentary sessions.' }
      ]
    }
  },
  {
    id: 'vibgyor-2025',
    title: 'VIBGYOR 2025 — Cultural Induction Through Diversity',
    subtitle: 'Welcoming Freshers with the Vibrant Cultural Tapestry of Seven Indian States',
    category: 'culture',
    categoryLabel: 'Cultural Diversity & Induction',
    date: '2025 Academic Induction',
    location: 'VIT Bhopal University Auditorium',
    highlightStat: {
      value: '7 States',
      label: 'Cultural Traditions Celebrated'
    },
    badges: ['7 Indian States', 'Freshers Welcoming', 'Unity in Diversity'],
    motto: '“Seven States. Diverse Traditions. One Vibrant Celebration.”',
    paragraphs: [
      'VIBGYOR 2025 established a vibrant new cultural induction tradition for NSS VIT Bhopal, designed to introduce incoming first-year students to the spirit and camaraderie of NSS through high-energy music, dance, folk arts, and creative expression.',
      'Departing from conventional dry orientations, VIBGYOR demonstrated that volunteerism in NSS is not solely about social service — it is equally about teamwork, emotional intelligence, cultural expression, and lifelong friendships.',
      'The central concept of VIBGYOR 2025 revolved around celebrating the immense regional richness of India through the distinct cultural identities of seven diverse Indian states. Each colour of the spectrum represented a unique state, highlighting folk dances, music, traditional costumes, and local customs on one unified stage.'
    ],
    customHighlights: {
      heading: 'Induction Highlights',
      items: [
        { title: '7 States Cultural Showcase', desc: 'Performances reflecting the folk heritage, rhythmic music, and attire of diverse regions.' },
        { title: 'Peer-to-Peer Mentorship', desc: 'Interactive ice-breaking between senior NSS leads and freshers to share volunteering opportunities.' },
        { title: 'Creative Volunteer Recruitment', desc: 'Inspiring hundreds of freshers to join NSS wings through dynamic stage storytelling.' }
      ]
    }
  },
  {
    id: 'vibgyor-2026',
    title: 'VIBGYOR 2026 — Ancient Wisdom & Modern Struggles',
    subtitle: 'Ancient Stories. Modern Questions. Timeless Answers.',
    category: 'culture',
    categoryLabel: 'Philosophical Theatre & Social Dialogue',
    date: '2026 Grand Cultural Showcase',
    location: 'VIT Bhopal University Auditorium',
    highlightStat: {
      value: '7 Epics',
      label: 'Thematic Productions'
    },
    badges: ['Mythology Meets Modernity'],
    motto: '“Ancient Stories. Modern Struggles. Timeless Lessons.”',
    paragraphs: [
      'Building upon the foundation of 2025, VIBGYOR 2026 elevated NSS cultural performances into an intellectual and emotional tour de force by connecting ancient Indian epics with the most pressing dilemmas faced by modern youth.',
      'Rather than treating mythology and contemporary life as separate entities, VIBGYOR 2026 used iconic archetypes from Indian literature as artistic allegories to explore mental health, cyber harassment, performance anxiety, and social conditioning.',
      'Through scripting, original choreography, theatrical acting, and evocative lighting, each segment delivered a profound social commentary that sparked deep introspection among the audience.'
    ],
    customHighlights: {
      heading: '7 Interconnected Thematic Productions',
      items: [
        {
          title: '1. SHAKTI (Parvati to Kali)',
          desc: 'Women’s empowerment, innate resilience, bodily autonomy, and the courage to confront oppression.'
        },
        {
          title: '2. PRASHNA (Inspired by Draupadi)',
          desc: 'Justice, questioning institutional complicity, breaking silence against harassment, and demanding accountability.'
        },
        {
          title: '3. SANGHARSH (Inspired by Arjuna)',
          desc: 'Addressing mental health, debilitating anxiety, inner doubt, and overcoming paralyzing expectations.'
        },
        {
          title: '4. ABHIMANYU (The Chakravyuha of Youth)',
          desc: 'The suffocating burden of academic and peer expectations, isolation, and the vital need for emotional support systems.'
        },
        {
          title: '5. MANTHAN (Samudra Manthan in Digital Age)',
          desc: 'Examining digital technology, algorithmic addiction, viral misinformation, and ethical responsibility in the social media era.'
        },
        {
          title: '6. VASUKI (The Churning of Self-Worth)',
          desc: 'Exploring systemic exploitation, modern corporate/academic burnout, toxic people-pleasing, and recovering self-worth.'
        },
        {
          title: '7. TANDAVA (Shiva’s Cosmic Dissolution)',
          desc: 'Dismantling toxic societal dogmas, questioning prejudices, and destroying harmful conventions to create a just order.'
        }
      ]
    }
  },
  {
    id: 'free-health-checkup-camps',
    title: 'Free Health Check-Up Camps (Eye & Dental Mega Camps)',
    subtitle: 'Preventive Healthcare Outreach with Over 2,600+ Beneficiaries Consulted',
    category: 'health',
    categoryLabel: 'Preventive Healthcare Outreach',
    date: '5 August 2024 & Annual 2025 Drive',
    location: 'VIT Bhopal University Health Facilities & Outreach Desks',
    highlightStat: {
      value: '2,600+',
      label: 'Total Free Consultations'
    },
    badges: ['1,100 Eye Camp Regs (2024)', '1,500 Check-ups in 1 Day (2025)', 'Specialist Doctors & Diagnostics'],
    motto: '“Healthy Communities Begin with Awareness, Prevention and Care.”',
    paragraphs: [
      'The NSS Unit of VIT Bhopal University has consistently championed community healthcare through massive, professionally staffed free health check-up camps, bringing specialized diagnostic consultations directly to students, staff, and regional residents.',
      'On 5 August 2024, the unit conducted the Free Eye Check-Up Camp, recognizing the critical importance of vision wellness in modern digital learning. The initiative received overwhelming public response with 1,100 online registrations, providing comprehensive refraction, vision testing, and specialist ophthalmological advice.',
      'Continuing this healthcare mission, the Free Health Check-Up Camp 2025 expanded into a mega multidisciplinary drive focused on both dental and optical health. Operating with exceptional organizational precision, the camp recorded an astonishing 1,500 patient check-ups in a single day.',
      'These camps actively prevent neglected medical conditions from escalating into chronic disabilities while giving NSS volunteers invaluable hands-on experience in public healthcare logistics, triage coordination, and patient care.'
    ],
    customHighlights: {
      heading: 'Two Landmark Healthcare Editions',
      items: [
        {
          title: 'Free Eye Check-Up Camp (5 August 2024)',
          desc: '1,100 online registrations, comprehensive vision screening, refractive assessment, and prescription guidance.'
        },
        {
          title: 'Free Health Check-Up Camp 2025 (Dental & Eye)',
          desc: '1,500 medical check-ups in a single day, offering oral diagnostics, dental scaling advice, and vision evaluations.'
        }
      ]
    }
  }
];
