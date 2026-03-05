import React, { useState, useRef, useEffect } from "react";
import {
    FaEnvelope,
    FaPhone,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaUser,
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
    if (user.role === "admin") navigate("/admin/dashboard");
    else navigate("/dashboard");
};

const Register = () => {
    const navigate = useNavigate();

    const [authMethod, setAuthMethod] = useState("email");
    const [role, setRole] = useState("customer");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const recaptchaVerifierRef = useRef(null);

    // Validation state
    const [nameErr, setNameErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [pwdErr, setPwdErr] = useState("");
    const [phoneErr, setPhoneErr] = useState("");
    const [otpErr, setOtpErr] = useState("");
    // Availability state (server-side duplicate checks)
    const [emailTaken, setEmailTaken] = useState("");  // "" | "checking" | error msg
    const [phoneTaken, setPhoneTaken] = useState("");

    const validateName = (v) => v.trim().length >= 2 ? "" : "Name must be at least 2 characters";
    const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address";
    const validatePwd = (v) => v.length >= 6 ? "" : "Password must be at least 6 characters";
    const validateOtp = (v) => /^\d{6}$/.test(v) ? "" : "OTP must be exactly 6 digits";
    const validatePhone = (v) => {
        const formatted = formatPhone(v);
        return /^\+[1-9]\d{7,14}$/.test(formatted) ? "" : "Enter a valid phone number (e.g. 9876543210 or +919876543210)";
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

    const checkAvailability = async (type, value) => {
        const setter = type === "email" ? setEmailTaken : setPhoneTaken;
        setter("checking");
        try {
            const res = await axiosInstance.post("/auth/check-availability", { type, value });
            setter(res.data.available ? "" : res.data.message || "Already registered");
        } catch {
            setter(""); // Don't block on network error
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const nErr = validateName(name);
        const eErr = validateEmail(email);
        const pErr = validatePwd(password);
        setNameErr(nErr); setEmailErr(eErr); setPwdErr(pErr);
        if (nErr || eErr || pErr || emailTaken) return;

        setLoading(true);
        const { ok, data } = await post("register", {
            name,
            email,
            password,
            role,
        });
        setLoading(false);

        if (ok) {
            toast.success(data.message || "Registered! Please check your email to verify your account.");
            navigate("/login");
        } else {
            toast.error(data.message || "Registration failed");
        }
    };

    /* PHONE OTP — Firebase */
    // Normalize to E.164 format (+91XXXXXXXXXX)
    const formatPhone = (raw) => {
        let num = raw.trim().replace(/[\s\-().]/g, "");
        // Already has + sign
        if (num.startsWith("+")) return num;
        // Remove leading 0
        if (num.startsWith("0")) num = num.slice(1);
        // Prepend India country code by default
        return "+91" + num;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const nErr = validateName(name);
        const phErr = validatePhone(phone);
        setNameErr(nErr); setPhoneErr(phErr);
        if (nErr || phErr || phoneTaken) return;

        const formattedPhone = formatPhone(phone);

        setLoading(true);
        try {
            const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
            setIsOtpSent(true);
            navigate("/verify-otp", {
                state: { confirmationResult: result, phone: formattedPhone, role, name, context: "register" },
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

            const res = await fetch(`${API_URL}/api/auth/verify-phone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken, phone: formattedPhone, role, name, context: "register" }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success("Registered & logged in!");
                redirectByRole(data.user, navigate);
            } else {
                toast.error(data.message || "Registration failed");
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
            role,
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
                        <h1 className="text-2xl font-bold text-green-700">Kisan-e-Mandi</h1>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">Create an account</h2>
                    <p className="text-gray-500 text-sm mt-1 mb-8">Join the community today</p>

                    {/* Role Toggle */}
                    <div className="mb-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setRole(role === "farmer" ? "customer" : "farmer")}
                            className="relative w-[190px] h-9 rounded-lg bg-gray-100 border border-gray-200"
                        >
                            <div
                                className={`absolute top-[3px] left-[3px] h-[30px] w-[92px] rounded-lg bg-white shadow transition-all duration-300 ease-in-out ${role === "farmer" ? "translate-x-[92px]" : ""
                                    }`}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-5 text-xs font-medium">
                                <span className={role === "customer" ? "text-gray-900" : "text-gray-400"}>
                                    Buyer
                                </span>
                                <span className={role === "farmer" ? "text-gray-900" : "text-gray-400"}>
                                    Farmer
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Animated Email / Phone Tabs
                    <div className="mb-6">
                        <div className="relative flex bg-gray-100 rounded-lg p-1 overflow-hidden">
                            <div
                                className={`absolute top-1 bottom-1 w-1/2 bg-white shadow rounded-lg transition-all duration-300 ease-in-out ${authMethod === "phone" ? "translate-x-full" : ""
                                    }`}
                            />

                            <button
                                onClick={() => {
                                    setAuthMethod("email");
                                    setIsOtpSent(false);
                                }}
                                className={`relative z-10 flex-1 py-1.5 text-xs font-medium transition-colors duration-300 ${authMethod === "email" ? "text-gray-900" : "text-gray-500"
                                    }`}
                            >
                                Email
                            </button>

                            <button
                                onClick={() => {
                                    setAuthMethod("phone");
                                    setIsOtpSent(false);
                                }}
                                className={`relative z-10 flex-1 py-1.5 text-xs font-medium transition-colors duration-300 ${authMethod === "phone" ? "text-gray-900" : "text-gray-500"
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
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); setNameErr(validateName(e.target.value)); }}
                                            className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl ${nameErr ? "border-red-400 bg-red-50" : name.length >= 2 ? "border-green-400" : "border-gray-200"}`}
                                        />
                                    </div>
                                    {nameErr && <p className="text-xs text-red-500 mt-1 ml-1">{nameErr}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setEmailErr(validateEmail(e.target.value)); setEmailTaken(""); }}
                                            onBlur={(e) => { if (!validateEmail(e.target.value)) return; checkAvailability("email", e.target.value); }}
                                            className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl ${emailErr || emailTaken ? "border-red-400 bg-red-50" : email.includes("@") ? "border-green-400" : "border-gray-200"}`}
                                        />
                                    </div>
                                    {emailErr && <p className="text-xs text-red-500 mt-1 ml-1">{emailErr}</p>}
                                    {!emailErr && emailTaken === "checking" && <p className="text-xs text-gray-400 mt-1 ml-1">Checking...</p>}
                                    {!emailErr && emailTaken && emailTaken !== "checking" && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{emailTaken} <a href="/login" className="underline text-green-600">Sign in?</a></p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            placeholder="Create Password (min. 6 chars)"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setPwdErr(validatePwd(e.target.value)); }}
                                            className={`w-full pl-10 pr-10 py-3 text-sm border rounded-xl ${pwdErr ? "border-red-400 bg-red-50" : password.length >= 6 ? "border-green-400" : "border-gray-200"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(!showPwd)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPwd ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {pwdErr
                                        ? <p className="text-xs text-red-500 mt-1 ml-1">{pwdErr}</p>
                                        : password.length > 0 && <p className="text-xs text-green-600 mt-1 ml-1">Looks good!</p>
                                    }
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm"
                                >
                                    {loading ? "Please wait..." : "Create Account"}
                                </button>
                            </form>

                            <p className="text-xs text-center text-gray-500 mt-4 cursor-pointer">
                                Already have an account?{" "}
                                <Link to="/login" className="text-green-600 hover:underline">
                                    Sign in
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
                            <>
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    {/* Name Field */}
                                    <div>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={(e) => { setName(e.target.value); setNameErr(validateName(e.target.value)); }}
                                                className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl ${nameErr ? "border-red-400 bg-red-50" : name.length >= 2 ? "border-green-400" : "border-gray-200"}`}
                                            />
                                        </div>
                                        {nameErr && <p className="text-xs text-red-500 mt-1 ml-1">{nameErr}</p>}
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                type="tel"
                                                placeholder="Phone (e.g. 9876543210)"
                                                value={phone}
                                                onChange={(e) => { setPhone(e.target.value); setPhoneErr(validatePhone(e.target.value)); setPhoneTaken(""); }}
                                                onBlur={(e) => { const err = validatePhone(e.target.value); if (err) return; checkAvailability("phone", formatPhone(e.target.value)); }}
                                                className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl ${phoneErr || phoneTaken ? "border-red-400 bg-red-50" : phone.length >= 10 ? "border-green-400" : "border-gray-200"}`}
                                            />
                                        </div>
                                        {phoneErr
                                            ? <p className="text-xs text-red-500 mt-1 ml-1">{phoneErr}</p>
                                            : phoneTaken === "checking"
                                                ? <p className="text-xs text-gray-400 mt-1 ml-1">Checking...</p>
                                                : phoneTaken
                                                    ? <p className="text-xs text-red-500 mt-1 ml-1">{phoneTaken} <a href="/login" className="underline text-green-600">Sign in?</a></p>
                                                    : <p className="text-xs text-gray-400 mt-1 ml-1">Country code added automatically. Include +1, +44, etc. for other countries.</p>
                                        }
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm"
                                    >
                                        {loading ? "Sending..." : "Send OTP"}
                                    </button>
                                </form>
                            </>
                        </div>
                    </div>

                    <div className="my-1 text-center text-xs text-gray-400">or continue with</div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google registration failed")}
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center bg-green-100 p-8">
                    <img src={FarmerLogo} alt="Farmer Illustration" className="max-h-[420px] object-contain" />
                </div>
            </div>
            {/* Invisible reCAPTCHA container required by Firebase */}
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Register;
