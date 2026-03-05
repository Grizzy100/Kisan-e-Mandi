import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Item from "../models/Item.js";
import Order from "../models/Order.js";

// ─────────────────────────────────────────────────────────────────
// 1. CREATE POST (vendor uploads photo/video → pending approval)
// ─────────────────────────────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { name, description, imageUrl, mediaUrl, mediaType, location, cropType, cropName, price } = req.body;
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
      cropType,
      cropName,
      price,
      userId,
      status: "pending",
    });

    res.status(201).json({ message: "Post created and submitted for approval.", post: newPost });
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
    // Always fetch approved posts
    const query = { status: "approved" };
    const approvedPosts = await Post.find(query)
      .populate("userId", "name avatar email")
      .sort({ createdAt: -1 });

    // If the user is authenticated, also include their own pending posts
    let myPending = [];
    if (req.user?._id) {
      myPending = await Post.find({ userId: req.user._id, status: "pending" })
        .populate("userId", "name avatar email")
        .sort({ createdAt: -1 });
    }

    // Merge: user's pending posts first, then approved feed
    // De-duplicate in case a user's approved post appears in both
    const seen = new Set();
    const merged = [];
    for (const p of [...myPending, ...approvedPosts]) {
      const id = p._id.toString();
      if (!seen.has(id)) { seen.add(id); merged.push(p); }
    }

    res.status(200).json(merged);
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
    const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const userId = req.user._id.toString();
    // Convert all stored IDs to strings for reliable comparison
    const likeStrings = post.likes.map((id) => id.toString());
    const index = likeStrings.indexOf(userId);

    if (index === -1) {
      // Not liked yet — add
      post.likes.push(req.user._id);
    } else {
      // Already liked — remove (toggle off)
      post.likes.splice(index, 1);
    }
    await post.save();

    res.status(200).json({
      liked: index === -1,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("toggleLikePost error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 6. SAVE / UNSAVE POST
// ─────────────────────────────────────────────────────────────────
export const toggleSavePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const userId = req.user._id.toString();
    const savedStrings = post.savedBy.map((id) => id.toString());
    const index = savedStrings.indexOf(userId);

    if (index === -1) {
      post.savedBy.push(req.user._id);
    } else {
      post.savedBy.splice(index, 1);
    }
    await post.save();

    res.status(200).json({
      saved: index === -1,
      savedCount: post.savedBy.length,
    });
  } catch (error) {
    console.error("toggleSavePost error:", error);
    res.status(500).json({ message: "Server error." });
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
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    const userId = req.user._id;
    const index = comment.likes.indexOf(userId);

    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }
    await comment.save();

    res.status(200).json({
      liked: index === -1,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 10. ADMIN: GET ALL PENDING POSTS
// ─────────────────────────────────────────────────────────────────
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" })
      .populate("userId", "name avatar email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 11. ADMIN: APPROVE POST → auto-create Item listing
// ─────────────────────────────────────────────────────────────────
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.status = "approved";
    post.reviewedBy = req.user._id;
    post.reviewedAt = new Date();
    await post.save();

    let item = null;
    if (post.cropName && post.price) {
      item = await Item.create({
        postId: post._id,
        sellerId: post.userId,
        name: post.name,
        description: post.description,
        cropType: post.cropType || "other",
        cropName: post.cropName,
        price: post.price,
        imageUrl: post.imageUrl || post.mediaUrl,
        mediaUrl: post.mediaUrl || post.imageUrl,
        mediaType: post.mediaType,
        location: post.location,
      });
    }

    res.status(200).json({
      message: "Post approved" + (item ? " and item listed" : ""),
      post,
      item,
    });
  } catch (error) {
    console.error("Error approving post:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 12. ADMIN: REJECT POST
// ─────────────────────────────────────────────────────────────────
export const rejectPost = async (req, res) => {
  try {
    const { reason } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.status = "rejected";
    post.rejectionReason = reason || "Does not meet guidelines";
    post.reviewedBy = req.user._id;
    post.reviewedAt = new Date();
    await post.save();

    res.status(200).json({ message: "Post rejected.", post });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────
// 13. GET SAVED POSTS
// ─────────────────────────────────────────────────────────────────
export const getSavedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ savedBy: req.user._id, status: "approved" })
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
    const approvedPosts = myPosts.filter((p) => p.status === "approved");

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

    approvedPosts.forEach((p) => {
      const d = new Date(p.createdAt);
      if (d.getFullYear() === currentYear) {
        monthlyData[d.getMonth()].total += p.price || 0;
      }
    });

    const recentActivity = approvedPosts
      .filter((p) => p.price)
      .slice(0, 5)
      .map((p) => ({
        name: p.cropName || p.name,
        description: p.description?.substring(0, 50),
        amount: p.price,
        date: p.createdAt,
      }));

    res.status(200).json({
      totalSales: totalSalesValue,
      activeCrops: activeListingCount,
      cropNames: cropTypes.join(", ") || "None yet",
      totalPosts: myPosts.length,
      approvedPosts: approvedPosts.length,
      pendingPosts: myPosts.filter((p) => p.status === "pending").length,
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
