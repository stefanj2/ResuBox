import { Header, Hero, USPSection, TemplateShowcase, FAQ, Footer } from '@/components/landing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <USPSection />
      <TemplateShowcase />
      <FAQ />
      <Footer />
    </main>
  );
}
