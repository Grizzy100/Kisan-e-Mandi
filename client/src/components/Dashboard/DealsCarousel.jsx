import React, { useState, useEffect, useRef } from "react";
import Org from "../../assets/organic.png";
import Irri from "../../assets/irrigation.png";
import Fert from "../../assets/fertilizers.png";
import { MdPlayArrow, MdChevronLeft, MdChevronRight, MdLocalOffer } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const deals = [
  {
    id: 1,
    title: "Premium Organic Seeds - 50% Off",
    description: "High-quality organic vegetable seeds from certified suppliers",
    image: Org,
    price: "₹2,100",
    originalPrice: "₹4,200",
    tag: "Flash Sale"
  },
  {
    id: 2,
    title: "Advanced Irrigation System",
    description: "Smart drip irrigation system with mobile app control",
    image: Irri,
    price: "₹16,500",
    originalPrice: "₹24,900",
    tag: "New Arrival"
  },
  {
    id: 3,
    title: "Organic Fertilizer Bundle",
    description: "Complete organic fertilizer package for all crop types",
    image: Fert,
    price: "₹7,200",
    originalPrice: "₹10,500",
    tag: "Best Seller"
  }
];

export function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % deals.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + deals.length) % deals.length);
  };

  useEffect(() => {
    if (!isHovered) {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isHovered]);

  return (
    <div
      className="relative group bg-white rounded-sm p-6 lg:p-8 border border-gray-100 shadow-sm transition-all duration-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-sm flex items-center justify-center border border-emerald-100">
              <MdLocalOffer className="w-5 h-5" />
          </div>
          <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Curated Deals</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Exclusive daily offers</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-sm hover:bg-gray-50 hover:text-emerald-600 transition-all active:scale-90 shadow-sm"
          >
            <MdChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-sm hover:bg-gray-50 hover:text-emerald-600 transition-all active:scale-90 shadow-sm"
          >
            <MdChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Carousel Core */}
      <div className="relative w-full overflow-hidden rounded-sm">
        <div
          className="flex transition-transform duration-700"
          style={{
            width: `${deals.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / deals.length)}%)`,
          }}
        >
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="w-full flex-shrink-0 px-2"
              style={{ width: `${100 / deals.length}%` }}
            >
              <div className="bg-gray-50/50 rounded-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row group/slide relative">
                
                {/* Image Section */}
                <div className="relative w-full md:w-2/5 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  
                  <span className="absolute top-4 left-4 px-2 py-1 bg-white/90 backdrop-blur-md text-[8px] font-black italic text-emerald-800 rounded-sm shadow-xl uppercase tracking-tighter border border-white/50">
                    {deal.tag}
                  </span>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center">
                    <div className="space-y-4">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                            {deal.title}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                            {deal.description}
                        </p>
                    </div>

                    <div className="mt-8 flex items-end gap-3 mb-8">
                        <span className="text-3xl font-black text-emerald-700 tracking-tighter leading-none">
                            {deal.price}
                        </span>
                        <span className="line-through text-gray-300 text-sm font-black tracking-widest leading-none pb-0.5">
                            {deal.originalPrice}
                        </span>
                    </div>

                    <button className="w-full md:w-max px-8 py-3 bg-gray-900 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95">
                        Claim Deal
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {deals.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === index ? "w-6 h-1.5 bg-emerald-600" : "w-1.5 h-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
