const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  createHandoverController,
  confirmHandoverController,
} = require("../controllers/handoverController");

const router = express.Router();

router.post("/", asyncHandler(createHandoverController));
router.patch("/:log_id/confirm", asyncHandler(confirmHandoverController));

module.exports = router;
