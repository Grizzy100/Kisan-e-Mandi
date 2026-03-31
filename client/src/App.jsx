import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
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
            navigate("/dashboard");
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  console.log(`[PrivateRoute] Checking access to: ${location.pathname}. isAdminRoute: ${isAdminRoute}`, { userStr: !!userStr, token: !!token, allowedRoles });

  if (!userStr || !token) {
    console.log(`[PrivateRoute] Missing auth. Redirecting to: ${isAdminRoute ? "/admin/login" : "/login"}`);
    // Send admin-route visitors to the admin login page
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    console.log(`[PrivateRoute] User role: ${user.role}. Allowed:`, allowedRoles);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.log(`[PrivateRoute] Access denied for role ${user.role}. Redirecting...`);
      // Admin tried to access non-admin route → their dashboard
      if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  } catch (e) {
    console.log(`[PrivateRoute] JSON Parse Error. Redirecting to ${isAdminRoute ? "/admin/login" : "/login"}`);
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  console.log(`[PrivateRoute] Access GRANTED to ${location.pathname}`);
  return children;
};

// Conditional Navbar wrapper
const LayoutWithNavbar = ({ children }) => {
  const location = useLocation();

  // Only show navbar on `/`
  const showNavbar = location.pathname === "/" && !location.pathname.startsWith("/admin");

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
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
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute allowedRoles={['farmer', 'admin', 'customer']}>
                    <MainDashboard />
                  </PrivateRoute>
                }
              />

              {/* Dedicated Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
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
