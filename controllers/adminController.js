import User from "../models/User.js";
import Report from "../models/Report.js";

//GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalAdopters, totalShelters, unverifiedShelters] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "adopter" }),
        User.countDocuments({ role: "shelter" }),
        User.countDocuments({ role: "shelter", isVerified: false }),
      ]);

    const [pendingReports, inProgressReports, rescuedReports] =
      await Promise.all([
        Report.countDocuments({ status: "pending" }),
        Report.countDocuments({ status: "in-progress" }),
        Report.countDocuments({ status: "rescued" }),
      ]);

    res.status(200).json({
      users: { total: totalUsers, adopters: totalAdopters, shelters: totalShelters },
      unverifiedShelters,
      reports: {
        pending: pendingReports,
        inProgress: inProgressReports,
        rescued: rescuedReports,
        total: pendingReports + inProgressReports + rescuedReports,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//PATCH /api/admin/users/:id/verify
export const verifyShelter = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["adopter", "shelter", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};