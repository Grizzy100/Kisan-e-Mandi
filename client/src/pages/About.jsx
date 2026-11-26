
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaStore,
  FaTractor,
  FaTruck,
  FaChartLine
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeInWhenVisible from "../components/FadeInWhenVisible";

const features = [
  {
    icon: <FaStore />,
    title: "Digital Marketplace",
    description:
      "Connect farmers and buyers through an online agricultural marketplace."
  },
  {
    icon: <FaTractor />,
    title: "Farm Equipment",
    description:
      "Explore access to agricultural tools and machinery through rental services."
  },
  {
    icon: <FaTruck />,
    title: "Logistics Support",
    description:
      "Support the movement of agricultural produce between sellers and buyers."
  },
  {
    icon: <FaChartLine />,
    title: "Market Insights",
    description:
      "Explore agricultural market trends and pricing information."
  }
];

const About = () => {
  useEffect(() => {
    const pageTitle = "About Us | Kisan-e-Mandi";

    const description =
      "Learn about Kisan-e-Mandi, a digital agricultural marketplace connecting farmers, vendors and buyers.";

    const pageUrl = "https://kisan-e-mandi.vercel.app/about";

    // Update page title
    document.title = pageTitle;

    // Helper to create or update meta tags
    const setMetaTag = (attribute, key, content) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // SEO metadata
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", "index, follow");

    // Open Graph metadata
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", pageUrl);
    setMetaTag("property", "og:site_name", "Kisan-e-Mandi");

    // Twitter metadata
    setMetaTag("name", "twitter:card", "summary");
    setMetaTag("name", "twitter:title", pageTitle);
    setMetaTag("name", "twitter:description", description);

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", pageUrl);

    // About page structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Kisan-e-Mandi",
      description: description,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "Kisan-e-Mandi",
        url: "https://kisan-e-mandi.vercel.app/"
      }
    };

    let schemaScript = document.getElementById(
      "about-page-schema"
    );

    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "about-page-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify(structuredData);
  }, []);

  return (
    <>
      <Navbar />

      <main className="font-inria bg-white min-h-screen">

        {/* Hero */}
        <section className="relative bg-green-700 text-white py-28 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <FadeInWhenVisible>
              <FaSeedling className="text-green-200 text-5xl mx-auto mb-6" />

              <h1 className="text-4xl md:text-6xl font-bold mb-5">
                About Kisan-e-Mandi
              </h1>

              <p className="text-green-50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Connecting farmers and buyers through a digital agricultural
                marketplace designed to make agricultural trade more accessible.
              </p>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Introduction */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <FadeInWhenVisible>
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-green-600 font-semibold uppercase tracking-wider text-sm">
                Our Story
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-green-700 mt-3 mb-6">
                Making Agricultural Trade More Accessible
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Kisan-e-Mandi is a digital agricultural marketplace project
                intended to bring farmers, vendors and buyers onto a common
                platform. It aims to simplify the discovery and exchange of
                agricultural products while providing access to supporting
                services such as equipment rentals, logistics and market insights.
              </p>
            </div>
          </FadeInWhenVisible>
        </section>

        {/* Mission */}
        <section className="bg-green-50 py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible>
              <div>
                <h2 className="text-3xl font-bold text-green-700 mb-5">
                  Our Mission
                </h2>

                <p className="text-gray-700 leading-relaxed text-lg">
                  Our aim is to make digital agricultural commerce easier
                  to access by helping farmers discover buyers, explore
                  available services and participate in a connected marketplace.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
                <FaSeedling className="text-green-600 text-5xl mb-5" />

                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Empowering Farmers
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  We aim to support a more connected agricultural ecosystem
                  where farmers and buyers can discover opportunities through
                  digital tools.
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
                  What Kisan-e-Mandi Offers
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto">
                  Explore the services designed to support farmers and
                  agricultural buyers.
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FadeInWhenVisible key={feature.title} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="h-full bg-green-50 rounded-2xl p-7 shadow-sm hover:shadow-lg transition duration-300"
                  >
                    <div className="text-green-600 text-3xl mb-5">
                      {feature.icon}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-700 py-16 px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Explore Kisan-e-Mandi
          </h2>

          <p className="text-green-100 mb-8">
            Discover a digital marketplace built around agricultural needs.
          </p>

          <Link
            to="/"
            className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition"
          >
            Explore Homepage
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
