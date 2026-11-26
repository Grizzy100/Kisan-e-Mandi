
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSeedling } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Blog = () => {
  const title =
    "How Online Agricultural Marketplaces Help Farmers | Kisan-e-Mandi";

  const description =
    "Discover how online agricultural marketplaces help farmers connect with buyers, improve market access and make informed selling decisions.";

  const pageUrl =
    "https://kisan-e-mandi.vercel.app/blog/online-agricultural-marketplace";

  useEffect(() => {
    document.title = title;

    const setMeta = (attribute, key, content) => {
      let tag = document.head.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow");
    setMeta("property", "og:type", "article");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", pageUrl);
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "How Online Agricultural Marketplaces Help Farmers Sell Their Produce",
      description,
      mainEntityOfPage: pageUrl,
      author: {
        "@type": "Organization",
        name: "Kisan-e-Mandi"
      },
      publisher: {
        "@type": "Organization",
        name: "Kisan-e-Mandi",
        url: "https://kisan-e-mandi.vercel.app/"
      }
    };

    let schema = document.getElementById("blog-article-schema");

    if (!schema) {
      schema = document.createElement("script");
      schema.id = "blog-article-schema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }

    schema.textContent = JSON.stringify(articleSchema);
  }, []);

  return (
    <>
      <Navbar />

      <main className="font-inria bg-white min-h-screen">

        {/* Blog Hero */}
        <section className="bg-green-700 text-white px-6 py-20 text-center">
          <FaSeedling className="text-green-200 text-5xl mx-auto mb-5" />

          <p className="text-green-200 uppercase tracking-wider text-sm font-semibold mb-3">
            Agriculture & Technology
          </p>

          <h1 className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight">
            How Online Agricultural Marketplaces Help Farmers Sell Their Produce
          </h1>

          <p className="text-green-100 mt-5 text-lg">
            Understanding digital agriculture, market access and direct connections.
          </p>
        </section>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-6 py-16">

          <p className="text-gray-600 text-sm mb-8">
            Category: Digital Agriculture | Topic: Online Agricultural Marketplace
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Agriculture plays an important role in India's economy, but
            connecting agricultural producers with suitable buyers can
            involve several challenges. Farmers may have limited access
            to market information, distant buyers and reliable
            transportation options.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mb-10">
            An <strong>online agricultural marketplace</strong> uses
            digital technology to make product discovery and communication
            between farmers, vendors and buyers easier. These platforms
            can help bring agricultural trade-related information and
            opportunities into one accessible place.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-5">
            1. What Is an Online Agricultural Marketplace?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            An online agricultural marketplace is a digital platform
            where farmers and agricultural buyers can discover products,
            explore available listings and communicate about potential
            transactions.
          </p>

          <p className="text-gray-700 leading-relaxed mb-10">
            Instead of depending entirely on physical market visits,
            users can use digital platforms to access product information
            and explore potential trading opportunities. The exact
            services available depend on the platform.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-5">
            2. How Can Farmers Benefit from Selling Agricultural Products Online?
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Wider buyer discovery
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Digital listings can make agricultural products easier
            for potential buyers to discover. This gives farmers
            another channel to present their produce and connect
            with interested customers.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Better access to market information
          </h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Information about prevailing prices, demand and market
            conditions can support more informed selling decisions.
            Farmers should compare available information before
            deciding where and when to sell.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Easier communication
          </h3>

          <p className="text-gray-700 leading-relaxed mb-10">
            Digital platforms can simplify communication between
            sellers and buyers. Product details, availability and
            requirements can be discussed before a transaction
            is finalized.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-5">
            3. The Role of Digital Mandis in Indian Agriculture
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            India has also taken steps towards digital agricultural
            marketing through the National Agriculture Market,
            commonly known as e-NAM.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            According to the Government of India, e-NAM connects
            participating physical agricultural mandis through
            an electronic trading platform. It supports online
            bidding, price discovery and access to a wider pool
            of buyers.
          </p>

          <p className="text-gray-700 leading-relaxed mb-10">
            You can learn more through the official
            {" "}
            <a
              href="https://www.enam.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline font-semibold"
            >
              National Agriculture Market portal
            </a>.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-5">
            4. Why Logistics and Equipment Access Matter
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Selling produce is only one part of agricultural trade.
            Farmers also need to consider harvesting, equipment,
            storage and transportation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Access to agricultural machinery can help farmers
            perform necessary operations without always purchasing
            expensive equipment. Reliable logistics arrangements
            are also important for moving produce from farms
            to buyers.
          </p>

          <p className="text-gray-700 leading-relaxed mb-10">
            Digital platforms can help users discover supporting
            services, depending on the facilities offered by
            the platform.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-5">
            5. How Kisan-e-Mandi Supports Digital Agricultural Trade
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Kisan-e-Mandi is a digital agricultural marketplace
            project designed to bring farmers, vendors and buyers
            onto a common platform.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Its platform focuses on agricultural product discovery
            and supporting areas such as farm equipment rentals,
            logistics support and market insights.
          </p>

          <p className="text-gray-700 leading-relaxed mb-10">
            The objective is to make agricultural trade-related
            information and services easier to explore through
            a digital platform.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-5">
            6. The Future of Digital Agriculture
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Digital agricultural marketplaces can contribute
            to a more connected agricultural ecosystem. As
            digital access and awareness grow, these platforms
            may provide additional ways for farmers and buyers
            to discover market opportunities.
          </p>

          <p className="text-gray-700 leading-relaxed mb-10">
            However, technology alone cannot solve every
            agricultural marketing challenge. Reliable
            infrastructure, transparent transactions,
            accurate information and user awareness remain
            important.
          </p>

          {/* References */}
          <section className="bg-green-50 rounded-2xl p-7 mb-12">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              References and Further Reading
            </h2>

            <ul className="list-disc pl-5 space-y-3 text-gray-700">
              <li>
                <a
                  href="https://www.enam.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  National Agriculture Market (e-NAM) – Official Portal
                </a>
              </li>

              <li>
                <a
                  href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2225985"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  Government of India – Functioning of e-NAM Platform
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-green-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Explore Kisan-e-Mandi
            </h2>

            <p className="text-green-100 mb-6">
              Discover a digital platform designed around agricultural needs.
            </p>

            <Link
              to="/"
              className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition"
            >
              Visit Homepage
            </Link>
          </section>

        </article>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
