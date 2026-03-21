const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  createEquipmentController,
  listEquipmentController,
  getEquipmentByIdController,
  updateEquipmentController,
  assignEquipmentController,
  getEquipmentHistoryController,
} = require("../controllers/equipmentController");

const router = express.Router();

router.post("/", asyncHandler(createEquipmentController));
router.get("/", asyncHandler(listEquipmentController));
router.get("/:gear_id/history", asyncHandler(getEquipmentHistoryController));
router.get("/:gear_id", asyncHandler(getEquipmentByIdController));
router.patch("/:gear_id", asyncHandler(updateEquipmentController));
router.post("/:gear_id/assign", asyncHandler(assignEquipmentController));

module.exports = router;
