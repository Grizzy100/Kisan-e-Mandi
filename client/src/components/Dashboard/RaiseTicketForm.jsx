import React, { useState } from "react";
import { toast } from "react-toastify";
import { createSupportTicket } from "../../api/supportAPI.js";
import { MdImage, MdVideoLibrary, MdClose } from "react-icons/md";
import axiosInstance from "../../api/axios.js";

const CATEGORIES = [
  { value: "Wheat", label: "🌾 Wheat" },
  { value: "Rice", label: "🍚 Rice" },
  { value: "Vegetables", label: "🥦 Vegetables" },
  { value: "Fruits", label: "🍎 Fruits" },
  { value: "Other", label: "🪴 Other Crop" },
];

const RaiseTicketForm = ({ onTicketRaised }) => {
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    description: "",
    price: "",
    media: null,
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaIsVideo, setMediaIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { ticketId }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media" && files?.[0]) handleMediaUpload(files[0]);
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = (file) => {
    const isVideo = file.type.startsWith("video");
    setMediaIsVideo(isVideo);
    setFormData({ ...formData, media: file });
    if (isVideo) {
      setMediaPreview(URL.createObjectURL(file));
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setFormData({ ...formData, media: null });
    setMediaPreview(null);
    setMediaIsVideo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.subject || !formData.description || !formData.price) {
      toast.error("Please fill in category, subject, description, and price.");
      return;
    }

    setLoading(true);
    try {
      let mediaUrl = "";
      let mediaType = "image";

      if (formData.media) {
        mediaType = mediaIsVideo ? "video" : "image";

        // 1. Get signed credentials
        const signRes = await axiosInstance.get("/upload/sign");
        const signData = signRes.data;

        // 2. Upload to Cloudinary securely
        const cloudData = new FormData();
        cloudData.append("file", formData.media);
        cloudData.append("api_key", signData.apiKey);
        cloudData.append("timestamp", signData.timestamp);
        cloudData.append("signature", signData.signature);
        cloudData.append("folder", signData.folder);

        const uploadType = mediaIsVideo ? "video" : "image";
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/${uploadType}/upload`,
          { method: "POST", body: cloudData }
        );
        const uploaded = await res.json();
        if (!uploaded.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
        mediaUrl = uploaded.secure_url;
      }

      const result = await createSupportTicket({
        category: formData.category,
        subject: formData.subject,
        description: formData.description,
        price: Number(formData.price),
        mediaUrl,
        mediaType,
      });

      setSuccess({ ticketId: result.ticket._id });
      if (onTicketRaised) onTicketRaised();
    } catch (error) {
      console.error("Ticket error:", error);
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <span className="text-4xl">🌱</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Crop Form Submitted Successfully!</h3>
        <p className="text-gray-500 text-sm mb-3 max-w-sm">
          A confirmation email has been sent. Our team will verify the details, and upon approval, you'll be able to enlist it on the marketplace.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6">
          <p className="text-xs text-gray-500 mb-1">Request ID</p>
          <p className="font-mono text-sm font-semibold text-green-700 break-all">{success.ticketId}</p>
        </div>
        <button
          onClick={() => { setSuccess(null); setFormData({ category: "", subject: "", description: "", price: "", media: null }); setMediaPreview(null); }}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition"
        >
          Enlist Another Crop
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Enlist a Crop</h2>
      <p className="text-sm text-gray-500 mb-7">Provide details about your crop for admin verification and marketplace enlistment.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop Category <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, category: cat.value }))}
                className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${formData.category === cat.value
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-300 text-gray-600"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title / Subject <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. 500kg Premium Basmati Rice"
            maxLength={120}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Price (₹) <span className="text-red-400">*</span></label>
          <input
            type="number"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Total asking price or price per kg..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the quality, quantity, and specific details about the crop..."
            rows={5}
            maxLength={2000}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          <p className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/2000</p>
        </div>

        {/* Upload Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop Photo / Video <span className="text-gray-400 font-normal">(optional)</span></label>
          {mediaPreview ? (
            <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full max-h-[300px]">
              {mediaIsVideo ? (
                <video src={mediaPreview} controls className="w-full h-full object-contain bg-black" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                <button type="button" onClick={removeMedia} className="w-10 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center shadow-lg">
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="ticket-media"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer text-gray-500 hover:border-green-400 hover:bg-green-50 transition"
            >
              <div className="flex justify-center gap-3 mb-2">
                <MdImage className="text-green-500 w-8 h-8" />
                <MdVideoLibrary className="text-blue-500 w-8 h-8" />
              </div>
              <span className="text-sm">Click to attach photo or video</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, MP4, WebM (max 50MB)</span>
              <input
                id="ticket-media"
                type="file"
                name="media"
                accept="image/*,video/mp4,video/webm,video/mov"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-all ${loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-[0.99]"
            }`}
        >
          {loading ? "Submitting Request..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default RaiseTicketForm;
