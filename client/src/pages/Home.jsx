import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

// Lazy-load below-the-fold sections so framer-motion and footer assets don't block LCP
const Services = lazy(() => import("../components/Services"));
const Testimonial = lazy(() => import("../components/Testimonial"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  const heroRef = useRef(null);
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useEffect(() => {
    let lenis;
    let rafId;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis();
      function raf(time) {
        if (cancelled) return;
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });

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
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
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
        <Suspense fallback={null}>
          <Services />
          <Testimonial />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
