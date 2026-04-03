const AppError = require("./appError");
const eventModel = require("../models/eventModel");
const taskSlotModel = require("../models/taskSlotModel");

async function createEvent(data) {
  if (!data.name || !data.date) {
    throw new AppError("Name and date are required to create an event", 400);
  }
  return await eventModel.createEvent(data);
}

async function getAllEvents() {
  return await eventModel.getAllEvents();
}

async function getEventById(event_id) {
  const event = await eventModel.getEventById(event_id);
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  return event;
}

async function updateEvent(event_id, data) {
  const updated = await eventModel.updateEvent(event_id, data);
  if (!updated) {
    throw new AppError("Event not found", 404);
  }
  return updated;
}

async function deleteEvent(event_id) {
  const event = await eventModel.getEventById(event_id);
  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const slots = await taskSlotModel.getSlotsByEventId(event_id);
  const ongoingStatuses = ["assigned", "in_progress", "submitted"];
  
  const hasOngoing = slots.some((slot) => ongoingStatuses.includes(slot.status));
  if (hasOngoing) {
    throw new AppError("Cannot delete event with ongoing task slots. Please resolve slots first.", 400);
  }

  return await eventModel.deleteEvent(event_id);
}

async function getEventDashboard(event_id) {
  const event = await eventModel.getEventById(event_id);
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  return await eventModel.getEventDashboard(event_id);
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventDashboard,
};
