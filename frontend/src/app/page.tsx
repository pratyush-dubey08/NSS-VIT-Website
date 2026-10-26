import Hero from '@/components/Hero';
import LiveRegistrationBanner from '@/components/LiveRegistrationBanner';
import Stats from '@/components/Stats';
import AboutPreview from '@/components/AboutPreview';
import UpcomingActivities from '@/components/UpcomingActivities';
import VideoShowcase from '@/components/VideoShowcase';

export default function Home() {
  return (
    <>
      <Hero />
      <LiveRegistrationBanner />
      <Stats />
      <AboutPreview />
      <UpcomingActivities />
      <VideoShowcase />
    </>
  );
}
