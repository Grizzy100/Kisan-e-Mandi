export default function AdminOverview() {
    const stats = [
        { label: "Total Users", value: "1,245", icon: MdPeople, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Pending Approvals", value: "12", icon: MdPendingActions, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Active Orders", value: "348", icon: MdLocalShipping, color: "text-green-600", bg: "bg-green-50" },
        { label: "Revenue (Mtd)", value: "₹45,200", icon: MdAttachMoney, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Admin</h1>
                <p className="text-gray-500 text-sm">Real-time insights across users, listings, and revenue streams.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-sm p-4 border border-gray-100 flex items-center gap-4 transition-all shadow-sm">
                        <div className={`p-3 rounded-sm transition-colors ${stat.bg} ${stat.color} border border-white/50`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Activity Logs */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900">System Activity</h2>
                        <button className="text-xs font-bold text-green-700 hover:underline">VIEW ALL LOGS</button>
                    </div>
                    <div className="bg-white rounded-sm border border-gray-100 divide-y divide-gray-50">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                <div className="w-9 h-9 rounded-sm bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                                    <span className="text-gray-400 text-[9px] font-bold group-hover:text-green-600 transition-colors uppercase">SYS</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        <span className="font-bold">New Crop Verification</span> request submitted by <span className="text-green-700">Ramesh Singh</span> manually.
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-medium mt-1">2 HOURS AGO</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Management</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Review Pending Crops", icon: MdPendingActions, color: "text-amber-600", bg: "bg-amber-50" },
                            { label: "Manage Platform Users", icon: MdPeople, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Review Payouts", icon: MdAttachMoney, color: "text-purple-600", bg: "bg-purple-50" }
                        ].map((action, i) => (
                            <button key={i} className="w-full p-4 bg-white border border-gray-100 rounded-sm font-black text-gray-700 hover:border-gray-300 transition-all text-[10px] uppercase tracking-widest flex items-center justify-between group">
                                <span className="group-hover:text-green-700">{action.label}</span>
                                <div className={`p-1.5 rounded-sm ${action.bg} ${action.color}`}>
                                    <action.icon className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
