import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services"; // ✅ Add this line
import Testimonial from "../components/Testimonial"
import Footer from "../components/Footer";

const Home = () => (
  <div className="relative w-full min-h-screen bg-[url('/greenBg.jpg')] bg-cover bg-center">
    <div className="absolute inset-0 bg-black/40"></div>
    <Navbar />
    <main className="relative z-20">
      <Hero />
      <Services /> {/* ✅ Include Services as part of homepage */}
      <Testimonial />
      <Footer />

    </main>
  </div>
);

export default Home;
