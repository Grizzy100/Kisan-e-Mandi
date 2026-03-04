import express from "express";
import { getItems, getItem, getMyItems, updateItem, deleteItem } from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getItems);                         // marketplace (public)
router.get("/me", protect, getMyItems);            // my listings
router.get("/:id", getItem);                       // single item
router.put("/:id", protect, updateItem);           // update my item
router.delete("/:id", protect, deleteItem);        // deactivate item

export default router;
