import React from 'react';
import {
  FaApple,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

import GooglePlayIcon from "../assets/googlePaly.png";
import P1 from "../assets/Phone1.png";
import P2 from "../assets/Phone2.png";

const Footer = () => {
  return (
    <>
      {/* App Promotion Section */}
      <div className="bg-light-green-custom py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-green-custom rounded-4xl p-6 md:p-10 overflow-hidden relative flex flex-col lg:flex-row items-center justify-between min-h-[500px]">

            {/* Image Section for sm/md */}
            <div className="block lg:hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0 w-full flex justify-center">
              <div className="relative w-64 h-[420px]">
                <img
                  src={P1}
                  alt="Phone 1"
                  className="absolute top-5 left-30 w-40 h-85 rounded-2xl opacity-100 z-0"
                />
                <img
                  src={P2}
                  alt="Phone 2"
                  className="absolute top-8 right-16 w-40 h-78 rounded-4xl opacity-100 z-0"
                />
              </div>
            </div>

            {/* Left Text Section */}
            <div className="z-10 text-white text-center lg:text-left flex-1">
              <h2 className="font-inria text-3xl md:text-5xl font-bold leading-tight mb-8 lg:mb-20 lg:ml-10">
                Try our App today
              </h2>

              {/* Button Section for lg */}
              <div className="hidden lg:flex mt-4 ml-10 flex-col sm:flex-row gap-4">
                <button className="w-40 h-14 bg-black text-white rounded-xl flex items-center px-3 hover:bg-gray-800 transition-colors">
                  <img src={GooglePlayIcon} alt="Google Play Icon" className="h-7 w-11 mr-3" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs">Get it on</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </button>
                <button className="w-44 h-14 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl flex items-center px-4 hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg">
                  <FaApple className="h-7 w-7 mr-4 text-white" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[11px] text-gray-300">Download on the</span>
                    <span className="text-sm font-semibold text-white">App Store</span>
                  </div>
                </button>
              </div>

              {/* Button Section for md only */}
              <div className="hidden md:flex lg:hidden z-10 order-2 mt-6 flex-col sm:flex-row gap-4 justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button className="w-36 h-12 bg-black text-white rounded-xl flex items-center px-2 hover:bg-gray-800 transition-colors">
                  <img src={GooglePlayIcon} alt="Google Play Icon" className="h-6 w-8 mr-2" />
                  <div className="flex flex-col items-start leading-tight text-left">
                    <span className="text-[11px]">Get it on</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </button>
                <button className="w-36 h-12 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl flex items-center px-3 hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg">
                  <FaApple className="h-5 w-5 mr-2 text-white" />
                  <div className="flex flex-col items-start leading-tight text-left">
                    <span className="text-[11px] text-gray-300">Download on the</span>
                    <span className="text-sm font-semibold text-white">App Store</span>
                  </div>
                </button>
              </div>

              {/* ✅ Button Section for sm and less */}
              <div className="flex md:hidden lg:hidden z-10 order-2 mt-6 flex-row gap-2 justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2 px-2">
                <button className="w-28 h-10 bg-black text-white rounded-xl flex items-center px-2 hover:bg-gray-800 transition-colors">
                  <img src={GooglePlayIcon} alt="Google Play Icon" className="h-4 w-4 mr-1" />
                  <div className="flex flex-col items-start leading-tight text-[9px]">
                    <span>Get it on</span>
                    <span className="text-[10px] font-semibold">Google Play</span>
                  </div>
                </button>
                <button className="w-28 h-10 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl flex items-center px-2 hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg">
                  <FaApple className="h-4 w-4 mr-1 text-white" />
                  <div className="flex flex-col items-start leading-tight text-[9px]">
                    <span className="text-gray-300">Download on</span>
                    <span className="text-[10px] font-semibold text-white">App Store</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone Images for lg */}
            <div className="hidden lg:block relative w-64 h-[420px] -ml-8">
              <img
                src={P1}
                alt="Phone 1"
                className="absolute -top-5 right-10 w-50 h-132 z-0 rounded-2xl opacity-100"
              />
              <img
                src={P2}
                alt="Phone 2"
                className="absolute top-4 right-28 w-60 h-120 z-0 rounded-4xl opacity-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/Kisan.png" alt="Kisan-e-mandi Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-gray-800 font-sora">Kisan-e-mandi</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-sora">©2025 FarmCorps by Paul, Inc.</p>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <a href="#" className="hover:text-green-500 transition-colors font-sora">Terms of Service</a>
                <a href="#" className="hover:text-green-500 transition-colors font-sora">Privacy Policy</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Product</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Pricing</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Log In</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Request access</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Partnerships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">About us</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">About Kisan-e-mandi</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Contact us</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Features</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Careers</a></li>
              </ul>
            </div>
            <div className="hidden lg:block">
              <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Help center</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Book a demo</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Server status</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors font-sora">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Get in touch</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><FaEnvelope className="w-4 h-4 font-sora" /><span>KisanEmandi@hmail.com</span></div>
                <div className="flex items-center gap-2"><FaPhoneAlt className="w-4 h-4 font-sora" /><span>+91-8989890998</span></div>
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="w-4 h-4 font-sora" /><span>Noida, UP</span></div>
              </div>
              <div className="flex gap-3 pt-4">
                <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
