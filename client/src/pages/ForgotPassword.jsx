import React, { useState } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import FarmerLogo from "../assets/farmer.png";
import Klogo from "../assets/KisanLogo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const validateEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateEmail(email);
        setEmailErr(err);
        if (err) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setSent(true);
            } else {
                // Google OAuth account — no password to reset
                if (res.status === 400 && data.message?.includes("Google")) {
                    toast.error(data.message);
                } else {
                    // Still show success UI — prevents email enumeration
                    setSent(true);
                }
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-8 font-inria">
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">

                {/* ── LEFT: Form ────────────────────────────────── */}
                <div className="md:w-1/2 w-full p-10 flex flex-col justify-center">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-11 h-11 bg-green-600 rounded-md flex items-center justify-center">
                            <img src={Klogo} alt="Kisan Logo" className="h-7 w-auto" />
                        </div>
                        <h1 className="text-2xl font-bold text-green-700">Kisan-e-Mandi</h1>
                    </div>

                    {!sent ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Forgot your password?
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 mb-8">
                                No worries. Enter your email and we'll send a reset link.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setEmailErr(validateEmail(e.target.value));
                                            }}
                                            className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl transition-colors
                        ${emailErr
                                                    ? "border-red-400 bg-red-50"
                                                    : email.includes("@")
                                                        ? "border-green-400"
                                                        : "border-gray-200"
                                                }`}
                                        />
                                    </div>
                                    {emailErr && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{emailErr}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200
                    ${loading
                                            ? "bg-green-300 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 active:scale-95"
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : "Send Reset Link"}
                                </button>
                            </form>

                            <p className="text-xs text-center text-gray-500 mt-6">
                                Remembered it?{" "}
                                <Link to="/login" className="text-green-600 hover:underline font-medium">
                                    Back to Sign In
                                </Link>
                            </p>
                        </>
                    ) : (
                        /* ── Success State ─────────────────────────── */
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-5">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-green-600 text-3xl" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Check your inbox!
                            </h2>
                            <p className="text-gray-500 text-sm mb-1">
                                If <span className="font-medium text-gray-700">{email}</span>{" "}
                                is registered, a reset link has been sent.
                            </p>
                            <p className="text-gray-400 text-xs mb-8">
                                The link expires in <strong>15 minutes</strong>. Check your spam folder too.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-3 px-8 rounded-xl transition-all active:scale-95"
                            >
                                Back to Sign In
                            </Link>
                            <p className="text-xs text-gray-400 mt-5">
                                Didn't receive it?{" "}
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-green-600 hover:underline"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Illustration ──────────────────────── */}
                <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-green-100 p-8 gap-4">
                    <img
                        src={FarmerLogo}
                        alt="Farmer Illustration"
                        className="max-h-[360px] object-contain"
                    />
                    <p className="text-center text-green-800 font-medium text-sm opacity-80">
                        We'll help you get back in quickly.
                    </p>
                </div>

            </div>
        </div>
    );
}
