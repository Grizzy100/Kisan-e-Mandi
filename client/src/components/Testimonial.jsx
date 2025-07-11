import React, { useEffect, useState } from "react";
import { FaStar, FaUser } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarah_j",
    content:
      "This platform has completely transformed how I manage my daily tasks. The intuitive interface and powerful features make everything so much easier.",
    rating: 5,
    date: "Dec 15, 2024",
  },
  {
    id: 2,
    name: "Michael Chen",
    username: "@mike_chen",
    content:
      "I've been using this for 6 months now and it's incredible. The team behind this really understands what users need.",
    rating: 5,
    date: "Dec 14, 2024",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    username: "@emily_r",
    content:
      "Amazing product! The customer support is top-notch and the features keep getting better with each update.",
    rating: 5,
    date: "Dec 13, 2024",
  },
  {
    id: 4,
    name: "David Kim",
    username: "@david_kim",
    content:
      "I was skeptical at first, but this has become an essential part of my workflow. Highly recommend to anyone looking for efficiency.",
    rating: 5,
    date: "Dec 12, 2024",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    username: "@lisa_t",
    content:
      "The attention to detail is remarkable. Every feature feels well thought out and perfectly executed.",
    rating: 5,
    date: "Dec 11, 2024",
  },
  {
    id: 6,
    name: "Amit Verma",
    username: "@amit_v",
    content:
      "Works like a charm! The best part is how seamlessly it integrates into my workflow.",
    rating: 5,
    date: "Dec 10, 2024",
  },
  {
    id: 7,
    name: "Nina Patel",
    username: "@nina_p",
    content:
      "A life-saver tool for farmers and buyers alike. Community-driven and transparent!",
    rating: 5,
    date: "Dec 09, 2024",
  },
  {
    id: 8,
    name: "Raj Singh",
    username: "@raj_singh",
    content:
      "Smart design, smooth interface and trustworthy support – this is the future.",
    rating: 5,
    date: "Dec 08, 2024",
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="mt-6 bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 mb-6 
                  w-full max-w-[220px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-xs">
    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
        <FaUser className="text-white text-[10px] sm:text-xs md:text-sm" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">{testimonial.name}</h4>
        <p className="text-[10px] sm:text-xs text-gray-500">{testimonial.username}</p>
      </div>
    </div>
    <div className="flex text-yellow-500 text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-2">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
    <p className="text-gray-700 text-[11px] sm:text-sm md:text-base italic mb-2 sm:mb-3">
      {testimonial.content}
    </p>
    <p className="text-[10px] sm:text-xs text-gray-400">{testimonial.date}</p>
  </div>
);

const AnimatedColumn = ({ testimonials, direction = "up", speed = 50 }) => {
  const [translateY, setTranslateY] = useState(0);
  const height = 220;
  const scrollLimit = testimonials.length * height;
  const extendedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    if (direction === "down") {
      setTranslateY(-scrollLimit);
    }
  }, [direction, scrollLimit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTranslateY((prev) => {
        const move = direction === "up" ? -0.5 : 0.5;
        let next = prev + move;

        if (direction === "up" && Math.abs(next) >= scrollLimit) {
          return 0;
        }
        if (direction === "down" && next >= 0) {
          return -scrollLimit;
        }

        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, scrollLimit, speed]);

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[580px] lg:h-[600px] overflow-hidden">
      <div
        className="transition-transform ease-linear"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {extendedTestimonials.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-white to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white to-transparent z-10" />
    </div>
  );
};

const Testimonial = () => {
  const leftColumn = testimonials.filter((_, i) => i % 2 === 0);
  const rightColumn = testimonials.filter((_, i) => i % 2 !== 0);

  return (
    <section className="bg-white py-12 px-4 sm:px-6 md:px-8 lg:py-20 lg:px-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* LEFT - TEXT */}
        <div className="flex flex-col justify-center items-start h-full space-y-6">
          <h2 className="text-left leading-tight font-bold text-gray-900">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              We believe in the
            </span>
            <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl text-green-600">
              power of community
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium text-left">
            Our goal is to empower farmers and buyers with trust and technology,
            eliminating middlemen and unfair practices. We constantly listen to
            what our users say to improve and evolve.
          </p>
          <button className="bg-green-600 text-white 
  px-4 py-2 text-xs 
  sm:px-6 sm:py-3 sm:text-base 
  rounded-full font-semibold shadow 
  hover:bg-green-700 transition duration-300">
  Read more testimonials
</button>

        </div>

        {/* RIGHT - TESTIMONIAL COLUMNS */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <AnimatedColumn testimonials={leftColumn} direction="down" speed={80} />
          <AnimatedColumn testimonials={rightColumn} direction="up" speed={80} />
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
