import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    // If already logged in as admin, redirect immediately
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const u = JSON.parse(storedUser);
                if (u.role === "admin" && localStorage.getItem("token")) {
                    navigate("/admin/dashboard", { replace: true });
                }
            } catch { /* ignore malformed user data */ }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }
        setLoading(true);
        try {
            console.log("[AdminLogin] Submitting to /auth/admin-login");
            const res = await axiosInstance.post("/auth/admin-login", { email, password });
            const { token, user } = res.data;
            console.log("[AdminLogin] Success! Received user:", user.role);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success(`Welcome, ${user.name} 🛡️`);
            navigate("/admin/dashboard");
        } catch (err) {
            console.log("[AdminLogin] API Error:", err.response?.data);
            const msg = err.response?.data?.message || "Login failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-950 font-inria">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 relative overflow-hidden p-12">
                {/* Glow orb */}
                <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl top-1/4 -left-20" />
                <div className="absolute w-64 h-64 bg-teal-400/5 rounded-full blur-2xl bottom-10 right-10" />

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-600/20 border border-emerald-500/30 mb-8 backdrop-blur-sm">
                        <MdAdminPanelSettings className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Kisan-e-Mandi</h1>
                    <p className="text-emerald-400 font-semibold text-lg mb-2">Administrator Portal</p>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                        Manage crop listings, verify farmers, and regulate platform activity from one authoritative hub.
                    </p>

                    <div className="mt-12 space-y-4 text-left">
                        {[
                            "Review & approve crop enlistment requests",
                            "Manage farmer and customer accounts",
                            "Monitor platform-wide analytics",
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right login form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-950">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
                            <FaShieldAlt className="w-3 h-3" />
                            Restricted Access
                        </div>
                        <h2 className="text-3xl font-bold text-white">Admin Sign In</h2>
                        <p className="text-gray-400 mt-2 text-sm">
                            This portal is reserved for authorised administrators only.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Admin Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@kisan-e-mandi.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/40 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating…
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt className="w-4 h-4" />
                                    Sign In as Admin
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-600 text-xs mt-8">
                        Not an admin?{" "}
                        <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                            Go to main login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
