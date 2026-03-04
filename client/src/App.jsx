import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VendorDashboard from "./pages/VendorDasboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Lenis from "@studio-freight/lenis";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Email Verification Route (hit when user clicks link in email)
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Email verified! You are now logged in.");
            if (data.user.role === 'farmer' || data.user.role === 'admin') {
              navigate("/vendor-portal");
            } else {
              navigate("/user-dashboard");
            }
          } else {
            toast.error(data.message || "Invalid or expired verification link");
            navigate("/login");
          }
        })
        .catch(() => {
          toast.error("Error verifying email");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <div className="p-10 text-center text-lg font-semibold text-green-700">Verifying your email...</div>;
};

// PrivateRoute wrapper with Role Checking
const PrivateRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userStr || !token) {
    return <Navigate to="/login" />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={user.role === 'farmer' || user.role === 'admin' ? '/vendor-portal' : '/user-dashboard'} />;
    }
  } catch (e) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Conditional Navbar wrapper
const LayoutWithNavbar = ({ children }) => {
  const location = useLocation();

  // Only show navbar on `/`
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ToastContainer theme="dark" />
        <LayoutWithNavbar>
          <div className="font-inria bg-background text-foreground min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />

              <Route
                path="/vendor-portal"
                element={
                  <PrivateRoute allowedRoles={['farmer', 'admin']}>
                    <VendorDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/user-dashboard"
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<div className="p-4 text-center text-red-600">404 - Page Not Found</div>} />
            </Routes>
          </div>
        </LayoutWithNavbar>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
