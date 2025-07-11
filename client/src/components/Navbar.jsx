import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiHome, FiLayers, FiHelpCircle, FiPhone, FiInfo } from "react-icons/fi";
import Klogo from "../assets/KisanLogo.png";

const Navbar = ({ hasPassedHero }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const links = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Services", path: "/services", icon: <FiLayers /> },
    { name: "FAQs", path: "/faqs", icon: <FiHelpCircle /> },
    { name: "Help", path: "/help", icon: <FiPhone /> },
    { name: "About", path: "/about", icon: <FiInfo /> },
  ];

  const handleVendorClick = () => navigate("/login");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navTextClass = hasPassedHero ? "text-black" : "text-white";
  const navBtnClass = hasPassedHero
    ? "text-black border-green-500 hover:bg-green-100"
    : "text-white border-white/30 bg-white/10 hover:bg-white hover:text-green-600";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent">
      {/* Mobile */}
      <div className="sm:hidden flex items-center justify-between mx-4 mt-4 px-4 py-2 rounded-full border border-white/30 backdrop-blur-md">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-transform duration-300 ${navTextClass}`}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <button
          onClick={handleVendorClick}
          className={`text-xs font-sora px-4 py-1.5 rounded-full border transition ${navBtnClass}`}
        >
          Become Vendor
        </button>
      </div>

      {/* Tablet */}
      <div className="hidden sm:flex md:hidden w-full items-center justify-between mt-5 px-6">
        <Link to="/" className="flex items-center">
          <img src={Klogo} alt="Kisan Logo" className="h-16 w-auto" />
        </Link>
        <div className="flex space-x-6">
          {links.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`text-sm font-medium font-sora relative group transition ${navTextClass} hover:text-green-600`}
            >
              {name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-green-600"></span>
            </Link>
          ))}
        </div>
        <button
          onClick={handleVendorClick}
          className={`px-4 py-2 rounded-full font-sora text-sm border transition ${navBtnClass}`}
        >
          Become a Vendor
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex w-full items-center justify-between px-10 mt-5">
        <Link to="/" className="flex items-center">
          <img src={Klogo} alt="Kisan Logo" className="h-20 w-auto" />
        </Link>
        <div className="flex space-x-8">
          {links.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`font-medium font-sora relative group transition ${navTextClass} hover:text-green-600`}
            >
              {name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-green-600"></span>
            </Link>
          ))}
        </div>
        <button
          onClick={handleVendorClick}
          className={`px-4 py-2 rounded-full font-sora border transition ${navBtnClass}`}
        >
          Become a Vendor
        </button>
      </div>

      {/* Slide-in Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 flex sm:hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        ></div>

        <div
          className={`relative h-auto w-64 bg-white rounded-r-lg shadow-2xl transform transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ alignSelf: "flex-start" }}
        >
          <div className="px-4 pt-8 pb-6 space-y-4">
            <div className="text-xl font-bold text-green-700 border-b border-gray-200 pb-4">
              Kisan-e-Mandi
            </div>
            <div className="divide-y divide-gray-200">
              {links.map(({ name, path, icon }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 text-gray-700 font-sora hover:bg-green-50 hover:text-green-600 text-base font-medium transition-colors duration-200 py-3"
                >
                  {icon}
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
