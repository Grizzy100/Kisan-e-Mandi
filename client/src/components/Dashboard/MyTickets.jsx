import React, { useState, useEffect } from "react";
import { getUserTickets } from "../../api/supportAPI.js";

const STATUS_STYLES = {
    open: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
};

const STATUS_LABEL = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved",
};

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getUserTickets();
                setTickets(data);
            } catch (err) {
                console.error("Failed to load tickets:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!tickets.length) {
        return (
            <div className="text-center py-20">
                <div className="text-5xl mb-4">🎫</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No tickets yet</h3>
                <p className="text-sm text-gray-400">Your raised support tickets will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Support Tickets</h2>
            {tickets.map((ticket) => (
                <div
                    key={ticket._id}
                    className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden"
                >
                    {/* Ticket Header */}
                    <button
                        onClick={() => setExpanded(expanded === ticket._id ? null : ticket._id)}
                        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`text-xs px-2.5 py-0.5 rounded-sm font-medium ${STATUS_STYLES[ticket.status]}`}>
                                    {STATUS_LABEL[ticket.status]}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase tracking-tighter">
                                    {ticket.category}
                                </span>
                                {ticket.price && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-100 font-bold uppercase tracking-tighter">
                                        ₹{ticket.price.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>
                            <p className="font-bold text-gray-800 text-sm truncate">{ticket.subject}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase">
                                Raised on {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric",
                                })}
                            </p>
                        </div>
                        <span className="text-gray-400 text-lg mt-1 group-hover:text-gray-600 transition-colors">
                            {expanded === ticket._id ? "▲" : "▼"}
                        </span>
                    </button>

                    {/* Expanded Details */}
                    {expanded === ticket._id && (
                        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-gray-50/30">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                                    <p className="text-xs font-semibold text-gray-700">{ticket.category}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Asking Price</p>
                                    <p className="text-xs font-semibold text-emerald-700">₹{ticket.price?.toLocaleString("en-IN") || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Specifications</p>
                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{ticket.description}</p>
                            </div>
                            {ticket.imageUrl && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Attachment</p>
                                    <img src={ticket.imageUrl} alt="Ticket attachment" className="max-h-48 rounded-sm object-contain" />
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Ticket ID</p>
                                <p className="font-mono text-xs text-gray-500">{ticket._id}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyTickets;
