import React from "react";
import {
  FaStore,
  FaTractor,
  FaTruck,
  FaChartLine,
  FaHandsHelping,
} from "react-icons/fa";
import { motion } from "framer-motion";
import FadeInWhenVisible from "../components/FadeInWhenVisible"; // Ensure this path is correct

const services = [
  {
    icon: <FaStore className="text-green-600 text-4xl" />,
    title: "Digital Marketplace",
    desc: "Buy and sell fresh produce directly — no middlemen, no hassle.",
  },
  {
    icon: <FaTractor className="text-green-600 text-4xl" />,
    title: "Farm Equipment Rentals",
    desc: "Access modern tools and machinery without heavy upfront costs.",
  },
  {
    icon: <FaTruck className="text-green-600 text-4xl" />,
    title: "Logistics Support",
    desc: "Get produce transported efficiently with our logistics partners.",
  },
  {
    icon: <FaChartLine className="text-green-600 text-4xl" />,
    title: "Market Insights",
    desc: "Stay ahead with real-time pricing trends and market analytics.",
  },
  {
    icon: <FaHandsHelping className="text-green-600 text-4xl" />,
    title: "Farmer Support",
    desc: "Get expert help and community-driven solutions when you need it.",
  },
];

const Services = () => {
  return (
    <section id="services" className="bg-white py-20 text-center">
      <h2 className="text-4xl font-bold text-green-700 mb-4">Our Services</h2>
      <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
        Empowering farmers with modern tools, support, and insights — every
        step of the way.
      </p>

      <div className="grid gap-10 max-w-6xl mx-auto px-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <FadeInWhenVisible key={index} delay={index * 0.2}>
            <motion.div
              // whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="cursor-pointer bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.desc}</p>
            </motion.div>
          </FadeInWhenVisible>
        ))}
      </div>
    </section>
  );
};

export default Services;