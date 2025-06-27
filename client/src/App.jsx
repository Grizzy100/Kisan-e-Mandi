import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import VendorDashboard from "./pages/VendorDasboard.jsx"; // ✅ match component name
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Fixed Private Route: checks localStorage
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <ToastContainer theme="dark" />
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
    </Router>
  );
};

export default App;
