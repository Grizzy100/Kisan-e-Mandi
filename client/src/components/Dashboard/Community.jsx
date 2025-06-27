import React, { useState } from "react";
import { FarmerPost } from "./FarmerPost";
import { MdAdd } from "react-icons/md";

const Community = () => {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]); // local post state

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="relative">
      <div className="mb-20">
        <FarmerPost additionalPosts={posts} />
      </div>

      {/* Floating Create Button */}
      <div className="fixed bottom-6 right-6 group z-50">
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white text-3xl rounded-full flex items-center justify-center shadow-lg transition-all"
        >
          <MdAdd />
        </button>
        <span className="absolute -top-10 right-1/2 translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition">
          Create Post
        </span>
      </div>

      {/* Modal for Post Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">New Post</h2>
            <PostForm onSubmit={handleNewPost} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;

// -------------------------------------
// Form Component to create post

const PostForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    author: "",
    location: "",
    time: "",
    content: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.author || !form.content || !form.location) return;
    const newPost = {
      id: Date.now(),
      author: form.author,
      location: form.location,
      initials: form.author
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      time: form.time || "Just now",
      content: form.content,
      image: form.image ? URL.createObjectURL(form.image) : null,
      likes: 0,
      comments: 0,
      shares: 0,
    };
    onSubmit(newPost);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">City & Country</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="City, Country"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="text"
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="e.g. 2 hours ago"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Post
        </button>
      </div>
    </form>
  );
};
