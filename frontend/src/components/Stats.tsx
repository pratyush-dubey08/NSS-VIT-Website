'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Leaf, Droplet, Tent } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, delay, link, showPlus = true }: any) => {
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

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bg-white shadow-xl shadow-gray-200/50 border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full ${link ? 'cursor-pointer hover:border-blue-200' : ''}`}
    >
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 md:mb-6 text-nss-blue shadow-sm border border-blue-100 transition-colors duration-300 group-hover:bg-blue-100">
        <Icon size={28} className="md:w-8 md:h-8"/>
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-nss-blue transition-colors">
        {count.toLocaleString()}{showPlus && '+'}
      </h3>
      <p className="text-gray-700 font-bold uppercase tracking-wider text-xs md:text-sm group-hover:text-blue-700 transition-colors">{title}</p>
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
    <section className="py-24 bg-gradient-to-b from-gray-100 to-white relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto">
          <StatCard title="Activities Conducted" value="120" icon={Calendar} delay={0.1} link="/activities" />
          <StatCard title="Active Volunteers" value="200" icon={Users} delay={0.2} />
          <StatCard title="Trees Planted" value="15000" icon={Leaf} delay={0.3} link="/initiatives/tree-plantation" />
          <StatCard title="Blood Units" value="2000" icon={Droplet} delay={0.4} link="/initiatives/blood-donation" />
          <StatCard title="Annual Camps" value="3" icon={Tent} delay={0.5} link="/initiatives/annual-camp" showPlus={false} />
        </div>
      </div>
    </section>
  );
}
