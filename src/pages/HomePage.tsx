
import { Hero } from '../components/Hero';
import { ShowreelVideo } from '../components/ShowreelVideo';
import { Services } from '../components/Services';
import { Portfolio } from '../components/Portfolio';
import { Clients } from '../components/Clients';
import { Team } from '../components/Team';
import { Testimonials } from '../components/Testimonials';
import { CTASection } from '../components/CTASection';

interface HomePageProps {
  onOpenContact: () => void;
}

export function HomePage({ onOpenContact }: HomePageProps) {
  return (
    <>
      <Hero />
      <ShowreelVideo />
      <Services />
      <Portfolio />
      <Clients />
      <Team />
      <Testimonials />
      <CTASection onOpenContact={onOpenContact} />
    </>
  );
}
