const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getEventAnalyticsController,
  getUserAnalyticsController,
  getEquipmentUsageAnalyticsController,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/event/:event_id", asyncHandler(getEventAnalyticsController));
router.get("/user/:user_id", asyncHandler(getUserAnalyticsController));
router.get("/equipment-usage", asyncHandler(getEquipmentUsageAnalyticsController));

module.exports = router;
