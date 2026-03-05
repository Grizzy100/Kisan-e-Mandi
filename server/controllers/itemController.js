import Item from "../models/Item.js";

// GET all active items (marketplace)
export const getItems = async (req, res) => {
  try {
    const { cropType, minPrice, maxPrice, search } = req.query;
    // Only fetch published listings created from support tickets
    const filter = { isActive: true, status: "published", ticketId: { $exists: true, $ne: null } };

    if (cropType) filter.cropType = cropType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { cropName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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
    const items = await Item.find({}, "name status isActive cropType price createdAt ticketId").sort({ createdAt: -1 });
    console.log(`🔍 [debugAllItems] Total items in DB: ${items.length}`);
    res.status(200).json({ total: items.length, items });
  } catch (error) {
    console.error("Debug items error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// POST fix stale items — promote approved_hidden → published (one-time migration)
export const fixStaleItems = async (req, res) => {
  try {
    const result = await Item.updateMany(
      { status: "approved_hidden" },
      { $set: { status: "published", isActive: true } }
    );
    console.log(`🔧 [fixStaleItems] Updated ${result.modifiedCount} stale approved_hidden items to published`);
    res.status(200).json({ message: `Fixed ${result.modifiedCount} items`, result });
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

    const updates = req.body;
    Object.assign(item, updates);
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

    // Allow publishing if admin-approved or previously shelved
    if (item.status === "pending_admin" || item.status === "rejected") {
      return res.status(400).json({ message: "Item has not been approved by admin yet." });
    }

    item.status = "published";
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

    item.status = "shelved";
    item.isActive = false;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error("Shelve error:", error);
    res.status(500).json({ message: "Server error." });
  }
};