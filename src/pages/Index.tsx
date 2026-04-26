import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SampleSlider } from "@/components/SampleSlider";
import { HowItWorks } from "@/components/HowItWorks";
import { Generator } from "@/components/Generator";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <Hero />
      <SampleSlider />
      <HowItWorks />
      <Generator />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default Index;
