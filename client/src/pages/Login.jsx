import React, { useState, useRef, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { auth } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import FarmerLogo from "../assets/farmer.png";
import Klogo from "../assets/KisanLogo.png";
import axiosInstance from "../api/axios";

const redirectByRole = (user, navigate) => {
  if (user.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/dashboard");
  }
};

const Login = () => {
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState("email");
  const [role, setRole] = useState("customer");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef(null);

  // Validation state
  const [phoneErr, setPhoneErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [verifyError, setVerifyError] = useState(false); // 403 — email not verified
  const [resendLoading, setResendLoading] = useState(false);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address";
  const validateOtp = (v) => /^\d{6}$/.test(v) ? "" : "OTP must be exactly 6 digits";
  const validatePhone = (v) => {
    const formatted = formatPhone(v);
    return /^\+[1-9]\d{7,14}$/.test(formatted) ? "" : "Enter a valid phone number (e.g. 9876543210)";
  };

  // Initialize reCAPTCHA once on mount, clean up on unmount
  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    recaptchaVerifierRef.current = verifier;
    return () => {
      verifier.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const post = async (endpoint, body) => {
    try {
      const res = await axiosInstance.post(`/auth/${endpoint}`, body);
      return { ok: true, data: res.data };
    } catch (error) {
      return { ok: false, data: error.response?.data || { message: "Network error" } };
    }
  };

  /* EMAIL LOGIN */

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

  /* PHONE OTP — Firebase */

  // Normalize to E.164 format (+91XXXXXXXXXX)
  const formatPhone = (raw) => {
    let num = raw.trim().replace(/[\s\-().]/g, "");
    if (num.startsWith("+")) return num;
    if (num.startsWith("0")) num = num.slice(1);
    return "+91" + num;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const phErr = validatePhone(phone);
    setPhoneErr(phErr);
    if (phErr) return;

    const formattedPhone = formatPhone(phone);

    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
      navigate("/verify-otp", {
        state: { confirmationResult: result, phone: formattedPhone, role, context: "login" },
      });

    } catch (error) {
      console.error("Send OTP error:", error);
      const msg = {
        "auth/billing-not-enabled": "SMS is not enabled on this Firebase project. Enable billing or use a test number.",
        "auth/invalid-phone-number": "Invalid phone number format.",
        "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
        "auth/quota-exceeded": "SMS quota exceeded for today. Try again tomorrow.",
        "auth/captcha-check-failed": "reCAPTCHA failed. Refresh the page and try again.",
        "auth/network-request-failed": "Network error. Check your connection.",
      }[error.code] || error.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const oErr = validateOtp(otp);
    setOtpErr(oErr);
    if (oErr) return;
    if (!confirmationResult) return toast.error("Please request OTP first");

    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      const formattedPhone = formatPhone(phone);

      const res = await axiosInstance.post(`/auth/verify-phone`, {
        idToken, phone: formattedPhone, role, context: "login"
      });
      const data = res.data;

      if (res.status === 200) {
        if (data.isNewUser) {
          toast.info("No account found for this number. Please register first.");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Logged in!");
        redirectByRole(data.user, navigate);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      const msg = {
        "auth/invalid-verification-code": "Incorrect OTP. Please check and try again.",
        "auth/code-expired": "OTP has expired. Please request a new one.",
        "auth/session-expired": "Session expired. Please request a new OTP.",
      }[error.code] || error.message || "Verification failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const { ok, data } = await post("google", {
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
      toast.error("Google login failed");
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

          {/* Animated Email / Phone Tabs */}
          {/* <div className="mb-8">
            <div className="relative flex bg-gray-100 rounded-xl p-1 overflow-hidden">
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-white shadow rounded-xl transition-all duration-300 ease-in-out ${authMethod === "phone" ? "translate-x-full" : ""
                  }`}
              />

              <button
                onClick={() => {
                  setAuthMethod("email");
                  setIsOtpSent(false);
                }}
                className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors duration-300 ${authMethod === "email" ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                Email
              </button>

              <button
                onClick={() => {
                  setAuthMethod("phone");
                  setIsOtpSent(false);
                }}
                className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors duration-300 ${authMethod === "phone" ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                Phone OTP
              </button>
            </div>
          </div> */}

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

            {/* PHONE FORM */}
            <div
              className={`transition-all duration-300 ease-in-out ${authMethod === "phone"
                ? "relative opacity-100 translate-x-0 z-10"
                : "absolute inset-0 opacity-0 translate-x-4 pointer-events-none z-0"
                }`}
            >
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="tel"
                      placeholder="Phone (e.g. 9876543210)"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneErr(validatePhone(e.target.value)); }}
                      className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl ${phoneErr ? "border-red-400 bg-red-50" : phone.length >= 10 ? "border-green-400" : "border-gray-200"}`}
                    />
                  </div>
                  {phoneErr
                    ? <p className="text-xs text-red-500 mt-1 ml-1">{phoneErr}</p>
                    : <p className="text-xs text-gray-400 mt-1 ml-1">+91 added automatically. Use +1, +44, etc. for other countries.</p>
                  }
                </div>

                <p className="text-xs text-gray-400 text-center">
                  New here?{" "}
                  <Link to="/register" className="text-green-600 hover:underline">Create an account</Link>
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
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
      {/* Invisible reCAPTCHA container required by Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;