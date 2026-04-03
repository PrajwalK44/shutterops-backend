const express = require("express");
const router = express.Router();
const taskSlotController = require("../controllers/taskSlotController");

router.get("/:slot_id", taskSlotController.getTaskSlotById);
router.patch("/:slot_id", taskSlotController.updateTaskSlot);
router.post("/:slot_id/assign", taskSlotController.assignUser);
router.patch("/:slot_id/status", taskSlotController.updateStatus);
router.post("/:slot_id/upload", taskSlotController.uploadPhoto);
router.post("/:slot_id/verify", taskSlotController.verifySlot);

module.exports = router;
