// import { MdThumbUp, MdComment, MdShare, MdMoreVert } from "react-icons/md"

// const posts = [
//   {
//     id: 1,
//     author: "John Smith",
//     location: "Texas, USA",
//     initials: "JS",
//     time: "2 hours ago",
//     content:
//       "Just harvested my first batch of organic tomatoes this season! The yield is amazing thanks to the new irrigation system I installed. Anyone else trying organic farming this year?",
//     image: "/placeholder.svg?height=300&width=400",
//     likes: 24,
//     comments: 8,
//     shares: 3,
//   },
//   {
//     id: 2,
//     author: "Maria Garcia",
//     location: "California, USA",
//     initials: "MG",
//     time: "5 hours ago",
//     content:
//       "Weather has been perfect for corn planting! Started early this morning and covered 50 acres. The soil moisture is just right. Expecting a great season ahead 🌽",
//     image: "/placeholder.svg?height=300&width=400",
//     likes: 31,
//     comments: 12,
//     shares: 5,
//   },
//   {
//     id: 3,
//     author: "David Johnson",
//     location: "Iowa, USA",
//     initials: "DJ",
//     time: "1 day ago",
//     content:
//       "Sharing my experience with the new pest control method I tried this season. Reduced chemical usage by 60% while maintaining crop quality. Happy to share details with fellow farmers!",
//     image: "/placeholder.svg?height=300&width=400",
//     likes: 45,
//     comments: 18,
//     shares: 12,
//   },
// ]

// export function FarmerPost() {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Community Posts</h2>
//       {posts.map((post) => (
//         <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-sm font-medium">{post.initials}</span>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{post.author}</h3>
//                 <p className="text-sm text-gray-500">
//                   {post.location} • {post.time}
//                 </p>
//               </div>
//             </div>
//             <button className="p-2 hover:bg-gray-100 rounded-lg">
//               <MdMoreVert className="w-4 h-4" />
//             </button>
//           </div>

//           <p className="text-gray-700 mb-4">{post.content}</p>

//           {post.image && (
//             <img
//               src={post.image || "/placeholder.svg"}
//               alt="Post content"
//               className="w-full h-64 object-cover rounded-lg mb-4"
//             />
//           )}

//           <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdThumbUp className="w-4 h-4" />
//               <span className="text-sm">{post.likes}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdComment className="w-4 h-4" />
//               <span className="text-sm">{post.comments}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdShare className="w-4 h-4" />
//               <span className="text-sm">{post.shares}</span>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }


//Provided by chatgpt
// import { MdThumbUp, MdComment, MdShare, MdMoreVert } from "react-icons/md";
// import { useEffect, useState } from "react";
// import { getAllPosts } from "../../api/postAPI";

// export function FarmerPost({ additionalPosts = [] }) {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const backendPosts = await getAllPosts();
//         setPosts([...additionalPosts, ...backendPosts]);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };

//     fetchPosts();
//   }, [additionalPosts]);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Community Posts</h2>
//       {posts.map((post) => (
//         <div key={post._id || post.id} className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-sm font-medium">
//                   {(post.initials || post.author || post.name || "?")
//                     .split(" ")
//                     .map((w) => w[0])
//                     .join("")
//                     .toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{post.author || post.name}</h3>
//                 <p className="text-sm text-gray-500">
//                   {post.location} • {new Date(post.createdAt || post.time).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//             <button className="p-2 hover:bg-gray-100 rounded-lg">
//               <MdMoreVert className="w-4 h-4" />
//             </button>
//           </div>

//           <p className="text-gray-700 mb-4">{post.content}</p>

//           {post.imageUrl && (
//             <img
//               src={post.imageUrl}
//               alt="Post content"
//               className="w-full h-64 object-cover rounded-lg mb-4"
//             />
//           )}

//           <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdThumbUp className="w-4 h-4" />
//               <span className="text-sm">{post.likes || 0}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdComment className="w-4 h-4" />
//               <span className="text-sm">{post.comments || 0}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdShare className="w-4 h-4" />
//               <span className="text-sm">{post.shares || 0}</span>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  MdThumbUp, MdComment, MdShare, MdMoreVert,
  MdBookmark, MdBookmarkBorder, MdSend, MdReply,
  MdFavorite, MdFavoriteBorder, MdExpandMore, MdExpandLess,
} from "react-icons/md";
import {
  toggleLikePost,
  toggleSavePost,
  getComments,
  addComment,
  toggleLikeComment,
} from "../../api/postAPI";

// ── Single Comment (supports nesting) ──────────────────────────
function CommentItem({ comment, postId, currentUserId, depth = 0 }) {
  const [liked, setLiked] = useState(
    comment.likes?.includes(currentUserId)
  );
  const [likesCount, setLikesCount] = useState(comment.likesCount || comment.likes?.length || 0);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async () => {
    try {
      const res = await toggleLikeComment(postId, comment._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      const newReply = await addComment(postId, replyText, comment._id);
      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
      setShowReply(false);
      setShowReplies(true);
    } catch (err) {
      console.error(err);
    }
  };

  const user = comment.userId || {};
  const avatar = user.avatar;
  const name = user.name || "User";
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase();

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4" : ""} mb-3`}>
      <div className="flex gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-green-700">{initials}</span>
          </div>
        )}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-700">{comment.text}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button onClick={handleLike} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500">
              {liked ? <MdFavorite className="w-3.5 h-3.5 text-red-500" /> : <MdFavoriteBorder className="w-3.5 h-3.5" />}
              {likesCount > 0 && likesCount}
            </button>
            <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600">
              <MdReply className="w-3.5 h-3.5" /> Reply
            </button>
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {showReply && (
            <div className="flex gap-2 mt-2 ml-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
              />
              <button onClick={handleReply} className="p-1.5 bg-green-600 text-white rounded-xl hover:bg-green-700">
                <MdSend className="w-4 h-4" />
              </button>
            </div>
          )}

          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-green-600 mt-2 ml-2 hover:underline"
            >
              {showReplies ? <MdExpandLess className="w-4 h-4" /> : <MdExpandMore className="w-4 h-4" />}
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </button>
          )}

          {showReplies && replies.map((r) => (
            <CommentItem key={r._id} comment={r} postId={postId} currentUserId={currentUserId} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Post Card ─────────────────────────────────────────────
export function FarmerPost({ post }) {
  if (!post) return null;

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?._id;

  // If the post is freshly created, userId might be just an ID string instead of populated object.
  // We can fallback to local user data if it matches currentUserId.
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const author = post.userId?.name ? post.userId : currentUserId === post.userId ? localUser : {};

  const name = author.name || post.name || "Anonymous";
  const avatar = author.avatar || localUser.avatar; // Fallback to local avatar just in case
  const description = post.description || "";
  const mediaUrl = post.mediaUrl || post.imageUrl;
  const isVideo = post.mediaType === "video";
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase();

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Convert all IDs to strings before comparing (Mongoose ObjectId !== plain string)
  const likedIds = post.likes?.map((id) => id?.toString()) || [];
  const savedIds = post.savedBy?.map((id) => id?.toString()) || [];
  const [liked, setLiked] = useState(likedIds.includes(currentUserId?.toString()));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(savedIds.includes(currentUserId?.toString()));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    try { const res = await toggleLikePost(post._id); setLiked(res.liked); setLikesCount(res.likesCount); }
    catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try { const res = await toggleSavePost(post._id); setSaved(res.saved); }
    catch (err) { console.error(err); }
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: name, text: description, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try { const fetched = await getComments(post._id); setComments(fetched); }
      catch (err) { console.error(err); }
      finally { setLoadingComments(false); }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addComment(post._id, commentText);
      setComments((prev) => [...prev, { ...newComment, replies: [] }]);
      setCommentText("");
      setCommentsCount((c) => c + 1);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

      {/* Header: Avatar + Name / Date */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover absolute inset-0"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : null}
          {/* Always render initials as fallback — img overlays it when valid */}
          <span className="text-sm font-bold text-white flex items-center justify-center w-full h-full">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {post.location && <span className="mr-1">{post.location} ·</span>}
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Media — max 288 px tall */}
      {mediaUrl && (
        isVideo ? (
          <video controls className="w-full max-h-72 bg-black object-contain">
            <source src={mediaUrl} />
          </video>
        ) : (
          <img src={mediaUrl} alt="Post" className="w-full max-h-72 object-cover" />
        )
      )}

      {/* Description */}
      {description && (
        <p className="px-5 pt-3 pb-1 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {description}
        </p>
      )}

      {/* Action Bar: Like · Comment · Share · Bookmark */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-100 mt-2">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${liked ? "text-red-500 bg-red-50" : "text-gray-500 hover:bg-gray-100"}`}>
          {liked ? <MdFavorite className="w-5 h-5" /> : <MdFavoriteBorder className="w-5 h-5" />}
          {likesCount > 0 && <span>{likesCount}</span>}
        </button>

        <button onClick={loadComments}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${showComments ? "text-green-600 bg-green-50" : "text-gray-500 hover:bg-gray-100"}`}>
          <MdComment className="w-5 h-5" />
          {commentsCount > 0 && <span>{commentsCount}</span>}
        </button>

        <button onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition-all">
          <MdShare className="w-5 h-5" />
        </button>

        <button onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${saved ? "text-green-600 bg-green-50" : "text-gray-500 hover:bg-gray-100"}`}>
          {saved ? <MdBookmark className="w-5 h-5" /> : <MdBookmarkBorder className="w-5 h-5" />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 pb-4 border-t border-gray-100 pt-3">
          <div className="flex gap-3 mb-4">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="You" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-green-700">{(currentUser?.name || "U").charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button onClick={handleAddComment} className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                <MdSend className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loadingComments ? (
            <div className="text-center py-4 text-gray-400 text-sm">Loading comments...</div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-1">
              {comments.map((c) => (
                <CommentItem key={c._id} comment={c} postId={post._id} currentUserId={currentUserId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


