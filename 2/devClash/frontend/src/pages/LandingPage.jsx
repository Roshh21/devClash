import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import FeatureStrip from '../components/landing/FeatureStrip';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-primary">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureStrip />
      </main>
      <Footer />
    </div>
  );
}
