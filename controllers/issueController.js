const Issue = require("../models/Issue");
const User = require("../models/User");


// Insert new issue
exports.createIssue = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newIssue = new Issue({ title, description });
    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("assignedTo", "username");
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  const { issueId, status } = req.body;
  try {
    const issue = await Issue.findByIdAndUpdate(
      issueId,
      { status },
      { new: true }
    );
    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.assignIssue = async (req, res) => {
  const { issueId, technicianId } = req.body;

  try {
    // Update the issue with the technician's ID and status
    const issue = await Issue.findByIdAndUpdate(
      issueId,
      { assignedTo: technicianId, status: "Assigned" },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

  

    // Find the technician details
    const technician = await User.findById(technicianId);


    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }

    // Prepare the response with the technician details
    const response = {
      ...issue.toObject(),
      assignedTo: {
        id: technician._id,
        name: technician.username,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get issues assigned to a specific technician
exports.getIndividualTechnician =  async (req, res) => {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ assignedTo: id });

    if (!issues.length) {
      return res
        .status(404)
        .json({ error: "No issues found for this technician" });
    }

    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};