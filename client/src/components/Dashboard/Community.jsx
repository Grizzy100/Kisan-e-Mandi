// import React, { useState } from "react";
// import { FarmerPost } from "./FarmerPost";
// import { MdAdd } from "react-icons/md";

// const Community = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [posts, setPosts] = useState([]); // local post state

//   const handleNewPost = (newPost) => {
//     setPosts((prev) => [newPost, ...prev]);
//     setShowModal(false);
//   };

//   return (
//     <div className="relative">
//       <div className="mb-20">
//         <FarmerPost additionalPosts={posts} />
//       </div>

//       {/* Floating Create Button */}
//       <div className="fixed bottom-6 right-6 group z-50">
//         <button
//           onClick={() => setShowModal(true)}
//           className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white text-3xl rounded-full flex items-center justify-center shadow-lg transition-all"
//         >
//           <MdAdd />
//         </button>
//         <span className="absolute -top-10 right-1/2 translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition">
//           Post
//         </span>
//       </div>

//       {/* Modal for Post Form */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
//             <h2 className="text-xl font-bold mb-4">New Post</h2>
//             <PostForm onSubmit={handleNewPost} onCancel={() => setShowModal(false)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Community;

// // -------------------------------------
// // Form Component to create post

// const PostForm = ({ onSubmit, onCancel }) => {
//   const [form, setForm] = useState({
//     author: "",
//     location: "",
//     content: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm({ ...form, [name]: files ? files[0] : value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.author || !form.content || !form.location) return;
//     const newPost = {
//       id: Date.now(),
//       author: form.author,
//       location: form.location,
//       initials: form.author
//         .split(" ")
//         .map((w) => w[0])
//         .join("")
//         .toUpperCase(),
//       content: form.content,
//       image: form.image ? URL.createObjectURL(form.image) : null,
//       likes: 0,
//       comments: 0,
//       shares: 0,
//     };
//     onSubmit(newPost);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {/* Image Upload */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Upload Image</label>
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleChange}
//           className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//         />
//       </div>

//       {/* Author */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Name</label>
//         <input
//           type="text"
//           name="author"
//           value={form.author}
//           onChange={handleChange}
//           placeholder="Your name"
//           className="w-full border border-gray-300 rounded-md p-2"
//         />
//       </div>

//       {/* Location */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">City & Country</label>
//         <input
//           type="text"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           placeholder="City, Country"
//           className="w-full border border-gray-300 rounded-md p-2"
//         />
//       </div>

//       {/* Content */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Content</label>
//         <textarea
//           name="content"
//           value={form.content}
//           onChange={handleChange}
//           placeholder="What's on your mind?"
//           rows={3}
//           className="w-full border border-gray-300 rounded-md p-2"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           Post
//         </button>
//       </div>
//     </form>
//   );
// };


// Community.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  MdAdd, MdClose, MdImage, MdGroup, MdTrendingUp, MdFavorite,
  MdPerson, MdVideoLibrary, MdPostAdd,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { FarmerPost } from "./FarmerPost";
import EmptyState from "./EmptyState";
import { getAllPosts, getMyPosts, createPost } from "../../api/postAPI";
import axiosInstance from "../../api/axios.js";

const Community = () => {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchPosts = useCallback(async () => {
    try {
      const fetched = await getAllPosts();
      setPosts(fetched.filter((p) => p._id));
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyPosts = useCallback(async () => {
    try {
      const fetched = await getMyPosts();
      setMyPosts(fetched.filter((p) => p._id));
    } catch (err) {
      console.error("Error fetching my posts:", err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchMyPosts();
  }, [fetchPosts, fetchMyPosts]);

  const tabs = [
    { id: "all", label: "All Posts", icon: MdGroup },
    { id: "trending", label: "Trending", icon: MdTrendingUp },
    { id: "popular", label: "Popular", icon: MdFavorite },
    { id: "mine", label: "My Posts", icon: MdPerson },
  ];

  const displayPosts = (() => {
    if (activeTab === "mine") return myPosts;
    if (activeTab === "trending") return [...posts].sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    if (activeTab === "popular") return [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    return posts;
  })();

  const handleNewPost = async (formData) => {
    try {
      // ... same backend logic ...
      let mediaUrl = "";
      let mediaType = "image";
      if (formData.media) {
        const isVideo = formData.media.type.startsWith("video");
        mediaType = isVideo ? "video" : "image";
        const signRes = await axiosInstance.get("/upload/sign");
        const signData = signRes.data;
        const cloudData = new FormData();
        cloudData.append("file", formData.media);
        cloudData.append("api_key", signData.apiKey);
        cloudData.append("timestamp", signData.timestamp);
        cloudData.append("signature", signData.signature);
        cloudData.append("folder", signData.folder);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/${isVideo ? "video" : "image"}/upload`, { method: "POST", body: cloudData });
        const uploaded = await res.json();
        mediaUrl = uploaded.secure_url;
      }
      const payload = {
        name: (formData.content || "").substring(0, 60) || "Community Post",
        description: formData.content,
        location: formData.location,
        mediaUrl,
        mediaType,
      };
      const result = await createPost(payload);
      const newPost = result.post || result;
      if (newPost?._id) {
        setPosts((prev) => [newPost, ...prev]);
        setMyPosts((prev) => [newPost, ...prev]);
        setActiveTab("mine");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto md:mx-0">Connect with fellow farmers, share your harvest stories, and grow together.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-sm font-semibold transition-all shadow-md active:scale-95 w-full md:w-auto"
        >
          <MdAdd className="w-5 h-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Unified Pill Tabs */}
      <div className="flex justify-start sm:justify-center mb-8 overflow-x-auto no-scrollbar pb-2 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex p-1.5 bg-gray-100/50 backdrop-blur-md rounded-sm border border-gray-200/50 shadow-inner flex-nowrap whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-sm text-sm font-bold transition-all duration-300 relative ${activeTab === tab.id
                ? "bg-white text-green-700 shadow-md"
                : "text-gray-500"
                }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-green-600" : "text-gray-400"}`} />
              <span className="relative z-10">{tab.label}</span>
              {tab.id === "mine" && myPosts.length > 0 && (
                <span className="relative z-10 ml-1 bg-green-100 text-green-700 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {myPosts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : displayPosts.length === 0 ? (
          <EmptyState
            icon={MdPostAdd}
            title={activeTab === "mine" ? "No posts yet" : "Be the first to post"}
            description={activeTab === "mine" ? "Share your first farming story with the community!" : "Join the conversation and inspire others with your farming journey."}
            action={{ label: "Create a Post", onClick: () => setShowModal(true) }}
          />
        ) : (
          <div className="grid gap-6">
            {displayPosts.map((post) => (
              <FarmerPost key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Modal - Aligned with modern design */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              className="relative bg-white rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-800">New Community Post</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-sm transition-colors">
                  <MdClose className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <PostForm onSubmit={handleNewPost} onCancel={() => setShowModal(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PostForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({ content: "", location: "", media: null });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, media: file });
    const reader = new FileReader();
    reader.onload = (ev) => setMediaPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setIsSubmitting(true);
    await onSubmit(form);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Tell your story</label>
        <textarea
          required
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="What's happening on your farm? Ask for advice or share a victory..."
          className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-600 outline-none transition-all text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Location (Optional)</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Nashik, MH"
            className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Media</label>
          <div className="relative">
            <input type="file" id="post-media" className="hidden" accept="image/*,video/*" onChange={handleMedia} />
            <label htmlFor="post-media" className="flex items-center gap-2 px-4 py-2.5 rounded-sm border border-gray-200 cursor-pointer transition-colors text-sm text-gray-600">
              <MdImage className="w-5 h-5 text-emerald-600" />
              <span>{form.media ? "Change media" : "Add photo/video"}</span>
            </label>
          </div>
        </div>
      </div>

      {mediaPreview && (
        <div className="relative rounded-sm overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center">
          <img src={mediaPreview} alt="Preview" className="max-h-full object-contain" />
          <button 
            type="button" 
            onClick={() => { setMediaPreview(null); setForm({...form, media: null}); }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-sm backdrop-blur-sm transition-colors"
          >
            <MdClose className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-sm font-bold text-gray-500 transition-colors">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || !form.content.trim()}
          className="flex-[2] py-3 bg-green-600 text-white rounded-sm font-bold transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
};

export default Community;


