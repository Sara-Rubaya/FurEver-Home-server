import Report from "../models/Report.js";

//  POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { animalType, description, photoUrl, location } = req.body;

    if (!animalType || !description || !photoUrl || !location?.address) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      animalType,
      description,
      photoUrl,
      location,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/reports?status=pending
export const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reports = await Report.find(filter)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/reports/:id
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /api/reports/:id/status
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "rescued"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo: status === "pending" ? null : req.user._id },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};