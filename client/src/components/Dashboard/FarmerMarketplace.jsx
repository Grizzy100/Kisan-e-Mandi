import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMyItems, publishItem, shelveItem, deleteItem } from "../../api/itemAPI";
import { ProductCard } from "./Item/ProductCard";
import { formatRelativeTime } from "../../utils/timeUtils";

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
  ticketCategory: item.ticketCategory || item.cropType || "",
  cropName: item.cropName || "",
  location: item.location || "",
  sellerName: "",
  sellerAvatar: "",
});

const TAB_KEYS = ["pending", "live", "shelved"];

export default function FarmerMarketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getMyItems();
      setItems(data);
    } catch {
      toast.error("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAccept = async (id) => {
    try {
      await publishItem(id);
      toast.success("Listing is now live! 🌾");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not publish.");
    }
  };

  const handleLater = async (id) => {
    try {
      await shelveItem(id);
      toast.info("Listing shelved.");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not shelve.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this?")) return;
    try {
      await deleteItem(id);
      toast.success("Listing deleted.");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete.");
    }
  };

  const pendingItems = items.filter((i) => i.status === "approved_hidden");
  const liveItems = items.filter((i) => i.status === "published" && i.isActive);
  const shelvedItems = items.filter((i) => i.status === "shelved");

  const tabLabels = {
    pending: `Awaiting Accept (${pendingItems.length})`,
    live: `Live (${liveItems.length})`,
    shelved: `Shelved (${shelvedItems.length})`,
  };

  const renderItemsContent = () => {
    const currentItems = tab === "pending" ? pendingItems : tab === "live" ? liveItems : shelvedItems;

    if (currentItems.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-200">
          <p className="text-4xl mb-4">{tab === 'pending' ? '🌾' : tab === 'live' ? '📋' : '📦'}</p>
          <h3 className="text-gray-900 font-bold">No {tab} listings found</h3>
          <p className="text-gray-500 text-xs mt-1">
            {tab === 'pending' ? 'Admin-approved items will appear here.' : 'Items in this category will be displayed here.'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tab === "pending" && (
           <p className="text-xs text-amber-700 bg-amber-50/50 border border-amber-100 rounded-sm px-4 py-2.5 mb-2 font-medium">
             ✅ Admin has approved these. Click <strong>Accept</strong> to publish to the marketplace.
           </p>
        )}
        {currentItems.map((item) => (
          <div key={item._id} className="bg-white border border-gray-100 rounded-sm p-3 shadow-sm transition-all">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Image */}
              <div className="shrink-0 relative">
                <img
                  src={item.mediaUrl || "https://placehold.co/100x100?text=No+Photo"}
                  alt={item.name}
                  className="w-full sm:w-24 h-24 rounded-sm object-cover border border-gray-100 shadow-sm"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-sm border border-orange-100">
                      {item.cropType}
                    </span>
                    <h3 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{item.name}</h3>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase border shadow-sm ${
                    item.status === 'published' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {item.status === 'published' ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-clamp-1 mb-2">{item.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/50 p-2.5 rounded-sm border border-gray-100/50">
                   <div className="flex flex-col">
                     <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Price</span>
                     <span className="text-xs font-black text-emerald-700">₹{item.price}/{item.unit}</span>
                   </div>
                   <div className="flex flex-col border-l border-gray-100 pl-3">
                     <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Stock</span>
                     <span className="text-xs font-black text-gray-700">{item.quantity} {item.unit}</span>
                   </div>
                   <div className="flex flex-col border-t border-gray-100 pt-1.5 sm:border-none sm:pt-0 sm:border-l sm:pl-3">
                     <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Location</span>
                     <span className="text-[10px] font-bold text-gray-600 truncate">{item.location}</span>
                   </div>
                   <div className="flex flex-col border-l border-gray-100 pl-3 pt-1.5 border-t sm:border-t-0 sm:pt-0">
                     <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Updated</span>
                     <span className="text-[8px] font-black text-gray-500 whitespace-nowrap uppercase">
                       {formatRelativeTime(item.updatedAt)}
                     </span>
                   </div>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full sm:w-auto flex sm:flex-col gap-1.5 min-w-[150px]">
                {tab === "pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(item._id)}
                      className="flex-1 px-3 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all active:scale-95"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleLater(item._id)}
                      className="flex-1 px-3 py-2 bg-white text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-sm border border-gray-200"
                    >
                      Later
                    </button>
                  </>
                )}
                {tab === "live" && (
                  <button
                    onClick={() => handleLater(item._id)}
                    className="w-full px-4 py-2 bg-white text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-sm border border-amber-100"
                  >
                    Shelve
                  </button>
                )}
                {tab === "shelved" && (
                  <>
                    <button
                      onClick={() => handleAccept(item._id)}
                      className="flex-1 px-3 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 px-3 py-2 bg-white text-red-500 text-[9px] font-black uppercase tracking-widest rounded-sm border border-red-100"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 font-inter">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
          Marketplace Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage your agricultural listings. Accept approved crops to go live or shelve for later.
        </p>
      </div>

      {/* Unified Pill Tabs */}
      <div className="w-full overflow-hidden mb-8">
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex p-1 bg-gray-100/50 backdrop-blur-md rounded-sm border border-gray-200/50 shadow-inner flex-nowrap whitespace-nowrap min-w-max">
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-black transition-all duration-300 uppercase tracking-widest ${tab === key
                ? "bg-white text-green-700 shadow-sm border border-gray-100"
                : "text-gray-500"
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                key === 'live' ? 'bg-green-500' : key === 'pending' ? 'bg-amber-500' : 'bg-gray-400'
              }`} />
              {tabLabels[key].split(' (')[0]}
              <span className={`ml-1 px-1.5 py-0.5 rounded-sm text-[8px] ${
                tab === key ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {items.filter(i => (key === 'pending' ? i.status === 'approved_hidden' : key === 'live' ? (i.status === 'published' && i.isActive) : i.status === 'shelved')).length}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : renderItemsContent()}
      </div>
    </div>
  );
}
