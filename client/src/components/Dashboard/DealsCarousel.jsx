import React, { useState, useEffect, useRef } from "react";
import Org from "../../assets/organic.png";
import Irri from "../../assets/irrigation.png";
import Fert from "../../assets/fertilizers.png";
import { MdPlayArrow, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";

const deals = [
  {
    id: 1,
    title: "Premium Organic Seeds - 50% Off",
    description: "High-quality organic vegetable seeds from certified suppliers",
    image: Org,
    price: "$25.99",
    originalPrice: "$51.99",
  },
  {
    id: 2,
    title: "Advanced Irrigation System",
    description: "Smart drip irrigation system with mobile app control",
    image: Irri,
    price: "$199.99",
    originalPrice: "$299.99",
  },
  {
    id: 3,
    title: "Organic Fertilizer Bundle",
    description: "Complete organic fertilizer package for all crop types",
    image: Fert,
    price: "$89.99",
    originalPrice: "$129.99",
  },
  {
    id: 4,
    title: "Eco-Friendly Manure Mix",
    description: "100% natural manure to enrich soil fertility organically",
    image: Fert,
    price: "$59.99",
    originalPrice: "$79.99",
  },
  {
    id: 5,
    title: "Greenhouse Irrigation Kit",
    description: "Custom-designed irrigation solution for greenhouses",
    image: Irri,
    price: "$249.99",
    originalPrice: "$329.99",
  },
  {
    id: 6,
    title: "Vegetable Growth Booster",
    description: "Organic booster to accelerate crop growth and yield",
    image: Fert,
    price: "$39.99",
    originalPrice: "$59.99",
  },
  {
    id: 7,
    title: "Micro Drip Accessories",
    description: "Nozzle and valve set for precision irrigation",
    image: Irri,
    price: "$19.99",
    originalPrice: "$29.99",
  },
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
      timeoutRef.current = setTimeout(nextSlide, 4000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isHovered]);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      
<div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
  <div className="flex items-center gap-1 sm:gap-2">
    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
      Deal of the day
    </h2>
    <FaLongArrowAltRight className="text-green-600 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mt-0.5 sm:mt-1" />
  </div>
  <div className="flex gap-1 sm:gap-2">
    <button
      onClick={prevSlide}
      className="p-1 border rounded-lg hover:bg-gray-100"
    >
      <MdChevronLeft className="w-4 h-4" />
    </button>
    <button
      onClick={nextSlide}
      className="p-1 border rounded-lg hover:bg-gray-100"
    >
      <MdChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${deals.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / deals.length)}%)`,
          }}
        >
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="w-full flex-shrink-0 px-1 sm:px-2"
              style={{ width: `${100 / deals.length}%` }}
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-1/3">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-36 sm:h-40 md:h-48 object-cover"
                  />
                  <button className="absolute inset-0 m-auto w-8 h-8 sm:w-10 sm:h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center">
                    <MdPlayArrow className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Text */}
                <div className="w-full sm:w-2/3 p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                    {deal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    {deal.description}
                  </p>
                  <div className="flex gap-1 sm:gap-2 items-center mb-2 sm:mb-3">
                    <span className="text-green-600 font-bold text-base sm:text-lg md:text-xl">
                      {deal.price}
                    </span>
                    <span className="line-through text-gray-400 text-xs sm:text-sm">
                      {deal.originalPrice}
                    </span>
                  </div>
                  <button className="w-full text-sm sm:text-base bg-green-600 text-white py-1.5 sm:py-2 rounded hover:bg-green-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 sm:mt-4 gap-1 sm:gap-2">
        {deals.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              currentIndex === index ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
