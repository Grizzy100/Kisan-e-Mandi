import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaStore,
  FaArrowRight,
  FaLeaf,
  FaSeedling,
  FaHeart,
  FaChartLine,
} from 'react-icons/fa';
import { GiFarmer, GiTomato, GiCarrot, GiCorn } from 'react-icons/gi';
import HImg from '../assets/HeroImg.png';
import bgLogo from '../assets/greenBg.jpg';

const Hero = () => {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogo})` }} // ✅ Inline style
    >
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/3 rounded-full blur-lg animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
          
          {/* ← Left Image */}
          <div className="flex justify-center lg:justify-start">
            <img
              src={HImg}
              alt="Hero Visual"
              className="h-[600px] md:h-[500px] w-auto rounded-xl shadow-xl"
            />
          </div>

          {/* → Right Text Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-6">
              {/* <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <FaStore className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold opacity-90">kisan-e-mandi</h3>
                  <p className="text-sm text-white/70">Farmer's Marketplace</p>
                </div>
              </div> */}
              <div className="mt-10">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Empowering
                  <span className="block text-green-100 relative">
                    Farmers.
                    <FaSeedling className="inline-block ml-4 h-12 w-12 text-green-200 animate-bounce" />
                  </span>
                </h1>
              </div>

              <h2 className="text-2xl lg:text-3xl font-light text-green-100 italic flex items-center">
                A New Dawn
               
              </h2>
            </div>

            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg">
              We're building a platform where farmers are heard, valued, and
              paid what they deserve – without exploitation or hidden middlemen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/get-started"
                className="group bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <FaArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                to="/learn-more"
                className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
                <FaLeaf className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>

            {/* Enhanced Stats
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center group">
                <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl inline-block mb-2 group-hover:bg-white/25 transition-all duration-300">
                  <FaUsers className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Farmers</div>
              </div>
              <div className="text-center group">
                <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl inline-block mb-2 group-hover:bg-white/25 transition-all duration-300">
                  <FaLeaf className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-white/80">Crops</div>
              </div>
              <div className="text-center group">
                <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl inline-block mb-2 group-hover:bg-white/25 transition-all duration-300">
                  <FaChartLine className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold">₹2Cr+</div>
                <div className="text-sm text-white/80">Revenue</div>
              </div>
            </div> */}
          </div>

          {/* Right Content - Enhanced Farmer's Market Illustration */}
          {/* ...rest of your JSX remains unchanged... */}
        </div>
      </div>
    </section>
  );
};

export default Hero;

