import User from "../models/User.js";
import Item from "../models/Item.js";
import SupportTicket from "../models/SupportTicket.js";

/**
 * Get current logged-in user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Update current user's profile
 */
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * (Optional) Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Suspend or unsuspend a user (Admin only)
 */
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot suspend an admin." });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      message: user.isSuspended ? "User suspended." : "User unsuspended.",
      isSuspended: user.isSuspended,
    });
  } catch (err) {
    console.error("Suspend error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Delete a user and all their associated data (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin account." });

    // Remove all items and tickets belonging to this user
    await Item.deleteMany({ sellerId: user._id });
    await SupportTicket.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `User "${user.name || user.email || user.phone}" deleted successfully.` });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * Admin platform stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalFarmers, totalCustomers, totalItems, pendingTickets, publishedItems] =
      await Promise.all([
        User.countDocuments({ role: { $ne: "admin" } }),
        User.countDocuments({ role: "farmer" }),
        User.countDocuments({ role: "customer" }),
        Item.countDocuments(),
        SupportTicket.countDocuments({ status: "pending" }),
        Item.countDocuments({ status: "published", isActive: true }),
      ]);

    res.status(200).json({
      totalUsers,
      totalFarmers,
      totalCustomers,
      totalItems,
      pendingTickets,
      publishedItems,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
