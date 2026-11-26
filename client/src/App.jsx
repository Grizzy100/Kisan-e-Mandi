import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Home is imported eagerly so the LCP element renders without a chunk-fetch waterfall
import Home from "./pages/Home.jsx";
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const MainDashboard = lazy(() => import("./pages/MainDashboard.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));

const AppToast = lazy(() => import("./components/AppToast.jsx"));
import Navbar from "./components/Navbar.jsx";
import { CartProvider } from "./context/CartContext.jsx";


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
            import("react-toastify").then(({ toast }) => toast.success("Email verified! You are now logged in."));
            navigate("/dashboard");
          } else {
            import("react-toastify").then(({ toast }) => toast.error(data.message || "Invalid or expired verification link"));
            navigate("/login");
          }
        })
        .catch(() => {
          import("react-toastify").then(({ toast }) => toast.error("Error verifying email"));
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

  if (!userStr || !token) {
    // Send admin-route visitors to the admin login page
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Admin tried to access non-admin route → their dashboard
      if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  } catch (e) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

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
    <Router>
      <CartProvider>
        <Suspense fallback={null}>
          <AppToast />
        </Suspense>
        <LayoutWithNavbar>
          <div className="font-inria bg-background text-foreground min-h-screen">
            <Suspense fallback={
              <div className="p-10 text-center text-lg font-semibold text-green-700 animate-pulse">
                🌱 Loading Kisan-e-Mandi...
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/about" element={<About />} />
                <Route path="/learn-more" element={<Navigate to="/about" replace />} />

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
                <Route path="/blog/online-agricultural-marketplace" element={<Blog />}/>
              </Routes>
            </Suspense>
          </div>
        </LayoutWithNavbar>
      </CartProvider>
    </Router>
  );
};

export default App;
