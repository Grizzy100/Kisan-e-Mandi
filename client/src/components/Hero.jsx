import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaLeaf,
  FaSeedling,
} from 'react-icons/fa';
import HImg from '../assets/HeroImg.png';
import bgLogo from '../assets/greenBg.jpg';

const Hero = () => {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogo})` }}
    >
      {/* Decorative Background Pulses */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/3 rounded-full blur-lg animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[calc(100vh-5rem)]">
          {/* Left: Image */}
          <div className="flex justify-center md:justify-start">
            <img
              src={HImg}
              alt="Hero Visual"
              className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[600px] w-auto rounded-xl shadow-xl transition-all duration-300"
            />
          </div>

          {/* Right: Text */}
          <div className="space-y-6 text-white text-center md:text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight flex flex-wrap justify-center md:justify-start items-center gap-2">
                Empowering
                <span className="text-green-100 relative flex items-center">
                  Farmers.
                  <FaSeedling className="ml-2 h-6 sm:h-8 md:h-10 text-green-200 animate-bounce" />
                </span>
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-green-100 italic mt-2">
                A New Dawn
              </h2>
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg mx-auto md:mx-0">
              We're building a platform where farmers are heard, valued, and
              paid what they deserve – without exploitation or hidden middlemen.
            </p>

            <div className="flex flex-col md:flex-row gap-4 pt-4 mb-6 items-center md:items-start">
              <Link
                to="/get-started"
                className="group bg-white text-green-600 px-6 md:px-5 md:py-4 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <FaArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                to="/learn-more"
                className="group border-2 border-white text-white px-6 md:px-5 md:py-4 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
                <FaLeaf className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
