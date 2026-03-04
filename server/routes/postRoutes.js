import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getPost,
  toggleLikePost,
  toggleSavePost,
  addComment,
  getComments,
  toggleLikeComment,
  getPendingPosts,
  approvePost,
  rejectPost,
  getSavedPosts,
  getDashboardStats,
} from "../controllers/postController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Optional auth middleware (attaches req.user if token present, never blocks) ──
const optionalProtect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  next();
};

// ── Named /user/* routes  (MUST be before /:id wildcard) ────────
router.get("/user/me", protect, getMyPosts);           // my posts
router.get("/user/saved", protect, getSavedPosts);     // saved posts
router.get("/user/stats", protect, getDashboardStats); // dashboard stats

// ── Named /admin/* routes (MUST be before /:id wildcard) ────────
router.get("/admin/pending", protect, authorizeRoles("admin"), getPendingPosts);
router.put("/admin/:id/approve", protect, authorizeRoles("admin"), approvePost);
router.put("/admin/:id/reject", protect, authorizeRoles("admin"), rejectPost);

// ── Public / optional-auth ───────────────────────────────────────
router.get("/", optionalProtect, getAllPosts);  // feed — shows user's own pending too if logged in
router.get("/:id", getPost);                   // single post — keep LAST among GETs

// ── Protected ───────────────────────────────────────────────────
router.post("/", protect, createPost);
router.put("/:id/like", protect, toggleLikePost);
router.put("/:id/save", protect, toggleSavePost);

// ── Comments ────────────────────────────────────────────────────
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getComments);
router.put("/:id/comments/:commentId/like", protect, toggleLikeComment);

export default router;
