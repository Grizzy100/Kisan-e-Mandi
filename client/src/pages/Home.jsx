import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";

const Home = () => {
  const heroRef = useRef(null);
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasPassedHero(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[url('/greenBg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40"></div>
      <Navbar hasPassedHero={hasPassedHero} />
      <main className="relative z-20">
        <div ref={heroRef}>
          <Hero />
        </div>
        <Services />
        <Testimonial />
        <Footer />
      </main>
    </div>
  );
};

export default Home;
