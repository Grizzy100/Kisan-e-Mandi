import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

import GooglePlay from "../assets/download.png"
import AppSTORE from "../assets/apple.png"
import P1 from "../assets/Phone1.png"
import P2 from "../assets/Phone2.png"

const Footer = () => {
  return (
    <>
      {/* App Promotion Section */}
      <div className="bg-light-green-custom py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="ml-20 mr-20 bg-green-custom rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1 text-white">
                <h2 className="font-inria ml-10 text-4xl md:text-5xl font-bold mb-20 leading-tight">
                  Try our App today
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="w-40 h-14 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <img src={GooglePlay} alt="Google Play" className="h-8 object-cover" />
                  </button>

                  <button className="w-40 h-14 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <img src={AppSTORE} alt="App Store" className="h-8 object-contain" />
                  </button>
                </div>
              </div>

              {/* Right Content - Stacked Phones */}
              <div className="relative w-64 h-[420px] -ml-8">
                  <img
                    src={P1}
                    alt="Phone 1"
                    className="absolute top-0 right-20 w-60 z-8 h-120 rounded-2xl"
                  />
                  <img
                    src={P2}
                    alt="Phone 2"
                    className="absolute top-8 right-55 w-56 z-8 h-108 rounded-3xl"
                  />
            </div>


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
                <span className="text-xl font-bold text-gray-800">Kisan-e-mandi</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">©2025  FarmCorps by Paul, Inc.</p>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-500 transition-colors">Product</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Log In</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Request access</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Partnerships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">About us</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-500 transition-colors">About Kisan-e-mandi</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Contact us</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-500 transition-colors">Help center</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Book a demo</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Server status</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Get in touch</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><FaEnvelope className="w-4 h-4" /><span>KisanEmandi@hmail.com</span></div>
                <div className="flex items-center gap-2"><FaPhoneAlt className="w-4 h-4" /><span>+91-8989890998</span></div>
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="w-4 h-4" /><span>San Francisco, CA</span></div>
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
