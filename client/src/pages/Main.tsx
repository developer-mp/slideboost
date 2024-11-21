import Home from "../components/main/Home";
import About from "../components/main/About";
import Features from "../components/main/Features";
import Pricing from "../components/main/Pricing";
import Faq from "../components/main/Faq";
import Contact from "../components/main/Contact";

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
