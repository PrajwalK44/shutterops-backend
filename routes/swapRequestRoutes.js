const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  createSwapRequestController,
  getSwapSuggestionsController,
  peerAcceptSwapController,
  approveSwapController,
  rejectSwapController,
} = require("../controllers/swapRequestController");

const router = express.Router();

router.post("/", asyncHandler(createSwapRequestController));
router.get("/:id/suggestions", asyncHandler(getSwapSuggestionsController));
router.patch("/:id/peer-accept", asyncHandler(peerAcceptSwapController));
router.patch("/:id/approve", asyncHandler(approveSwapController));
router.patch("/:id/reject", asyncHandler(rejectSwapController));

module.exports = router;
