import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

// Lazy-load below-the-fold sections so framer-motion and footer assets don't block LCP
const Services = lazy(() => import("../components/Services"));
const Testimonial = lazy(() => import("../components/Testimonial"));
const Footer = lazy(() => import("../components/Footer"));

const LazyOnView = ({ children, minHeight = 400 }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -1px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const placeholder = <div style={{ minHeight }} />;
  return (
    <div ref={ref}>
      {show ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
};

const Home = () => {
  const heroRef = useRef(null);
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useEffect(() => {
    let lenis;
    let rafId;
    let cancelled = false;

    // Only load Lenis smooth scrolling on desktop/tablet viewports
    if (window.innerWidth >= 768) {
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
    }

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
        <LazyOnView minHeight={600}>
          <Services />
        </LazyOnView>
        <LazyOnView minHeight={600}>
          <Testimonial />
        </LazyOnView>
        <LazyOnView minHeight={600}>
          <Footer />
        </LazyOnView>
      </main>
    </div>
  );
};

export default Home;
