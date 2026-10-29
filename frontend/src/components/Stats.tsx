'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Leaf, Droplet, Tent } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  delay: number;
  link?: string;
  showPlus?: boolean;
  accent: 'blue' | 'red' | 'navy';
}

const StatCard = ({ title, value, icon: Icon, delay, link, showPlus = true, accent }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/,/g, ''));
    if (start === end) return;

    let totalDuration = 2000;
    let incrementTime = (totalDuration / end) * 2;

    let timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  const accentStyles = {
    blue: {
      borderTop: 'border-t-4 border-blue-600',
      iconBox: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600',
      label: 'text-blue-950 group-hover:text-blue-700',
      glowHover: 'group-hover:shadow-blue-500/15 group-hover:border-blue-300'
    },
    red: {
      borderTop: 'border-t-4 border-nss-red',
      iconBox: 'bg-red-50 text-nss-red border-red-200 group-hover:bg-nss-red group-hover:text-white group-hover:border-nss-red',
      label: 'text-red-950 group-hover:text-nss-red',
      glowHover: 'group-hover:shadow-red-500/15 group-hover:border-red-300'
    },
    navy: {
      borderTop: 'border-t-4 border-nss-blue',
      iconBox: 'bg-slate-100 text-nss-blue border-slate-200 group-hover:bg-nss-blue group-hover:text-white group-hover:border-nss-blue',
      label: 'text-slate-900 group-hover:text-nss-blue',
      glowHover: 'group-hover:shadow-blue-950/20 group-hover:border-slate-400'
    }
  }[accent];

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bg-white/95 backdrop-blur-md shadow-lg shadow-slate-900/5 border border-slate-200/90 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full ${accentStyles.borderTop} ${accentStyles.glowHover} ${link ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xs border transition-all duration-300 ${accentStyles.iconBox}`}>
        <Icon size={28} className="md:w-8 md:h-8 transition-transform group-hover:scale-110"/>
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-nss-blue transition-colors">
        {count.toLocaleString()}{showPlus && '+'}
      </h3>
      <p className={`font-extrabold uppercase tracking-wider text-xs md:text-sm transition-colors ${accentStyles.label}`}>
        {title}
      </p>
    </motion.div>
  );

  if (link) {
    return (
      <Link href={link} className="block h-full group">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default function Stats() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-slate-100/90 via-white to-red-50/20 relative overflow-hidden">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -z-10 select-none">
        <img src="/images/nss-logo.webp" alt="" className="w-96 h-96 object-contain" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto">
          <StatCard title="Activities Conducted" value="120" icon={Calendar} delay={0.1} link="/activities" accent="navy" />
          <StatCard title="Active Volunteers" value="200" icon={Users} delay={0.2} link="/volunteers" accent="red" />
          <StatCard title="Trees Planted" value="15000" icon={Leaf} delay={0.3} link="/initiatives/tree-plantation" accent="blue" />
          <StatCard title="Blood Units" value="2000" icon={Droplet} delay={0.4} link="/initiatives/blood-donation" accent="red" />
          <StatCard title="Annual Camps" value="3" icon={Tent} delay={0.5} link="/initiatives/annual-camp" showPlus={false} accent="navy" />
        </div>
      </div>
    </section>
  );
}
