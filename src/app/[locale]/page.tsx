import { Header, Hero, HowItWorks, USPSection, TemplateShowcase, Testimonials, FAQ, Footer } from '@/components/landing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <USPSection />
      <TemplateShowcase />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
