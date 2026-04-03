const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const taskSlotController = require("../controllers/taskSlotController");

router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/:event_id", eventController.getEventById);
router.patch("/:event_id", eventController.updateEvent);
router.delete("/:event_id", eventController.deleteEvent);
router.get("/:event_id/dashboard", eventController.getEventDashboard);

// Delegate to taskSlotController endpoints and inject event_id from params
router.get("/:event_id/task-slots", taskSlotController.getSlotsByEventId);
router.post("/:event_id/task-slots", (req, res, next) => {
  req.body.event_id = req.params.event_id;
  taskSlotController.createTaskSlot(req, res, next);
});

module.exports = router;
