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
    id: 3,
    title: "Organic Fertilizer Bundle",
    description: "Complete organic fertilizer package for all crop types",
    image: Fert,
    price: "$89.99",
    originalPrice: "$129.99",
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
    id: 3,
    title: "Organic Fertilizer Bundle",
    description: "Complete organic fertilizer package for all crop types",
    image: Fert,
    price: "$89.99",
    originalPrice: "$129.99",
  },
  {
    id: 3,
    title: "Organic Fertilizer Bundle",
    description: "Complete organic fertilizer package for all crop types",
    image: Fert,
    price: "$89.99",
    originalPrice: "$129.99",
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
      className="bg-white rounded-lg border border-gray-200 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Deal of the day</h2>
          <FaLongArrowAltRight className="text-green-600 w-7 h-8" />
        </div>
        <div className="flex gap-2">
          <button onClick={prevSlide} className="p-2 border rounded-lg hover:bg-gray-100">
            <MdChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="p-2 border rounded-lg hover:bg-gray-100">
            <MdChevronRight className="w-5 h-5" />
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
              className="w-full flex-shrink-0 px-2"
              style={{ width: `${100 / deals.length}%` }}
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md flex">
                {/* Image */}
                <div className="relative w-1/3">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute inset-0 m-auto w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center">
                    <MdPlayArrow className="text-white w-5 h-5" />
                  </button>
                </div>

                {/* Text */}
                <div className="w-2/3 p-4">
                  <h3 className="text-lg font-semibold">{deal.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{deal.description}</p>
                  <div className="flex gap-2 items-center mb-3">
                    <span className="text-green-600 font-bold text-xl">{deal.price}</span>
                    <span className="line-through text-gray-400 text-sm">{deal.originalPrice}</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {deals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
