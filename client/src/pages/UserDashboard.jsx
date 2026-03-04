import React from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-4">User Dashboard</h1>
                <p className="text-gray-600 mb-8">
                    Welcome to the customer portal. Here you can browse fresh produce, track your orders, and interact with the community.
                </p>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
