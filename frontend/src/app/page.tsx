import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import AboutPreview from '@/components/AboutPreview';
import UpcomingActivities from '@/components/UpcomingActivities';

export default function Home() {
 return (
 <>
 <Hero />
 <Stats />
 <AboutPreview />
 <UpcomingActivities />
 
 {/* 
 More sections will be added here such as:
 - Recent Activities
 - Featured Initiatives
 - CTA Section 
 */}
 </>
 );
}
