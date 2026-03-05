import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { MdBlock, MdCheckCircle, MdRefresh, MdStore, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const UserTable = ({ users, onSuspend, onDelete, processing, title, emptyText, icon: Icon }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-emerald-400" />
                <h2 className="text-white font-semibold">{title}</h2>
                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">{users.length}</span>
            </div>
        </div>
        {users.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">{emptyText}</p>
        ) : (
            <div className="space-y-2">
                {users.map((u) => (
                    <motion.div
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">{u.name?.[0]?.toUpperCase() || "?"}</span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{u.name || "—"}</p>
                            <p className="text-gray-400 text-xs truncate">{u.email || u.phone}</p>
                        </div>
                        {/* Status badge */}
                        {u.isSuspended && (
                            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                Suspended
                            </span>
                        )}
                        {/* Date */}
                        <p className="text-gray-600 text-xs hidden sm:block">
                            {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                        {/* Suspend toggle */}
                        <button
                            onClick={() => onSuspend(u._id, u.isSuspended)}
                            disabled={processing === u._id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 ${u.isSuspended
                                    ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20"
                                    : "bg-red-600/10 border-red-500/20 text-red-400 hover:bg-red-600/20"
                                }`}
                        >
                            {processing === u._id ? (
                                "…"
                            ) : u.isSuspended ? (
                                <><MdCheckCircle className="w-3.5 h-3.5" /> Unsuspend</>
                            ) : (
                                <><MdBlock className="w-3.5 h-3.5" /> Suspend</>
                            )}
                        </button>
                        {/* Delete */}
                        <button
                            onClick={() => onDelete(u._id, u.name || u.email || u.phone)}
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

export default function VendorsPanel() {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/users?role=farmer");
            setFarmers(res.data);
        } catch (err) {
            console.error("Farmers fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFarmers(); }, []);

    const handleSuspend = async (id, isSuspended) => {
        setProcessing(id);
        try {
            await axiosInstance.patch(`/users/${id}/suspend`);
            toast.success(isSuspended ? "User unsuspended" : "User suspended");
            fetchFarmers();
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
            fetchFarmers();
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
                    <h1 className="text-2xl font-bold text-white">Manage Vendors</h1>
                    <p className="text-gray-400 text-sm mt-0.5">View and control all registered farmers.</p>
                </div>
                <button
                    onClick={fetchFarmers}
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
            ) : (
                <UserTable
                    users={farmers}
                    onSuspend={handleSuspend}
                    onDelete={handleDelete}
                    processing={processing}
                    title="Registered Farmers"
                    emptyText="No farmers registered yet."
                    icon={MdStore}
                />
            )}
        </div>
    );
}
