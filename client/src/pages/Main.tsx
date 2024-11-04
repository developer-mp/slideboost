import { templatesData } from "../data/templatesData";
import Home from "../components/Home";
import About from "../components/About";
import TemplateCarousel from "../components/TemplateCarousel";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import Contact from "../components/Contact";

const Main: React.FC = () => {
  return (
    <>
      <div id="home">
        <Home />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="features">
        <TemplateCarousel templates={templatesData} />
        <Features />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="faq">
        <Faq />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  );
};

export default Main;
