import React, { useState, useEffect, useMemo } from "react";
import {
  MdFileDownload, MdArticle, MdConfirmationNumber, MdFilterList,
  MdInventory2, MdAdd, MdMoreVert, MdChevronRight, MdHistory,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getMyPosts } from "../../api/postAPI";
import { getUserTickets } from "../../api/supportAPI";
import { getMyItems, publishItem, shelveItem, deleteItem } from "../../api/itemAPI";
import { FarmerPost } from "./FarmerPost";
import EmptyState from "./EmptyState";
import { formatRelativeTime } from "../../utils/timeUtils";

const TICKET_STATUS_MAP = {
  All: null,
  Pending: "open",
  Cleared: "resolved",
  Rejected: "rejected",
};

export default function MySection() {
  const [activeTab, setActiveTab] = useState("posts");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsSort, setPostsSort] = useState("newest");

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsStatusFilter, setTicketsStatusFilter] = useState("All");
  const [expandedTicket, setExpandedTicket] = useState(null);

  const [myItems, setMyItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsTabFilter, setItemsTabFilter] = useState("pending");

  useEffect(() => {
    fetchPosts();
    fetchTickets();
  }, []);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try { setPosts((await getMyPosts()).filter((p) => p._id)); }
    catch { /* silent */ }
    finally { setPostsLoading(false); }
  };

  const fetchTickets = async () => {
    setTicketsLoading(true);
    try { setTickets(await getUserTickets()); }
    catch { /* silent */ }
    finally { setTicketsLoading(false); }
  };

  const fetchMyItems = async () => {
    setItemsLoading(true);
    try { setMyItems(await getMyItems()); }
    catch { /* silent */ }
    finally { setItemsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === "listings") fetchMyItems();
  }, [activeTab]);

  const handleAction = async (id, action) => {
    try {
      if (action === "publish") {
        await publishItem(id);
        toast.success("Listing is now live! 🌾");
      } else if (action === "shelve") {
        await shelveItem(id);
        toast.info("Listing shelved.");
      } else if (action === "delete") {
        if (!window.confirm("Permanently delete this listing?")) return;
        await deleteItem(id);
        toast.success("Listing deleted.");
      }
      fetchMyItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    }
  };

  const pendingItems = myItems.filter((i) => i.status === "approved_hidden");
  const activeItems = myItems.filter((i) => i.status === "published" && i.isActive);
  const laterItems = myItems.filter((i) => i.status === "shelved" || i.status === "rejected");

  const displayPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (postsSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    });
  }, [posts, postsSort]);

  const displayTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (ticketsStatusFilter === "All") return true;
      return t.status === TICKET_STATUS_MAP[ticketsStatusFilter];
    });
  }, [tickets, ticketsStatusFilter]);

  const ListingCard = ({ item, type }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white border border-gray-100 rounded-sm p-3 flex flex-col sm:flex-row gap-4 transition-all shadow-sm"
    >
      <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-sm overflow-hidden shrink-0 border border-gray-100/50 shadow-sm relative">
        <img 
          src={item.mediaUrl || "https://placehold.co/200x200?text=Crop"} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute top-2 left-2 px-1 py-0.5 bg-white/90 backdrop-blur-sm rounded-sm text-[7px] font-black uppercase text-gray-400 border border-gray-100">
          {item.cropType}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-black text-gray-900 text-sm truncate uppercase tracking-tight">{item.name}</h3>
            <span className={`shrink-0 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-sm border shadow-sm ${
              type === "active" ? "bg-green-50 text-green-700 border-green-100" :
              type === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
              "bg-gray-50 text-gray-500 border-gray-100"
            }`}>
              {item.status === "approved_hidden" ? "Approved" : item.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-2 rounded-sm border border-gray-100/50">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Price</span>
              <span className="text-xs font-black text-emerald-700">₹{item.price}/{item.unit}</span>
            </div>
            <div className="flex flex-col border-l border-gray-100 pl-3">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Updated</span>
              <span className="text-[8px] font-black text-gray-500 flex items-center gap-1 uppercase">
                 {formatRelativeTime(item.updatedAt || item.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-gray-50 pt-2.5">
            {type === "pending" && (
              <>
                <button onClick={() => handleAction(item._id, "publish")} className="px-3 py-1.5 bg-gray-900 text-white rounded-sm text-[9px] font-black uppercase tracking-widest active:scale-95">Publish</button>
                <button onClick={() => handleAction(item._id, "shelve")} className="px-3 py-1.5 bg-white text-gray-400 border border-gray-200 rounded-sm text-[9px] font-black uppercase tracking-widest">Later</button>
              </>
            )}
            {type === "active" && (
              <button onClick={() => handleAction(item._id, "shelve")} className="px-4 py-1.5 bg-white text-amber-600 border border-amber-200 rounded-sm text-[9px] font-black uppercase tracking-widest">Shelve</button>
            )}
            {type === "later" && (
              <>
                <button onClick={() => handleAction(item._id, "publish")} className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-sm text-[9px] font-black uppercase tracking-widest">Live</button>
                <button onClick={() => handleAction(item._id, "delete")} className="px-3 py-1.5 text-red-500 rounded-sm text-[9px] font-black uppercase tracking-widest">Del</button>
              </>
            )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          My Activity
        </h1>
        <p className="text-gray-500 text-sm">Manage your listings, track tickets, and review your posts.</p>
      </div>

      {/* Unified Pill Tabs - Primary */}
      <div className="w-full overflow-hidden">
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex p-1 bg-gray-100/50 backdrop-blur-md rounded-sm border border-gray-200/50 shadow-inner flex-nowrap whitespace-nowrap min-w-max">
            {[
              { id: "posts", label: "Posts", icon: MdArticle },
              { id: "listings", label: "Listings", icon: MdInventory2 },
              { id: "tickets", label: "Tickets", icon: MdConfirmationNumber },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-sm text-[10px] font-black transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-green-700 shadow-sm border border-gray-100"
                    : "text-gray-500"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-sm border border-gray-100/50">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{posts.length} Posts</span>
              <select 
                value={postsSort} 
                onChange={(e) => setPostsSort(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 border-none focus:ring-0 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            {postsLoading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" /></div>
            ) : displayPosts.length === 0 ? (
              <EmptyState icon={MdArticle} title="No posts yet" description="Start sharing your farming experiences with the community." />
            ) : (
              <div className="grid gap-6">{displayPosts.map(p => <FarmerPost key={p._id} post={p} />)}</div>
            )}
          </div>
        )}

        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="w-full overflow-hidden">
              <div className="flex justify-start overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex p-1 bg-gray-100/50 rounded-sm border border-gray-200/50 shadow-inner flex-nowrap whitespace-nowrap min-w-max">
                  {[
                    { id: "pending", label: `Pending (${pendingItems.length})` },
                    { id: "active", label: `Active (${activeItems.length})` },
                    { id: "later", label: `History (${laterItems.length})` },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setItemsTabFilter(t.id)}
                      className={`px-4 py-1.5 rounded-sm text-xs font-bold transition-all duration-200 ${
                        itemsTabFilter === t.id ? "bg-white text-green-700 shadow-sm" : "text-gray-400"
                      }`}
                    >
                      {t.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {itemsLoading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" /></div>
            ) : (
              <div className="grid gap-4">
                {itemsTabFilter === "pending" && (pendingItems.length === 0 ? <EmptyState icon={MdInventory2} title="No pending approvals" description="Approved listings waiting for your action will appear here." /> : pendingItems.map(i => <ListingCard key={i._id} item={i} type="pending" />))}
                {itemsTabFilter === "active" && (activeItems.length === 0 ? <EmptyState icon={MdInventory2} title="No active listings" description="Accept a pending listing to make it live." /> : activeItems.map(i => <ListingCard key={i._id} item={i} type="active" />))}
                {itemsTabFilter === "later" && (laterItems.length === 0 ? <EmptyState icon={MdInventory2} title="Empty History" description="Rejected or shelved listings will appear here." /> : laterItems.map(i => <ListingCard key={i._id} item={i} type="later" />))}
              </div>
            )}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="w-full overflow-hidden">
              <div className="flex justify-start overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex p-1 bg-gray-100/50 rounded-sm border border-gray-200/50 shadow-inner flex-nowrap whitespace-nowrap min-w-max">
                  {Object.keys(TICKET_STATUS_MAP).map(s => (
                    <button
                      key={s}
                      onClick={() => setTicketsStatusFilter(s)}
                      className={`px-6 py-2 rounded-sm text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                        ticketsStatusFilter === s ? "bg-white text-emerald-700 shadow-sm" : "text-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {ticketsLoading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" /></div>
            ) : displayTickets.length === 0 ? (
              <EmptyState icon={MdConfirmationNumber} title="No tickets found" description="You haven't raised any support or enlistment tickets." />
            ) : (
              <div className="grid gap-4">
                {displayTickets.map(ticket => (
                  <div key={ticket._id} className="bg-white border border-gray-100 rounded-sm overflow-hidden transition-all shadow-sm">
                    <button 
                      onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            ticket.status === "resolved" ? "bg-green-50 text-green-700" :
                            ticket.status === "rejected" ? "bg-red-50 text-red-700" :
                            "bg-amber-50 text-amber-700"
                          }`}>
                            {ticket.status}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">{formatRelativeTime(ticket.createdAt)}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 truncate">{ticket.subject}</h4>
                      </div>
                      <MdChevronRight className={`w-6 h-6 text-gray-300 transition-transform ${expandedTicket === ticket._id ? "rotate-90" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {expandedTicket === ticket._id && (
                        <motion.div 
                          initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                          className="bg-gray-50/50 border-t border-gray-50 overflow-hidden"
                        >
                          <div className="p-6 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {ticket.description}
                            {ticket.mediaUrl && (
                              <img src={ticket.mediaUrl} alt="Ticket attachment" className="mt-4 rounded-sm border border-gray-100 shadow-sm max-h-60" />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  function isActiveTab(id) { return activeTab === id; }
}
