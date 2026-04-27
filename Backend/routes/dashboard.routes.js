const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/summary", authMiddleware, dashboardController.getSummary);
router.get("/timeline", authMiddleware, dashboardController.getTimeline);
router.get("/top-companies", authMiddleware, dashboardController.getTopCompanies);
router.get("/success-rate", authMiddleware, dashboardController.getSuccessRate);
router.get("/weekly-goal", authMiddleware, dashboardController.getWeeklyGoal);
router.put("/weekly-goal", authMiddleware, dashboardController.updateWeeklyGoal);
module.exports = router;
