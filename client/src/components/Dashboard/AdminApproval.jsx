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
            className="p-2.5 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition active:scale-95 shadow-sm"
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
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-sm">
            <div className="w-16 h-16 bg-green-50 rounded-sm flex items-center justify-center mx-auto mb-4 border border-green-100">
              <MdCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Clear!</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">No posts pending approval.</p>
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
                  className="bg-white rounded-sm border border-gray-100 p-5 shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Author */}
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={name} className="w-10 h-10 rounded-sm object-cover border border-gray-50 shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 bg-orange-100 rounded-sm flex items-center justify-center border border-orange-200 shadow-sm">
                          <span className="text-[10px] font-black text-orange-700">{initials}</span>
                        </div>
                      )}
                    </div>

                    {/* Post info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight">{name}</h3>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3 leading-relaxed">{post.description}</p>

                      {/* Crop details */}
                      {post.cropName && (
                        <div className="flex gap-1.5 mb-3">
                          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-700 px-2 py-0.5 rounded-sm border border-green-200">
                            <MdGrass className="w-2.5 h-2.5" /> {post.cropType}: {post.cropName}
                          </span>
                          {post.price && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm border border-blue-200">
                              <MdAttachMoney className="w-2.5 h-2.5" /> ₹{post.price}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Media thumbnail */}
                      {mediaUrl && (
                        <div className="mb-3 relative group/media overflow-hidden rounded-sm border border-gray-100 shdaow-sm">
                          {isVideo ? (
                            <video src={mediaUrl} className="w-full max-h-60 bg-black" controls />
                          ) : (
                            <img src={mediaUrl} alt="Post media" className="w-full max-h-60 object-cover" />
                          )}
                        </div>
                      )}

                      {post.cropName && post.price && (
                        <p className="text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-sm inline-block mb-3 border border-amber-100">
                          Approving will prepare this listing. Farmer must accept it before it goes live.
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0 min-w-[120px]">
                      <button
                        onClick={() => handleApprove(post._id)}
                        disabled={actionLoading === post._id}
                        className="w-full py-2 bg-gray-900 text-white rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModal(post._id)}
                        disabled={actionLoading === post._id}
                        className="w-full py-2 bg-white text-red-500 rounded-sm text-[9px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        Reject
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
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md p-6 border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">Reject Post</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="REASON FOR REJECTION..."
              rows={3}
              className="w-full border border-gray-200 rounded-sm px-4 py-3 text-xs font-bold uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 resize-none placeholder:text-gray-200"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-gray-200 rounded-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal}
                className="px-4 py-2 text-[9px] font-black uppercase tracking-widest bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {actionLoading === rejectModal ? "..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
