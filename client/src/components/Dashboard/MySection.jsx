import React, { useState, useEffect, useMemo } from "react";
import {
  MdFileDownload,
  MdArticle,
  MdConfirmationNumber,
  MdFilterList,
  MdInventory2,
} from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getMyPosts } from "../../api/postAPI";
import { getUserTickets } from "../../api/supportAPI";
import { getMyItems, publishItem, shelveItem, deleteItem } from "../../api/itemAPI";
import { FarmerPost } from "./FarmerPost";
import { ProductCard } from "./Item/ProductCard";

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
  const [ticketsSort, setTicketsSort] = useState("newest");
  const [expandedTicket, setExpandedTicket] = useState(null);

  const [myItems, setMyItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsTabFilter, setItemsTabFilter] = useState("pending"); // "pending" | "active" | "later"

  useEffect(() => {
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
    fetchPosts();
    fetchTickets();
  }, []);

  const fetchMyItems = async () => {
    setItemsLoading(true);
    try { setMyItems(await getMyItems()); }
    catch { /* silent */ }
    finally { setItemsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === "listings") fetchMyItems();
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      await publishItem(id);
      toast.success("Listing is now live in the marketplace! 🌾");
      fetchMyItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not publish listing.");
    }
  };

  const handleLater = async (id) => {
    try {
      await shelveItem(id);
      toast.info("Listing shelved. You can publish it anytime.");
      fetchMyItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not shelve listing.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      await deleteItem(id);
      toast.success("Listing deleted.");
      fetchMyItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete listing.");
    }
  };

  const formatCard = (item) => ({
    id: item._id,
    name: item.name,
    description: item.description || "",
    price: item.price,
    unit: item.unit,
    quantity: item.quantity,
    image: item.mediaUrl || item.imageUrl || "https://placehold.co/400x400?text=No+Photo",
    mediaType: item.mediaType || "image",
    cropType: item.cropType,
    ticketCategory: item.ticketCategory || "",
    cropName: item.cropName,
    location: item.location || "",
    sellerName: "",
    sellerAvatar: "",
  });

  const pendingItems = myItems.filter((i) => i.status === "approved_hidden");
  const activeItems  = myItems.filter((i) => i.status === "published" && i.isActive);
  const laterItems   = myItems.filter((i) => i.status === "shelved");

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const data = await getMyPosts();
        setPosts(data.filter((p) => p._id));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    const fetchTickets = async () => {
      setTicketsLoading(true);
      try {
        const data = await getUserTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchPosts();
    fetchTickets();
  }, []);

  const displayPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (postsSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (postsSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (postsSort === "likes") return (b.likes?.length || 0) - (a.likes?.length || 0);
      if (postsSort === "comments") return (b.commentsCount || 0) - (a.commentsCount || 0);
      return 0;
    });
  }, [posts, postsSort]);

  const displayTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (ticketsStatusFilter === "All") return true;
        return t.status === TICKET_STATUS_MAP[ticketsStatusFilter];
      })
      .sort((a, b) => {
        if (ticketsSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (ticketsSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
      });
  }, [tickets, ticketsStatusFilter, ticketsSort]);

  const STATUS_STYLES = {
    open: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const STATUS_LABEL = {
    open: "Pending",
    "in-progress": "Under Review",
    resolved: "Cleared",
    rejected: "Rejected",
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          My Activity
        </h1>
        <p className="text-gray-500 text-sm">Manage your posts and track your support tickets.</p>
      </div>

      <div className="flex p-1 bg-gray-100/80 rounded-2xl w-full sm:w-fit relative isolate">
        {["posts", "tickets", "listings"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "text-green-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "posts"    && <MdArticle className="w-4 h-4" />}
              {tab === "tickets"  && <MdConfirmationNumber className="w-4 h-4" />}
              {tab === "listings" && <MdInventory2 className="w-4 h-4" />}
              <span className="capitalize">
                {tab === "tickets" ? "Tickets Raised" : tab === "listings" ? "My Listings" : tab}
              </span>
              {tab === "listings" && pendingItems.length > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingItems.length}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        {activeTab === "posts" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 mt-2">
              <span className="text-sm font-medium text-gray-700">
                {posts.length} {posts.length === 1 ? "Post" : "Posts"}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                <MdFilterList className="w-4 h-4 text-green-600" />
                <select
                  value={postsSort}
                  onChange={(e) => setPostsSort(e.target.value)}
                  className="bg-transparent font-medium border-none outline-none focus:ring-0 text-gray-700 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="likes">Most Likes</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>
            </div>

            {postsLoading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : displayPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">You haven't made any posts yet.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {displayPosts.map((post) => (
                  <FarmerPost key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-100 mt-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
                {Object.keys(TICKET_STATUS_MAP).map((status) => (
                  <button
                    key={status}
                    onClick={() => setTicketsStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      ticketsStatusFilter === status
                        ? "bg-green-600 text-white shadow-md shadow-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm w-full sm:w-auto justify-end">
                <MdFilterList className="w-4 h-4 text-green-600" />
                <select
                  value={ticketsSort}
                  onChange={(e) => setTicketsSort(e.target.value)}
                  className="bg-transparent font-medium border-none outline-none focus:ring-0 text-gray-700 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {ticketsLoading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : displayTickets.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No tickets found for this filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${STATUS_STYLES[ticket.status]}`}>
                            {STATUS_LABEL[ticket.status]}
                          </span>
                          <span className="text-xs text-gray-500 px-2 py-0.5 rounded-md bg-gray-100 capitalize">
                            {ticket.category}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto sm:ml-2">
                            {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-base truncate">{ticket.subject}</h3>
                      </div>
                      <span className="hidden sm:flex text-gray-400 text-lg shrink-0 items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                        {expandedTicket === ticket._id ? "▲" : "▼"}
                      </span>
                    </button>

                    {expandedTicket === ticket._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-gray-50/50"
                      >
                        <div className="px-6 py-5 space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{ticket.description}</p>
                          </div>
                          {ticket.mediaUrl && (
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attachment</p>
                              <a href={ticket.mediaUrl} target="_blank" rel="noopener noreferrer" className="block w-fit relative group">
                                <img src={ticket.mediaUrl} alt="Attachment" className="max-h-64 rounded-xl border border-gray-200 shadow-sm" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <span className="text-white bg-black/50 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm shadow flex items-center gap-2">
                                    <MdFileDownload /> View Full
                                  </span>
                                </div>
                              </a>
                            </div>
                          )}
                          <div className="pt-2 flex justify-between items-center text-xs text-gray-400">
                            <span>Ticket ID: <span className="font-mono text-gray-500">{ticket._id}</span></span>
                            <span>{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      {activeTab === "listings" && (
          <div className="space-y-6">
            {/* Sub-filter tabs */}
            <div className="flex gap-2 flex-wrap border-b border-gray-100 pb-4 mt-2">
              {[
                { key: "pending", label: `Awaiting Accept (${pendingItems.length})`, color: "amber" },
                { key: "active",  label: `Live on Marketplace (${activeItems.length})`,  color: "green" },
                { key: "later",   label: `Shelved / Later (${laterItems.length})`,  color: "gray" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setItemsTabFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    itemsTabFilter === key
                      ? color === "amber" ? "bg-amber-500 text-white border-amber-500"
                        : color === "green" ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-gray-600 text-white border-gray-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {itemsLoading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <>
                {/* Pending — awaiting farmer Accept */}
                {itemsTabFilter === "pending" && (
                  pendingItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-amber-200">
                      <p className="text-gray-400 font-medium">No listings awaiting your decision.</p>
                      <p className="text-gray-400 text-sm mt-1">Admin-approved items will appear here.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
                        ✅ Admin approved these listings. <strong>Accept</strong> to publish to the marketplace, or <strong>Later</strong> to shelve.
                      </p>
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {pendingItems.map((item) => (
                          <ProductCard
                            key={item._id}
                            product={formatCard(item)}
                            mode="pending"
                            onAccept={handleAccept}
                            onLater={handleLater}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Active — live on marketplace */}
                {itemsTabFilter === "active" && (
                  activeItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-emerald-200">
                      <p className="text-gray-400 font-medium">No live listings yet.</p>
                      <p className="text-gray-400 text-sm mt-1">Accept an approved listing to make it go live.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {activeItems.map((item) => (
                        <div key={item._id} className="relative">
                          <ProductCard
                            product={formatCard(item)}
                            mode="active"
                          />
                          <button
                            onClick={() => handleLater(item._id)}
                            className="mt-2 w-full text-xs text-gray-500 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl py-2 transition-all font-medium"
                          >
                            Shelve this listing
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* Later — shelved */}
                {itemsTabFilter === "later" && (
                  laterItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-400 font-medium">No shelved listings.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {laterItems.map((item) => (
                        <ProductCard
                          key={item._id}
                          product={formatCard(item)}
                          mode="later"
                          onAccept={handleAccept}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
