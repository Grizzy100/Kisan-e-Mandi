import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { MdCheckCircle, MdCancel, MdRefresh, MdImageSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_COLORS = {
    open: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_LABELS = {
    open: "Pending",
    "in-progress": "In Progress",
    resolved: "Approved",
    rejected: "Rejected",
};

export default function TicketsPanel() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("open");
    const [processing, setProcessing] = useState(null);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/support/all");
            setTickets(res.data);
        } catch (err) {
            // Fallback: use my-tickets if all endpoint doesn't exist yet
            console.error("Fetch tickets error:", err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    const handleAction = async (ticketId, status, itemId) => {
        setProcessing(ticketId);
        try {
            await axiosInstance.patch(`/support/${ticketId}/status`, { status, itemId });
            toast.success(`Ticket ${status === "resolved" ? "approved ✅" : "rejected ❌"}`);
            fetchTickets();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setProcessing(null);
        }
    };

    const filtered = tickets.filter((t) => filter === "all" ? true : t.status === filter);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Crop Verification Tickets</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Approve or reject farmer crop listings.</p>
                </div>
                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl hover:bg-gray-700 transition"
                >
                    <MdRefresh className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {[["open", "Pending"], ["resolved", "Approved"], ["rejected", "Rejected"], ["all", "All"]].map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${filter === value
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tickets list */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-2xl h-24 animate-pulse border border-gray-700" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MdImageSearch className="w-12 h-12 text-gray-600 mb-3" />
                    <p className="text-gray-400 font-medium">No {filter} tickets</p>
                    <p className="text-gray-600 text-sm mt-1">Farmers' crop requests will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((ticket) => (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    {/* Media preview */}
                                    {ticket.mediaUrl && (
                                        <img
                                            src={ticket.mediaUrl}
                                            alt={ticket.subject}
                                            className="w-full sm:w-24 h-24 object-cover rounded-xl border border-gray-700 flex-shrink-0"
                                        />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start gap-2 mb-1.5">
                                            <h3 className="text-white font-semibold text-sm truncate">{ticket.subject}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_COLORS[ticket.status]}`}>
                                                {STATUS_LABELS[ticket.status] || ticket.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs mb-2 line-clamp-2">{ticket.description}</p>
                                        <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
                                            <span>📧 {ticket.email}</span>
                                            <span>💰 ₹{ticket.price}</span>
                                            <span>🏷 {ticket.category}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {ticket.status === "open" && (
                                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleAction(ticket._id, "resolved", ticket.itemId)}
                                                disabled={processing === ticket._id}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
                                            >
                                                <MdCheckCircle className="w-4 h-4" />
                                                {processing === ticket._id ? "…" : "Approve"}
                                            </button>
                                            <button
                                                onClick={() => handleAction(ticket._id, "rejected", ticket.itemId)}
                                                disabled={processing === ticket._id}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition disabled:opacity-50"
                                            >
                                                <MdCancel className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
