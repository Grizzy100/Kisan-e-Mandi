import { useState, useEffect } from "react";
import {
  MdCheck, MdClose, MdPending, MdVisibility,
  MdGrass, MdAttachMoney, MdPerson, MdRefresh,
} from "react-icons/md";
import { getPendingPosts, approvePost, rejectPost } from "../../api/postAPI";

export default function AdminApproval() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewPost, setPreviewPost] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await getPendingPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load pending posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (postId) => {
    setActionLoading(postId);
    try {
      await approvePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal);
    try {
      await rejectPost(rejectModal, rejectReason);
      setPosts((prev) => prev.filter((p) => p._id !== rejectModal));
      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const author = (post) => post.userId || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50 relative">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MdPending className="w-8 h-8 text-orange-500" />
              Admin Approval
            </h1>
            <p className="text-gray-500 mt-1">
              {posts.length} post{posts.length !== 1 ? "s" : ""} pending review
            </p>
          </div>
          <button
            onClick={fetchPending}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <MdRefresh className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            Loading pending posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheck className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Clear!</h3>
            <p className="text-gray-500">No posts pending approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const user = author(post);
              const name = user.name || "Unknown";
              const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase();
              const isVideo = post.mediaType === "video";
              const mediaUrl = post.mediaUrl || post.imageUrl;

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Author */}
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-700">{initials}</span>
                        </div>
                      )}
                    </div>

                    {/* Post info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{name}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{post.description}</p>

                      {/* Crop details */}
                      {post.cropName && (
                        <div className="flex gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                            <MdGrass className="w-3 h-3" /> {post.cropType}: {post.cropName}
                          </span>
                          {post.price && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                              <MdAttachMoney className="w-3 h-3" /> ₹{post.price}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Media thumbnail */}
                      {mediaUrl && (
                        <div className="mb-3">
                          {isVideo ? (
                            <video src={mediaUrl} className="w-full max-h-60 rounded-xl bg-black" controls />
                          ) : (
                            <img src={mediaUrl} alt="Post media" className="w-full max-h-60 object-cover rounded-xl" />
                          )}
                        </div>
                      )}

                      {post.cropName && post.price && (
                        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block mb-3">
                          Approving will auto-list this as a marketplace item
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(post._id)}
                        disabled={actionLoading === post._id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                      >
                        <MdCheck className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => setRejectModal(post._id)}
                        disabled={actionLoading === post._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 border border-red-200"
                      >
                        <MdClose className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Post</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectModal ? "Rejecting..." : "Reject Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
