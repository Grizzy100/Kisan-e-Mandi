import React, { useState } from "react";
import { toast } from "react-toastify";
import { createSupportTicket } from "../../api/supportAPI.js";
import { MdImage, MdVideoLibrary, MdClose, MdCloudUpload, MdCheckCircle } from "react-icons/md";
import axiosInstance from "../../api/axios.js";

const CATEGORIES = [
  { value: "Wheat", label: "Wheat", icon: "🌾" },
  { value: "Rice", label: "Rice", icon: "🍚" },
  { value: "Vegetables", label: "Vegetables", icon: "🥦" },
  { value: "Fruits", label: "Fruits", icon: "🍎" },
  { value: "Other", label: "Other Crop", icon: "🪴" },
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
  const [success, setSuccess] = useState(null);

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
        const signRes = await axiosInstance.get("/upload/sign");
        const signData = signRes.data;

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
        if (!uploaded.secure_url) throw new Error("Upload failed");
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
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-gray-100 rounded-sm p-12 text-center shadow-sm max-w-2xl mx-auto font-inter">
        <div className="w-20 h-20 bg-green-50 rounded-sm flex items-center justify-center mx-auto mb-6 border border-green-100">
          <MdCheckCircle className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crop Enlisted for Review</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
          Your request has been submitted. Our team will verify the details within 24-48 hours. 
          You'll receive an email once it's approved for the marketplace.
        </p>
        
        <div className="inline-block bg-gray-50 border border-gray-100 rounded-sm px-6 py-4 mb-8 text-left">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Tracking ID</p>
          <p className="font-mono text-sm font-semibold text-emerald-700">{success.ticketId}</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => { setSuccess(null); setFormData({ category: "", subject: "", description: "", price: "", media: null }); setMediaPreview(null); }}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-sm text-sm font-bold shadow-sm transition-all"
          >
            Enlist Another Crop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-sm border border-gray-100 shadow-sm p-8 font-inter">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Marketplace Enlistment</h2>
        <p className="text-gray-500 text-sm mt-1">Submit your crop details for professional verification.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category Pick */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Choose Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, category: cat.value }))}
                className={`flex flex-col items-center justify-center p-4 rounded-sm border transition-all ${
                  formData.category === cat.value
                  ? "border-emerald-500 bg-emerald-50/30 text-emerald-700 ring-1 ring-emerald-500 shadow-sm"
                  : "border-gray-100 bg-white text-gray-400 grayscale hover:grayscale-0 hover:border-gray-200"
                }`}
              >
                <span className="text-2xl mb-2">{cat.icon}</span>
                <span className="text-[10px] font-bold uppercase">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Product Name / Title</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Premium Sona Masoori Rice"
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-gray-700 bg-gray-50/30"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Asking Price (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Total or per unit"
                className="w-full border border-gray-200 rounded-sm pl-9 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-gray-700 bg-gray-50/30"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Detailed Specifications</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mention grain size, moisture level, harvest date, and packaging details..."
            rows={4}
            className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-gray-700 bg-gray-50/30 resize-none"
          />
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
            <span>Minimum 50 characters recommended</span>
            <span>{formData.description.length} / 2000</span>
          </div>
        </div>

        {/* Media Upload */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Quality Verification Media</label>
          {mediaPreview ? (
            <div className="relative rounded-sm overflow-hidden border border-gray-200 group">
              {mediaIsVideo ? (
                <video src={mediaPreview} controls className="w-full max-h-[350px] bg-black" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="w-full max-h-[350px] object-cover" />
              )}
              <button 
                type="button" 
                onClick={removeMedia} 
                className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-sm flex items-center justify-center hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-sm p-10 cursor-pointer transition-all group">
              <div className="w-14 h-14 bg-gray-50 group-hover:bg-emerald-50 rounded-sm flex items-center justify-center mb-4 transition-colors">
                <MdCloudUpload className="text-gray-400 group-hover:text-emerald-600 w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-gray-700">Attach High-Res Images or Video</p>
              <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">Drag and drop or click to browse</p>
              <input type="file" name="media" accept="image/*,video/*" onChange={handleChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-sm font-bold text-sm shadow-lg shadow-gray-200 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Submission...
              </>
            ) : (
              "Submit for Verification"
            )}
          </button>
          <p className="text-center text-[10px] items-center gap-1.5 text-gray-400 mt-4 uppercase font-bold tracking-widest flex justify-center">
            <MdCheckCircle className="text-emerald-500 w-3 h-3" /> Encrypted & Secure Submission
          </p>
        </div>
      </form>
    </div>
  );
};

export default RaiseTicketForm;
