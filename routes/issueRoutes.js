const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");

router.post("/issues", issueController.createIssue);
router.get("/issues", issueController.getIssues);
router.post("/issues/status", issueController.updateIssueStatus);
router.post("/issues/assign", issueController.assignIssue);
router.get("/issues/technician/:id", issueController.getIndividualTechnician);

module.exports = router;
    