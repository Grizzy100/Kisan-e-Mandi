import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Klogo from "../assets/KisanLogo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "FAQs", path: "/faqs" },
    { name: "Help", path: "/help" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleVendorClick = () => {
    navigate("/login");
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="mt-5 mb-3 max-w-7xl mx-auto px-6 flex items-center h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={Klogo} alt="Kisan‑e‑Mandi Logo" className="h-28 w-auto ml-0" />
        </Link>

        {/* Centered Links */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
          {links.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`text-white/90 hover:text-white transition duration-300 font-medium relative ${
                isActive(path) ? "text-white" : ""
              }`}
            >
              {name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                  isActive(path) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* “Become a Vendor” Button */}
        <div className="hidden md:block">
          <button
            onClick={handleVendorClick}
            className="bg-white/15 backdrop-blur-sm hover:bg-white hover:text-green-600 text-white 
              px-4 py-2 rounded-full font-semibold transition-all duration-300 
              border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Become a Vendor
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-green-600/95 backdrop-blur-sm border-t border-white/10 shadow-xl">
          <div className="px-6 py-4 space-y-3">
            {links.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block text-white/90 hover:text-white transition-colors duration-200 font-medium py-2 ${
                  isActive(path) ? "text-white border-l-4 border-white pl-4" : ""
                }`}
              >
                {name}
              </Link>
            ))}
            <button
              onClick={() => {
                handleVendorClick();
                setMenuOpen(false);
              }}
              className="block w-full bg-white/15 hover:bg-white hover:text-green-600 text-white 
                px-4 py-3 rounded-lg font-semibold transition-all duration-300 text-center mt-4"
            >
              Become a Vendor
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
