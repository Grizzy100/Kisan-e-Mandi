import React, { useState } from "react";
import TicketsPanel from "./TicketsPanel";
import AdminApproval from "../Dashboard/AdminApproval";

export default function AdminApprovalDashboard() {
  const [tab, setTab] = useState("tickets");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Approval Dashboard</h1>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition border-b-4 ${tab === "tickets" ? "border-emerald-500 bg-gray-800" : "border-transparent bg-gray-800/60 hover:bg-gray-800"}`}
            onClick={() => setTab("tickets")}
          >
            Crop Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition border-b-4 ${tab === "posts" ? "border-orange-500 bg-gray-800" : "border-transparent bg-gray-800/60 hover:bg-gray-800"}`}
            onClick={() => setTab("posts")}
          >
            Community Posts
          </button>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          {tab === "tickets" ? <TicketsPanel /> : <AdminApproval />}
        </div>
      </div>
    </div>
  );
}
