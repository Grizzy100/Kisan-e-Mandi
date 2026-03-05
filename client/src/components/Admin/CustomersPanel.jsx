import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { MdBlock, MdCheckCircle, MdRefresh, MdPeople, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function CustomersPanel() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/users?role=customer");
            setCustomers(res.data);
        } catch (err) {
            console.error("Customers fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleSuspend = async (id, isSuspended) => {
        setProcessing(id);
        try {
            await axiosInstance.patch(`/users/${id}/suspend`);
            toast.success(isSuspended ? "User unsuspended" : "User suspended");
            fetchCustomers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Permanently delete "${name}" and all their data? This cannot be undone.`)) return;
        setProcessing(id);
        try {
            const res = await axiosInstance.delete(`/users/${id}`);
            toast.success(res.data.message || "User deleted");
            fetchCustomers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Customers</h1>
                    <p className="text-gray-400 text-sm mt-0.5">View and control all registered buyers.</p>
                </div>
                <button
                    onClick={fetchCustomers}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl hover:bg-gray-700 transition"
                >
                    <MdRefresh className="w-4 h-4" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl h-16 animate-pulse border border-gray-700" />
                    ))}
                </div>
            ) : customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MdPeople className="w-12 h-12 text-gray-600 mb-3" />
                    <p className="text-gray-400 font-medium">No customers yet</p>
                    <p className="text-gray-600 text-sm mt-1">Customer accounts will appear here after registration.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {customers.map((u) => (
                        <motion.div
                            key={u._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">{u.name?.[0]?.toUpperCase() || "?"}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{u.name || "—"}</p>
                                <p className="text-gray-400 text-xs truncate">{u.email || u.phone}</p>
                            </div>
                            {u.isSuspended && (
                                <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-full uppercase">
                                    Suspended
                                </span>
                            )}
                            <p className="text-gray-600 text-xs hidden sm:block">
                                {new Date(u.createdAt).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => handleSuspend(u._id, u.isSuspended)}
                                disabled={processing === u._id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 ${u.isSuspended
                                        ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20"
                                        : "bg-red-600/10 border-red-500/20 text-red-400 hover:bg-red-600/20"
                                    }`}
                            >
                                {processing === u._id ? "…" : u.isSuspended ? <><MdCheckCircle className="w-3.5 h-3.5" /> Unsuspend</> : <><MdBlock className="w-3.5 h-3.5" /> Suspend</>}
                            </button>
                            <button
                                onClick={() => handleDelete(u._id, u.name || u.email || u.phone)}
                                disabled={processing === u._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-red-900/40 hover:text-red-400 hover:border-red-500/40"
                                title="Delete user permanently"
                            >
                                <MdDeleteForever className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
