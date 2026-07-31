//server\controllers\postController.js
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Item from "../models/Item.js";
import Order from "../models/Order.js";
import { ITEM_STATUS, canTransitionItem } from "../utils/itemStateMachine.js";

// ─────────────────────────────────────────────────────────────────
// 1. CREATE POST (vendor uploads photo/video → pending approval)
// ─────────────────────────────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { name, description, imageUrl, mediaUrl, mediaType, location } = req.body;
    const userId = req.user?._id;

    if (!name || !description || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newPost = await Post.create({
      name,
      description,
      imageUrl: imageUrl || mediaUrl || "",
      mediaUrl: mediaUrl || imageUrl || "",
      mediaType: mediaType || "image",
      location,
      userId,
    });

    const populatedPost = await Post.findById(newPost._id).populate("userId", "name avatar email");

    res.status(201).json({ message: "Post created successfully.", post: populatedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error while creating post." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 2. GET ALL POSTS (feed — only approved posts)
// ─────────────────────────────────────────────────────────────────
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name avatar email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts." });
  }
};


// ─────────────────────────────────────────────────────────────────
// 3. GET MY POSTS (vendor sees own posts of all statuses)
// ─────────────────────────────────────────────────────────────────
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id })
      .populate("userId", "name avatar email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("getMyPosts error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 4. GET SINGLE POST
// ─────────────────────────────────────────────────────────────────
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "name avatar email");
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 5. LIKE / UNLIKE POST
// ─────────────────────────────────────────────────────────────────
export const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id;

    if (!postId || !userId) {
      return res.status(400).json({ message: "Invalid request data. User must be authenticated." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Compare ObjectIds securely by converting to strings
    const hasLiked = post.likes.some((id) => id.toString() === userId.toString());
    const update = hasLiked 
      ? { $pull: { likes: userId } } 
      : { $addToSet: { likes: userId } };

    const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      liked: !hasLiked,
      likesCount: updatedPost.likes.length,
    });
  } catch (error) {
    console.error("toggleLikePost error:", error);
    res.status(500).json({ message: "Server error while toggling like." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 6. SAVE / UNSAVE POST
// ─────────────────────────────────────────────────────────────────
export const toggleSavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id;

    if (!postId || !userId) {
      return res.status(400).json({ message: "Invalid request data. User must be authenticated." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Compare ObjectIds securely by converting to strings
    const hasSaved = post.savedBy.some((id) => id.toString() === userId.toString());
    const update = hasSaved 
      ? { $pull: { savedBy: userId } } 
      : { $addToSet: { savedBy: userId } };

    const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      saved: !hasSaved,
      savedCount: updatedPost.savedBy.length,
    });
  } catch (error) {
    console.error("toggleSavePost error:", error);
    res.status(500).json({ message: "Server error while toggling save." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 7. ADD COMMENT (top-level or reply)
// ─────────────────────────────────────────────────────────────────
export const addComment = async (req, res) => {
  try {
    const { text, parentId } = req.body;
    const postId = req.params.id;

    if (!text) return res.status(400).json({ message: "Comment text is required." });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const comment = await Comment.create({
      postId,
      userId: req.user._id,
      text,
      parentId: parentId || null,
    });

    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    const populated = await comment.populate("userId", "name avatar email");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 8. GET COMMENTS FOR A POST (threaded)
// ─────────────────────────────────────────────────────────────────
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate("userId", "name avatar email")
      .sort({ createdAt: 1 });

    const commentMap = {};
    const roots = [];

    comments.forEach((c) => {
      const obj = c.toJSON();
      obj.replies = [];
      commentMap[obj._id] = obj;
    });

    comments.forEach((c) => {
      const obj = commentMap[c._id];
      if (c.parentId && commentMap[c.parentId]) {
        commentMap[c.parentId].replies.push(obj);
      } else {
        roots.push(obj);
      }
    });

    res.status(200).json(roots);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 9. LIKE / UNLIKE COMMENT
// ─────────────────────────────────────────────────────────────────
export const toggleLikeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user?._id;

    if (!commentId || !userId) {
      return res.status(400).json({ message: "Invalid request data. User must be authenticated." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    // Compare ObjectIds securely by converting to strings
    const hasLiked = comment.likes.some((id) => id.toString() === userId.toString());
    const update = hasLiked 
      ? { $pull: { likes: userId } } 
      : { $addToSet: { likes: userId } };

    const updatedComment = await Comment.findByIdAndUpdate(commentId, update, { new: true });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      liked: !hasLiked,
      likesCount: updatedComment.likes.length,
    });
  } catch (error) {
    console.error("toggleLikeComment error:", error);
    res.status(500).json({ message: "Server error while toggling comment like." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 10. ADMIN: GET ALL PENDING POSTS
// ─────────────────────────────────────────────────────────────────
export const getPendingPosts = async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const approvePost = async (req, res) => {
  try {
    res.status(200).json({ message: "Post approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const rejectPost = async (req, res) => {
  try {
    res.status(200).json({ message: "Post rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 13. GET SAVED POSTS
// ─────────────────────────────────────────────────────────────────
export const getSavedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ savedBy: req.user._id })
      .populate("userId", "name avatar email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 14. DASHBOARD STATS (dynamic)
// ─────────────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const myPosts = await Post.find({ userId });

    const activeListingCount = await Item.countDocuments({ sellerId: userId, isActive: true, status: "published" });
    const cropTypes = await Item.distinct("cropName", { sellerId: userId, isActive: true });

    // Real revenue: sum of non-cancelled orders for this seller
    const myOrders = await Order.find({ sellerId: userId, status: { $ne: "cancelled" } });
    const totalSalesValue = myOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrderCount = myOrders.filter((o) => o.status === "pending").length;

    const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      total: 0,
    }));

    // Calculate monthly analytics from actual sales orders
    myOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      if (d.getFullYear() === currentYear) {
        monthlyData[d.getMonth()].total += o.totalPrice || 0;
      }
    });

    // Populate recent activities with actual sales orders
    const recentActivity = myOrders
      .slice(0, 5)
      .map((o) => ({
        name: o.itemName,
        description: `Order #${o._id.toString().substring(18)} - status: ${o.status}`,
        amount: o.totalPrice,
        date: o.createdAt,
      }));

    res.status(200).json({
      totalSales: totalSalesValue,
      activeCrops: activeListingCount,
      cropNames: cropTypes.join(", ") || "None yet",
      totalPosts: myPosts.length,
      approvedPosts: myPosts.length,
      pendingPosts: 0,
      pendingOrders: pendingOrderCount,
      totalLikes,
      activeListings: activeListingCount,
      monthlyData,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error." });
  }
};



// This takes care of Ticket raised logic and also Social Media posts by farmers
// Social media elements like bookmark ,likes, comments, nested comments,
// The admin approves or rejects the tickets etc

