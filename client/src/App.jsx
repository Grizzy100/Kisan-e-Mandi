import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import VendorDashboard from "./pages/VendorDasboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Lenis from "@studio-freight/lenis";

// ✅ PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ✅ Conditional Navbar wrapper
const LayoutWithNavbar = ({ children }) => {
  const location = useLocation();

  // ✅ Only show navbar on `/`
  const showNavbar = location.pathname === "/";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      gestureDirection: "vertical",
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Cleanup
    };
  }, []);

  return (
    <Router>
      <ToastContainer theme="dark" />
      <LayoutWithNavbar>
        <div className="font-inria bg-background text-foreground min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/vendor-portal"
              element={
                <PrivateRoute>
                  <VendorDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<div className="p-4 text-center text-red-600">404 - Page Not Found</div>} />
          </Routes>
        </div>
      </LayoutWithNavbar>
    </Router>
  );
};

export default App;
