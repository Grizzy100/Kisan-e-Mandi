import express from "express";
import { getItems, getItem, getMyItems, updateItem, deleteItem, publishItem, shelveItem, debugAllItems, fixStaleItems } from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getItems);                         // marketplace (public)
router.get("/debug/all", debugAllItems);           // DEBUG: all items with status
router.post("/debug/fix-stale", fixStaleItems);    // FIX: promote approved_hidden → published
router.get("/me", protect, getMyItems);            // my listings
router.get("/:id", getItem);                       // single item
router.put("/:id", protect, updateItem);           // update my item
router.delete("/:id", protect, deleteItem);        // deactivate item

router.patch("/:id/publish", protect, publishItem); // publish approved item
router.patch("/:id/shelve", protect, shelveItem);   // shelve active item

export default router;
