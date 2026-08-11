import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Projects } from "@/components/sections/Projects";
import { Toolkit } from "@/components/sections/Toolkit";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Projects />
      <Toolkit />
      <About />
      <Contact />
    </>
  );
}
