import Item from "../models/Item.js";

// GET all active items (marketplace)
export const getItems = async (req, res) => {
  try {
    const { cropType, minPrice, maxPrice, search } = req.query;
    const filter = { isActive: true };

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

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
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

    item.isActive = false;
    await item.save();

    res.status(200).json({ message: "Item deactivated." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};