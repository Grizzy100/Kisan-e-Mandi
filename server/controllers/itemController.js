import Item from "../models/Item.js";
import {
  ITEM_STATUS,
  MARKETPLACE_SOURCE_FILTER,
  canPublishFromStatus,
  canShelveFromStatus,
} from "../utils/itemStateMachine.js";

const UPDATE_ALLOWED_FIELDS = new Set([
  "name",
  "description",
  "cropType",
  "cropName",
  "ticketCategory",
  "price",
  "unit",
  "quantity",
  "mediaUrl",
  "imageUrl",
  "mediaType",
  "location",
]);

// GET all active items (marketplace)
export const getItems = async (req, res) => {
  try {
    const { cropType, minPrice, maxPrice, search } = req.query;

    // Public marketplace should only show live listings that came from approved platform flows.
    const filter = {
      isActive: true,
      status: ITEM_STATUS.PUBLISHED,
      $and: [MARKETPLACE_SOURCE_FILTER],
    };

    if (cropType) filter.cropType = cropType;

    if (minPrice || maxPrice) {
      filter.price = {};
      const parsedMinPrice = Number(minPrice);
      const parsedMaxPrice = Number(maxPrice);
      if (Number.isFinite(parsedMinPrice)) filter.price.$gte = parsedMinPrice;
      if (Number.isFinite(parsedMaxPrice)) filter.price.$lte = parsedMaxPrice;
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    if (search) {
      filter.$and.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { cropName: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    const items = await Item.find(filter)
      .populate("sellerId", "name avatar email")
      .sort({ createdAt: -1 });

    console.log(`📦 [getItems] Returning ${items.length} published items`);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// GET all items (debug — shows all statuses)
export const debugAllItems = async (req, res) => {
  try {
    const items = await Item.find(
      {},
      "name status isActive cropType price createdAt ticketId postId"
    ).sort({ createdAt: -1 });
    console.log(`🔍 [debugAllItems] Total items in DB: ${items.length}`);
    res.status(200).json({ total: items.length, items });
  } catch (error) {
    console.error("Debug items error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// POST fix stale items — repair inconsistent status/visibility combinations
export const fixStaleItems = async (req, res) => {
  try {
    const [publishedMadeActive, hiddenMadeInactive, rejectedMadeInactive, pendingMadeInactive] = await Promise.all([
      Item.updateMany(
        { status: ITEM_STATUS.PUBLISHED, isActive: false },
        { $set: { isActive: true } }
      ),
      Item.updateMany(
        { status: ITEM_STATUS.APPROVED_HIDDEN, isActive: true },
        { $set: { isActive: false } }
      ),
      Item.updateMany(
        { status: ITEM_STATUS.REJECTED, isActive: true },
        { $set: { isActive: false } }
      ),
      Item.updateMany(
        { status: ITEM_STATUS.PENDING_ADMIN, isActive: true },
        { $set: { isActive: false } }
      ),
    ]);

    const summary = {
      publishedMadeActive: publishedMadeActive.modifiedCount,
      approvedHiddenMadeInactive: hiddenMadeInactive.modifiedCount,
      rejectedMadeInactive: rejectedMadeInactive.modifiedCount,
      pendingAdminMadeInactive: pendingMadeInactive.modifiedCount,
    };

    console.log("🔧 [fixStaleItems] Repaired inconsistent item states:", summary);
    res.status(200).json({ message: "Consistency repair complete", summary });
  } catch (error) {
    console.error("Fix stale items error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// GET single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("sellerId", "name avatar email");
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// GET my items (seller)
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// UPDATE item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const safeUpdates = {};
    for (const [key, value] of Object.entries(req.body || {})) {
      if (UPDATE_ALLOWED_FIELDS.has(key) && value !== undefined) {
        safeUpdates[key] = value;
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return res.status(400).json({
        message: "No editable fields provided.",
      });
    }

    if (safeUpdates.price !== undefined) {
      const parsedPrice = Number(safeUpdates.price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: "Price must be a valid non-negative number." });
      }
      safeUpdates.price = parsedPrice;
    }

    if (safeUpdates.quantity !== undefined) {
      const parsedQuantity = Number(safeUpdates.quantity);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
        return res.status(400).json({ message: "Quantity must be a valid non-negative number." });
      }
      safeUpdates.quantity = parsedQuantity;
    }

    Object.assign(item, safeUpdates);
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE (deactivate) item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized." });
    }

    await item.deleteOne();

    res.status(200).json({ message: "Item deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// PATCH publish approved hidden item or shelved item
export const publishItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (item.status === ITEM_STATUS.PUBLISHED && item.isActive) {
      return res.status(200).json({
        message: "Item is already live in marketplace.",
        item,
      });
    }

    if (!canPublishFromStatus(item.status)) {
      return res.status(400).json({ message: "Item has not been approved by admin yet." });
    }

    item.status = ITEM_STATUS.PUBLISHED;
    item.isActive = true;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// PATCH shelve (later) item
export const shelveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (item.status === ITEM_STATUS.SHELVED && item.isActive === false) {
      return res.status(200).json({
        message: "Item is already shelved.",
        item,
      });
    }

    if (!canShelveFromStatus(item.status)) {
      return res.status(400).json({
        message: "Only live published items can be shelved.",
      });
    }

    item.status = ITEM_STATUS.SHELVED;
    item.isActive = false;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error("Shelve error:", error);
    res.status(500).json({ message: "Server error." });
  }
};