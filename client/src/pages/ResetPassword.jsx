import React, { useState, useEffect } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import FarmerLogo from "../assets/farmer.png";
import Klogo from "../assets/KisanLogo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Password strength: returns { score: 0‑4, label, color }
const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9!@#$%^&*]/.test(pwd)) score++;
    const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
    return { score, label: labels[score], color: colors[score] };
};

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    // Validation state
    const [pwdErr, setPwdErr] = useState("");
    const [confirmErr, setConfirmErr] = useState("");

    const strength = getStrength(newPassword);

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid or missing reset link.");
            navigate("/login", { replace: true });
        }
    }, [token, email, navigate]);

    const validatePwd = (v) =>
        v.length >= 6 ? "" : "Password must be at least 6 characters";
    const validateConfirm = (v, ref) =>
        v === ref ? "" : "Passwords do not match";

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pErr = validatePwd(newPassword);
        const cErr = validateConfirm(confirm, newPassword);
        setPwdErr(pErr);
        setConfirmErr(cErr);
        if (pErr || cErr) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setDone(true);
            } else {
                toast.error(data.message || "Reset failed. The link may have expired.");
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

                {/* ── LEFT: Form ── */}
                <div className="md:w-1/2 w-full p-10 flex flex-col justify-center">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-11 h-11 bg-green-600 rounded-md flex items-center justify-center">
                            <img src={Klogo} alt="Kisan Logo" className="h-7 w-auto" />
                        </div>
                        <h1 className="text-2xl font-bold text-green-700">Kisan-e-Mandi</h1>
                    </div>

                    {!done ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Set a new password
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 mb-8">
                                Resetting for{" "}
                                <span className="font-medium text-gray-700">{email}</span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* New Password */}
                                <div>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            placeholder="New password (min. 6 chars)"
                                            autoComplete="new-password"
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setPwdErr(validatePwd(e.target.value));
                                                if (confirm) setConfirmErr(validateConfirm(confirm, e.target.value));
                                            }}
                                            className={`w-full pl-10 pr-10 py-3 text-sm border rounded-xl transition-colors
                        ${pwdErr
                                                    ? "border-red-400 bg-red-50"
                                                    : newPassword.length >= 6
                                                        ? "border-green-400"
                                                        : "border-gray-200"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(!showPwd)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPwd ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    {/* Password Strength Bar */}
                                    {newPassword.length > 0 && (
                                        <div className="mt-2">
                                            <div className="flex gap-1">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength.score ? strength.color : "bg-gray-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className={`text-xs mt-1 ml-1 font-medium
                        ${strength.score <= 1 ? "text-red-500"
                                                    : strength.score === 2 ? "text-yellow-600"
                                                        : strength.score === 3 ? "text-blue-600"
                                                            : "text-green-600"
                                                }`}
                                            >
                                                {strength.label}
                                            </p>
                                        </div>
                                    )}
                                    {pwdErr && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{pwdErr}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            autoComplete="new-password"
                                            value={confirm}
                                            onChange={(e) => {
                                                setConfirm(e.target.value);
                                                setConfirmErr(validateConfirm(e.target.value, newPassword));
                                            }}
                                            className={`w-full pl-10 pr-10 py-3 text-sm border rounded-xl transition-colors
                        ${confirmErr
                                                    ? "border-red-400 bg-red-50"
                                                    : confirm && confirm === newPassword
                                                        ? "border-green-400"
                                                        : "border-gray-200"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {confirmErr && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{confirmErr}</p>
                                    )}
                                    {!confirmErr && confirm && confirm === newPassword && (
                                        <p className="text-xs text-green-600 mt-1 ml-1">Passwords match ✓</p>
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
                                            Resetting...
                                        </span>
                                    ) : "Reset Password"}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* ── Success State ── */
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-5">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-green-600 text-3xl" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Password reset!
                            </h2>
                            <p className="text-gray-500 text-sm mb-8">
                                Your password has been updated. You can now sign in with your new password.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-3 px-8 rounded-xl transition-all active:scale-95"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Illustration ── */}
                <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-green-100 p-8 gap-4">
                    <img
                        src={FarmerLogo}
                        alt="Farmer Illustration"
                        className="max-h-[360px] object-contain"
                    />
                    <p className="text-center text-green-800 font-medium text-sm opacity-80">
                        Choose a strong password to keep your account safe.
                    </p>
                </div>
            </div>
        </div>
    );
}
