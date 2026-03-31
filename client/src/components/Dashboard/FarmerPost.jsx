import { useState, useEffect } from "react";
import {
  MdFavorite, MdFavoriteBorder, MdChatBubbleOutline, MdShare,
  MdBookmark, MdBookmarkBorder, MdSend, MdMoreVert, MdLocationOn,
  MdAccessTime,
} from "react-icons/md";
import { formatRelativeTime } from "../../utils/timeUtils";
import { motion, AnimatePresence } from "framer-motion";
import {
  toggleLikePost,
  toggleSavePost,
  getComments,
  addComment,
  toggleLikeComment,
} from "../../api/postAPI";

function CommentItem({ comment, postId, currentUserId, depth = 0 }) {
  const [liked, setLiked] = useState(comment.likes?.includes(currentUserId));
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
    } catch (err) { console.error(err); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      const newReply = await addComment(postId, replyText, comment._id);
      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
      setShowReply(false);
      setShowReplies(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className={`${depth > 0 ? "ml-10" : ""} mb-4`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
          {comment.userId?.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-sm px-4 py-3">
            <p className="text-xs font-bold text-gray-800 mb-0.5">{comment.userId?.name || "User"}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
          </div>
          <div className="flex gap-4 mt-1.5 ml-1 text-xs font-medium text-gray-500">
            <button onClick={handleLike} className={`hover:text-red-500 transition-colors flex items-center gap-1 ${liked ? "text-red-500" : ""}`}>
              {liked ? <MdFavorite className="w-4 h-4" /> : <MdFavoriteBorder className="w-4 h-4" />}
              {likesCount}
            </button>
            <button onClick={() => setShowReply(!showReply)} className="hover:text-green-600">Reply</button>
          </div>

          {showReply && (
            <div className="flex items-center gap-2 mt-3 bg-white border border-gray-100 rounded-sm p-1 shadow-sm">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 text-xs bg-transparent border-none focus:ring-0 px-3 outline-none"
              />
              <button 
                onClick={handleReply}
                className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors"
              >
                <MdSend className="w-4 h-4" />
              </button>
            </div>
          )}

          {showReplies && replies.map((r) => (
            <CommentItem key={r._id} comment={r} postId={postId} currentUserId={currentUserId} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FarmerPost({ post }) {
  if (!post) return null;

  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = async () => {
    try {
      const res = await toggleLikePost(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      const res = await toggleSavePost(post._id);
      setSaved(res.saved);
    } catch (err) { console.error(err); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const toggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setShowComments(true);
    if (comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await getComments(post._id);
        setComments(res || []);
      } catch (err) { console.error(err); }
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addComment(post._id, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setCommentsCount((c) => c + 1);
    } catch (err) { console.error(err); }
  };

  const nameInitial = post.userId?.name?.charAt(0) || "?";
  const postDate = formatRelativeTime(post.createdAt);

  const shouldTruncate = post.description?.length > 200;
  const description = isExpanded || !shouldTruncate 
    ? post.description 
    : post.description.substring(0, 200) + "...";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-sm shadow-sm transition-all p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 font-bold shadow-inner">
            {nameInitial}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 leading-tight">{post.userId?.name || "Farmer"}</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MdAccessTime className="w-3 h-3" /> {postDate}
              </span>
              {post.location && (
                <span className="flex items-center gap-1">
                  <MdLocationOn className="w-3 h-3" /> {post.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 p-1 rounded-sm transition-colors">
          <MdMoreVert className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-5 px-1">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-green-600 font-bold"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>

        {post.mediaUrl && (
          <div className="mt-4 rounded-sm overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center max-h-[400px]">
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} controls className="max-w-full max-h-[400px] object-contain" />
            ) : (
              <img src={post.mediaUrl} alt="Post media" className="max-w-full max-h-[400px] object-contain" />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50 px-1">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike} 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? "text-red-500" : "text-gray-500"}`}
          >
            {liked ? <MdFavorite className="w-5 h-5" /> : <MdFavoriteBorder className="w-5 h-5" />}
            <span>{likesCount}</span>
          </button>
          <button 
            onClick={toggleComments}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${showComments ? "text-green-600" : "text-gray-500"}`}
          >
            <MdChatBubbleOutline className="w-5 h-5" />
            <span>{commentsCount}</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors"
          >
            <MdShare className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
        <button 
          onClick={handleSave}
          className={`text-gray-500 transition-colors ${saved ? "text-amber-500" : ""}`}
        >
          {saved ? <MdBookmark className="w-6 h-6" /> : <MdBookmarkBorder className="w-6 h-6" />}
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-gray-50 overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 mb-6 bg-gray-50 rounded-sm p-1.5 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                ?
              </div>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button 
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-sm transition-colors disabled:opacity-50"
              >
                <MdSend className="w-5 h-5" />
              </button>
            </div>

            {loadingComments ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-gray-400">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {comments.map((c) => (
                  <CommentItem key={c._id} comment={c} postId={post._id} currentUserId={currentUserId} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
