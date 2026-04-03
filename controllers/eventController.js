const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const { validateUUID } = require("../utils/validators"); // Optional if we need it, but the spec says use validators.js pattern. I'll rely on the service throwing AppError for missing fields.
const eventService = require("../services/eventService");

const createEvent = asyncHandler(async (req, res) => {
  const data = req.body;
  const newEvent = await eventService.createEvent(data);
  return sendSuccess(res, 201, newEvent, "Event created successfully");
});

const getAllEvents = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const events = await eventService.getAllEvents(status);
  return sendSuccess(res, 200, events, "Events fetched successfully");
});

const getEventById = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const event = await eventService.getEventById(event_id);
  return sendSuccess(res, 200, event, "Event fetched successfully");
});

const updateEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const data = req.body;
  const updatedEvent = await eventService.updateEvent(event_id, data);
  return sendSuccess(res, 200, updatedEvent, "Event updated successfully");
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const deletedEvent = await eventService.deleteEvent(event_id);
  return sendSuccess(res, 200, deletedEvent, "Event deleted successfully");
});

const getEventDashboard = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const dashboardData = await eventService.getEventDashboard(event_id);
  return sendSuccess(res, 200, dashboardData, "Event dashboard fetched successfully");
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventDashboard,
};
