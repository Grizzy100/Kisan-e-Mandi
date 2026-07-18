import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FarmerLogo from "../assets/farmer.png";
import Klogo from "../assets/KisanLogo.png";
import axiosInstance from "../api/axios";

// Redirects logged-in users to the correct dashboard depending on whether they are an Admin or a User/Farmer
const redirectByRole = (user, navigate) => {
  if (user.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/dashboard");
  }
};

const Login = () => {
  const navigate = useNavigate();

  // authMethod is now static because phone login is commented out
  const authMethod = "email";
  const role = "customer"; // role is static for login, no switcher on page

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation state
  const [emailErr, setEmailErr] = useState("");
  const [verifyError, setVerifyError] = useState(false); // 403 — email not verified
  const [resendLoading, setResendLoading] = useState(false);

  // Validates if the email address follows a correct standard format
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address";

  // Sends a POST request to authentication endpoints on the backend server
  const post = async (endpoint, body) => {
    try {
      const res = await axiosInstance.post(`/auth/${endpoint}`, body);
      return { ok: true, data: res.data };
    } catch (error) {
      return { ok: false, data: error.response?.data || { message: "Network error" } };
    }
  };

  // Sends a POST request and tries again once after 1.5 seconds if a network error/timeout occurs
  const postWithSingleRetry = async (endpoint, body) => {
    const firstTry = await post(endpoint, body);
    if (firstTry.ok) return firstTry;

    const msg = (firstTry.data?.message || "").toLowerCase();
    const shouldRetry = msg.includes("network") || msg.includes("timeout");
    if (!shouldRetry) return firstTry;

    await new Promise((resolve) => setTimeout(resolve, 1500));
    return post(endpoint, body);
  };

  /* EMAIL LOGIN */

  // Submits the email/password form to log the user in
  const handleLogin = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    setEmailErr(eErr);
    if (eErr || !password) {
      if (!password) toast.error("Password is required");
      return;
    }

    setVerifyError(false);
    setLoading(true);
    const { ok, data } = await post("login", { email, password });
    setLoading(false);

    if (ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in!");
      redirectByRole(data.user, navigate);
    } else if (!ok && data?.message?.toLowerCase().includes("verify your email")) {
      setVerifyError(true);
    } else {
      toast.error(data.message || "Login failed");
    }
  };

  // Calls the backend to resend a verification email link if the user tries to log in without verifying
  const handleResendVerification = async () => {
    if (!email) { toast.error("Enter your email address first."); return; }
    setResendLoading(true);
    try {
      const res = await axiosInstance.post("/auth/resend-verification", { email });
      toast.success(res.data?.message || "Verification email sent! Check your inbox.");
      setVerifyError(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };



  // Sends the Google OAuth token received from Google Login to our backend for session creation
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const { ok, data } = await postWithSingleRetry("google", {
      credential: credentialResponse.credential,
      role, // passed just in case they are a new user
    });
    setLoading(false);

    if (ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Google sign-in successful");
      redirectByRole(data.user, navigate);
    } else {
      toast.error(data.message || "Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-8 font-inria">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 w-full p-10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-green-600 rounded-md flex items-center justify-center">
              <img src={Klogo} alt="Kisan Logo" className="h-7 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">
              Kisan-e-Mandi
            </h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mt-1 mb-8">
            Sign in to continue
          </p>

          {/* Animated Forms Container */}
          <div className="relative">

            {/* EMAIL FORM */}
            <div
              className={`pb-1 transition-all duration-300 ease-in-out ${authMethod === "email"
                ? "relative opacity-100 translate-x-0 z-10"
                : "absolute inset-0 opacity-0 -translate-x-4 pointer-events-none z-0"
                }`}
            >
              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >

                <div>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailErr(validateEmail(e.target.value)); }}
                      className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl ${emailErr ? "border-red-400 bg-red-50" : email.includes("@") ? "border-green-400" : "border-gray-200"}`}
                    />
                  </div>
                  {emailErr && <p className="text-xs text-red-500 mt-1 ml-1">{emailErr}</p>}
                </div>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="text-right -mt-2">
                  <Link to="/forgot-password" className="text-xs text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {verifyError && (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800 space-y-2">
                    <p className="font-semibold">📧 Email not verified</p>
                    <p className="text-xs">Please verify your email before logging in. Check your inbox or resend the link below.</p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {resendLoading ? "Sending..." : "Resend Verification Email"}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm"
                >
                  {loading ? "Please wait..." : "Sign In"}
                </button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-600 hover:underline cursor-pointer">
                  Register
                </Link>
              </p>
            </div>



          </div>

          <div className="my-1 text-center text-xs text-gray-400">
            or continue with
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-green-100 p-8">
          <img
            src={FarmerLogo}
            alt="Farmer Illustration"
            className="max-h-[420px] object-contain"
          />
        </div>

      </div>

    </div>
  );
};

export default Login;