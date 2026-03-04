import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../config/firebase";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../components/ui/InputOTP";
import FarmerLogo from "../assets/farmer.png";
import Klogo from "../assets/KisanLogo.png";
import axiosInstance from "../api/axios";

const RESEND_COOLDOWN = 45;
const MAX_RESENDS = 3;

const redirectByRole = (user, navigate) => {
    if (user.role === "farmer" || user.role === "admin") {
        navigate("/vendor-portal");
    } else {
        navigate("/user-dashboard");
    }
};

const maskPhone = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    return phone.slice(0, -digits.length + 2) + "****" + digits.slice(-4);
};

export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    // ── Read state passed from Register / Login ──────────────────
    const {
        confirmationResult: initialConfirmation,
        phone,
        role,
        name,
        context = "register",
    } = location.state || {};

    // ── Guard: redirect if arrived without proper state ──────────
    useEffect(() => {
        if (!initialConfirmation || !phone) {
            toast.error("Session expired. Please start again.");
            navigate(context === "login" ? "/login" : "/register", { replace: true });
        }
    }, [initialConfirmation, phone, navigate, context]);

    const [otp, setOtp] = useState("");
    const [otpErr, setOtpErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
    const [resendCount, setResendCount] = useState(0);
    const [confirmationResult, setConfirmationResult] = useState(initialConfirmation);

    // Store the latest recaptchaVerifier so resend works
    const recaptchaVerifierRef = useRef(null);

    // ── Countdown Timer ──────────────────────────────────────────
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // ── Auto-submit when all 6 digits entered ────────────────────
    useEffect(() => {
        if (otp.length === 6 && !loading) {
            handleVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    // ── OTP Verification ─────────────────────────────────────────
    const handleVerify = useCallback(async () => {
        if (otp.length !== 6) {
            setOtpErr("Please enter all 6 digits.");
            return;
        }
        if (!confirmationResult) {
            toast.error("No active OTP session. Please resend OTP.");
            return;
        }

        setOtpErr("");
        setLoading(true);

        try {
            const userCredential = await confirmationResult.confirm(otp);
            const idToken = await userCredential.user.getIdToken();

            const res = await axiosInstance.post(`/auth/verify-phone`, {
                idToken, phone, role, name, context
            });
            const data = res.data;

            if (res.status === 200) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success(
                    context === "register" ? "Registered & logged in!" : "Logged in!"
                );
                redirectByRole(data.user, navigate);
            } else {
                // Backend-level rejection (e.g. phone already registered)
                setOtp("");
                toast.error(data.message || "Verification failed.");
                if (data.field === "phone" || res.status === 409) {
                    navigate("/register", { replace: true });
                } else if (res.status === 404) {
                    navigate("/login", { replace: true });
                }
            }
        } catch (err) {
            console.error("Verify OTP error:", err);
            setOtp("");
            const errMsg = {
                "auth/invalid-verification-code": "Incorrect OTP. Please try again.",
                "auth/code-expired": "OTP has expired. Please request a new one.",
                "auth/session-expired": "Session expired. Please request a new OTP.",
                "auth/too-many-requests": "Too many attempts. Please wait and try again.",
            }[err.code] || err.message || "Verification failed.";
            setOtpErr(errMsg);

            // Make resend immediately available if code is expired
            if (
                err.code === "auth/code-expired" ||
                err.code === "auth/session-expired"
            ) {
                setCountdown(0);
            }
        } finally {
            setLoading(false);
        }
    }, [otp, confirmationResult, phone, role, name, context, navigate]);

    // ── Resend OTP ───────────────────────────────────────────────
    const handleResend = async () => {
        if (countdown > 0 || resendCount >= MAX_RESENDS) return;

        // Re-initialize reCAPTCHA for resend
        try {
            // Clean up previous verifier if any
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }

            const { RecaptchaVerifier } = await import("firebase/auth");
            const verifier = new RecaptchaVerifier(auth, "recaptcha-resend", {
                size: "invisible",
            });
            recaptchaVerifierRef.current = verifier;

            setLoading(true);
            const result = await signInWithPhoneNumber(auth, phone, verifier);
            setConfirmationResult(result);
            setOtp("");
            setOtpErr("");
            setCountdown(RESEND_COOLDOWN);
            setResendCount((c) => c + 1);
            toast.success("New OTP sent!");
        } catch (err) {
            console.error("Resend OTP error:", err);
            const errMsg = {
                "auth/too-many-requests": "Too many attempts. Please wait a few minutes.",
                "auth/quota-exceeded": "SMS quota exceeded. Try again tomorrow.",
                "auth/captcha-check-failed": "reCAPTCHA failed. Please refresh.",
                "auth/billing-not-enabled": "SMS is not enabled on this Firebase project.",
            }[err.code] || "Failed to resend OTP.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const canResend = countdown === 0 && resendCount < MAX_RESENDS && !loading;
    const resendExhausted = resendCount >= MAX_RESENDS;

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-8 font-inria">
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">

                {/* ── LEFT: OTP Form ──────────────────────────────────── */}
                <div className="md:w-1/2 w-full p-10 flex flex-col justify-center">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-11 h-11 bg-green-600 rounded-md flex items-center justify-center">
                            <img src={Klogo} alt="Kisan Logo" className="h-7 w-auto" />
                        </div>
                        <h1 className="text-2xl font-bold text-green-700">Kisan-e-Mandi</h1>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">Verify your number</h2>
                    <p className="text-gray-500 text-sm mt-1 mb-2">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-green-700 font-semibold text-sm mb-8">
                        {maskPhone(phone)}
                    </p>

                    {/* OTP Input */}
                    <div className="flex justify-center mb-3">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(val) => {
                                setOtp(val);
                                setOtpErr("");
                            }}
                            disabled={loading}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {/* Inline error */}
                    {otpErr && (
                        <p className="text-xs text-red-500 text-center mb-4">{otpErr}</p>
                    )}

                    {/* Verify Button */}
                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6}
                        className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200
              ${loading || otp.length !== 6
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
                                Verifying...
                            </span>
                        ) : "Verify & Continue"}
                    </button>

                    {/* Resend Section */}
                    <div className="mt-5 text-center text-sm">
                        {resendExhausted ? (
                            <p className="text-red-500 text-xs">
                                Maximum resend limit reached. Please try again later or{" "}
                                <button
                                    onClick={() => navigate(context === "login" ? "/login" : "/register")}
                                    className="text-green-600 underline"
                                >
                                    go back
                                </button>.
                            </p>
                        ) : countdown > 0 ? (
                            <p className="text-gray-500 text-xs">
                                Resend code in{" "}
                                <span className="font-semibold text-green-700">{countdown}s</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={!canResend}
                                className="text-green-600 hover:underline text-xs font-medium"
                            >
                                Didn't receive it? Resend OTP
                                {resendCount > 0 && (
                                    <span className="ml-1 text-gray-400">
                                        ({MAX_RESENDS - resendCount} left)
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Back link */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() =>
                                navigate(context === "login" ? "/login" : "/register")
                            }
                            className="text-xs text-gray-400 hover:text-green-600 transition-colors"
                        >
                            ← Change phone number
                        </button>
                    </div>

                    {/* Invisible reCAPTCHA for resend */}
                    <div id="recaptcha-resend" />
                </div>

                {/* ── RIGHT: Illustration ─────────────────────────────── */}
                <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-green-100 p-8 gap-6">
                    <img
                        src={FarmerLogo}
                        alt="Farmer Illustration"
                        className="max-h-[320px] object-contain"
                    />
                    <div className="text-center">
                        <h3 className="text-green-800 font-semibold text-lg">
                            One step away!
                        </h3>
                        <p className="text-green-700 text-sm mt-1 opacity-80">
                            Check your SMS for the verification code.
                        </p>
                    </div>

                    {/* Progress indicators */}
                    <div className="flex gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < otp.length ? "bg-green-600 scale-110" : "bg-green-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
