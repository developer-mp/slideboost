import Home from "../components/main/Home";
import About from "../components/main/About";
import Features from "../components/main/Features";
import Pricing from "../components/main/Pricing";
import Faq from "../components/main/Faq";
import Contact from "../components/main/Contact";

const Main: React.FC = () => {
  return (
    <>
      <div
        id="home"
        className="tw-px-4 md:tw-px-6 lg:tw-px-10 tw-pt-6 tw-pb-10"
      >
        <Home />
      </div>
      <div id="about" className="tw-px-4 md:tw-px-6 lg:tw-px-10 tw-py-10">
        <About />
      </div>
      <div id="features" className="tw-px-4 md:tw-px-6 lg:tw-px-10 tw-py-10">
        <Features />
      </div>
      <div id="pricing" className="tw-px-4 md:tw-px-6 lg:tw-px-10 tw-py-10">
        <Pricing />
      </div>
      <div id="faq" className="tw-px-4 md:tw-px-6 lg:tw-px-10 tw-py-10">
        <Faq />
      </div>
      <div
        id="contact"
        className="tw-px-4 md:tw-px-6 lg:tw-px-10 tw-pt-10 tw-pb-6"
      >
        <Contact />
      </div>
    </>
  );
};

export default Main;
