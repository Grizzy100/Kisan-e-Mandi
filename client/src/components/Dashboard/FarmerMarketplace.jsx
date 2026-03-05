import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMyItems, publishItem, shelveItem, deleteItem } from "../../api/itemAPI";
import { ProductCard } from "./Item/ProductCard";

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
      toast.success("Listing is now live in the marketplace! 🌾");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not publish listing.");
    }
  };

  const handleLater = async (id) => {
    try {
      await shelveItem(id);
      toast.info("Listing shelved. You can publish it anytime.");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not shelve listing.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      await deleteItem(id);
      toast.success("Listing deleted.");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete listing.");
    }
  };

  const pendingItems = items.filter((i) => i.status === "approved_hidden");
  const liveItems = items.filter((i) => i.status === "published" && i.isActive);
  const shelvedItems = items.filter((i) => i.status === "shelved");

  const tabCounts = { pending: pendingItems.length, live: liveItems.length, shelved: shelvedItems.length };
  const tabLabels = {
    pending: `Awaiting Accept (${pendingItems.length})`,
    live: `Live (${liveItems.length})`,
    shelved: `Shelved (${shelvedItems.length})`,
  };
  const tabColors = {
    pending: "amber",
    live: "green",
    shelved: "gray",
  };

  const renderItems = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      );
    }

    if (tab === "pending") {
      if (pendingItems.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🌾</p>
            <p className="text-gray-500 font-medium text-lg">No listings awaiting your decision.</p>
            <p className="text-gray-400 text-sm mt-1">
              Admin-approved crop tickets will appear here. Hover a card to <strong>Accept</strong> or <strong>Later</strong>.
            </p>
          </div>
        );
      }
      return (
        <div>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5">
            ✅ Admin approved these listings. <strong>Hover</strong> a card and click <strong>Accept</strong> to publish it to the marketplace, or <strong>Later</strong> to shelve.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
      );
    }

    if (tab === "live") {
      if (liveItems.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500 font-medium text-lg">No live listings yet.</p>
            <p className="text-gray-400 text-sm mt-1">Accept an approved listing to make it go live.</p>
          </div>
        );
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {liveItems.map((item) => (
            <div key={item._id} className="flex flex-col gap-2">
              <ProductCard
                product={formatCard(item)}
                mode="active"
              />
              <button
                onClick={() => handleLater(item._id)}
                className="text-xs text-gray-500 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl py-2 transition-all font-medium"
              >
                Shelve this listing
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (tab === "shelved") {
      if (shelvedItems.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 font-medium text-lg">No shelved listings.</p>
          </div>
        );
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shelvedItems.map((item) => (
            <ProductCard
              key={item._id}
              product={formatCard(item)}
              mode="later"
              onAccept={handleAccept}
              onDelete={handleDelete}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="px-4 lg:px-8 py-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">My Marketplace</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your approved crop listings. Accept to go live, or shelve for later.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-gray-100 pb-4 mb-6">
        {TAB_KEYS.map((key) => {
          const color = tabColors[key];
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                active
                  ? color === "amber"
                    ? "bg-amber-500 text-white border-amber-500"
                    : color === "green"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-gray-600 text-white border-gray-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {tabLabels[key]}
            </button>
          );
        })}
      </div>

      {renderItems()}
    </div>
  );
}
