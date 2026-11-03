import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import ScrollProgress from "@/components/common/ScrollProgress";

const Index = () => (
  <div className="bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-white min-h-screen transition-colors duration-200 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
    <ScrollProgress />
    <Navbar />
    <Hero />
    <About />
    <Skills />
    <Services />
    <Projects />
    <Certificates />
    <Contact />
    <Footer />
    <BackToTop />
  </div>
);

export default Index;
