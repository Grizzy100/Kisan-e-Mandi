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
  MdAdd, MdClose, MdImage, MdPerson, MdLocationOn,
  MdDescription, MdTrendingUp, MdGroup, MdFavorite,
  MdVideoLibrary, MdPerson2,
} from "react-icons/md";
import { FarmerPost } from "./FarmerPost";
import { getAllPosts, getMyPosts, createPost } from "../../api/postAPI";
import axiosInstance from "../../api/axios.js";

const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
const Community = () => {

  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchPosts = useCallback(async () => {
    try {
      const fetched = await getAllPosts();
      // Guard: only posts with a valid _id are safe to render
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
    { id: "mine", label: "My Posts", icon: MdPerson2 },
  ];

  const displayPosts = (() => {
    if (activeTab === "mine") return myPosts;
    if (activeTab === "trending") return [...posts].sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    if (activeTab === "popular") return [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    return posts; // "all"
  })();

  const handleNewPost = async (formData) => {
    try {
      let mediaUrl = "";
      let mediaType = "image";

      if (formData.media) {
        const isVideo = formData.media.type.startsWith("video");
        mediaType = isVideo ? "video" : "image";

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

        const uploadType = isVideo ? "video" : "image";
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/${uploadType}/upload`,
          { method: "POST", body: cloudData }
        );
        const uploaded = await res.json();
        if (!uploaded.secure_url) {
          console.error("Cloudinary upload failed:", uploaded);
          alert("Media upload failed. Please try again.");
          return;
        }
        mediaUrl = uploaded.secure_url;
      }

      const payload = {
        name: (formData.content || "").substring(0, 60) || "Community Post",
        description: formData.content,
        location: formData.location,
        mediaUrl,
        mediaType,
      };

      // Backend returns { message, post } — extract the actual post
      const result = await createPost(payload);
      const newPost = result.post || result;
      if (newPost?._id) {
        setPosts((prev) => [newPost, ...prev]);
        setMyPosts((prev) => [newPost, ...prev]); // show in My Posts tab immediately
        setActiveTab("mine"); // switch to My Posts so farmer can see their new post
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Make sure you are logged in.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-5 shadow-lg">
            <MdGroup className="w-8 h-8 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-4xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Community Hub
          </h1>
          <p className="text-gray-600 text-lg sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-6 sm:mb-4">
            Connect with fellow farmers, share your journey, and grow together.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 sm:px-3 sm:py-1 rounded-2xl font-medium text-sm sm:text-xs transition-all duration-300 ${activeTab === tab.id
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md scale-105"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm border border-white/20"
                  }`}
              >
                <tab.icon className="w-4 h-4 sm:w-3 sm:h-3" />
                {tab.label}
                {tab.id === "mine" && myPosts.length > 0 && (
                  <span className="ml-0.5 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {myPosts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 font-semibold mt-6 text-lg">Loading community posts...</p>
              <p className="text-gray-500 text-sm mt-2">Gathering the latest from our community</p>
            </div>
          ) : displayPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  <MdDescription className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-xl font-bold text-gray-800 mb-4">
                {activeTab === "mine" ? "You haven't posted yet" : "Start the Conversation"}
              </h3>
              <p className="text-gray-600 text-base sm:text-sm mb-8 max-w-md mx-auto">
                {activeTab === "mine"
                  ? "Share your farming journey — your posts will appear here."
                  : "Be the first to share your farming journey and inspire others!"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="group px-8 py-3 text-sm sm:text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <MdAdd className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Your First Post
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-6 sm:gap-4">
                {displayPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FarmerPost post={post} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 group z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl animate-pulse opacity-30"></div>
          <button
            onClick={() => setShowModal(true)}
            className="relative w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
          >
            <MdAdd className="w-7 h-7 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-md">
            Share Your Story
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
          <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden border border-white/20">
            <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Share Your Story
                </h2>
                <p className="text-gray-600 text-sm mt-1">Connect with the farming community</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition duration-200"
              >
                <MdClose className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <PostForm onSubmit={handleNewPost} onCancel={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




const PostForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    content: "", location: "", media: null,
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaIsVideo, setMediaIsVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media" && files?.[0]) handleMediaUpload(files[0]);
    else setForm({ ...form, [name]: value });
  };

  const handleMediaUpload = (file) => {
    const isVideo = file.type.startsWith("video");
    setMediaIsVideo(isVideo);
    setForm({ ...form, media: file });
    if (isVideo) {
      setMediaPreview(URL.createObjectURL(file));
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleMediaUpload(e.dataTransfer.files[0]);
  };

  const removeMedia = () => {
    setForm({ ...form, media: null });
    setMediaPreview(null);
    setMediaIsVideo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content) return;
    setIsSubmitting(true);
    await onSubmit(form);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-4">
      {/* Media Upload */}
      <div className="space-y-3">
        <label htmlFor="media" className="text-base sm:text-sm font-semibold text-gray-800 flex items-center gap-2">
          <MdImage className="text-green-600" />
          Add Photo or Video
        </label>
        {mediaPreview ? (
          <div className="relative group">
            {mediaIsVideo ? (
              <video src={mediaPreview} controls className="w-full h-52 object-cover rounded-xl border bg-black" />
            ) : (
              <img src={mediaPreview} alt="Preview" className="w-full h-52 object-cover rounded-xl border" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
              <button type="button" onClick={removeMedia} className="w-10 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center">
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label htmlFor="media" className="cursor-pointer block text-sm sm:text-xs text-gray-600">
              <div className="flex justify-center gap-3 mb-2">
                <MdImage className="text-green-500 w-6 h-6" />
                <MdVideoLibrary className="text-blue-500 w-6 h-6" />
              </div>
              <span className="text-green-600 font-medium">Click to upload</span> or drag &amp; drop
              <input type="file" id="media" name="media" accept="image/*,video/mp4,video/webm,video/mov" onChange={handleChange} className="hidden" />
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF, MP4, WebM (max 50MB)</p>
            </label>
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          <MdLocationOn className="inline text-green-600 mr-1" />
          Location
        </label>
        <input
          id="location" name="location" type="text" value={form.location}
          onChange={handleChange} placeholder="City, State"
          className="w-full px-4 py-2 sm:py-1.5 border rounded-lg text-sm sm:text-xs"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          <MdDescription className="inline text-green-600 mr-1" />
          Share Your Thoughts
        </label>
        <textarea
          id="content" name="content" rows={4} maxLength={1000}
          value={form.content} onChange={handleChange}
          placeholder="Share your farming experience, ask a question, or inspire others..."
          className="w-full px-4 py-2 sm:py-1.5 border rounded-lg text-sm sm:text-xs resize-none"
          required
        />
        <div className="text-right text-xs text-gray-500 mt-1">{form.content.length}/1000</div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-6 py-2 sm:px-4 sm:py-1.5 text-sm sm:text-xs border rounded-lg text-gray-700 hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-2 sm:px-5 sm:py-1.5 text-sm sm:text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-105 transition disabled:opacity-50">
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
};
export default Community;


