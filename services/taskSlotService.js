const AppError = require("./appError");
const taskSlotModel = require("../models/taskSlotModel");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");

async function createTaskSlot(data) {
  if (!data.event_id || !data.title) {
    throw new AppError("Event ID and title are required format task slot creation", 400);
  }
  
  const event = await eventModel.getEventById(data.event_id);
  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return await taskSlotModel.createTaskSlot(data);
}

async function getTaskSlotById(slot_id) {
  const slot = await taskSlotModel.getTaskSlotById(slot_id);
  if (!slot) {
    throw new AppError("Task slot not found", 404);
  }
  return slot;
}

async function getSlotsByEventId(event_id) {
  return await taskSlotModel.getSlotsByEventId(event_id);
}

async function updateTaskSlot(slot_id, data) {
  const updated = await taskSlotModel.updateTaskSlot(slot_id, data);
  if (!updated) {
    throw new AppError("Task slot not found", 404);
  }
  return updated;
}

async function assignUser(slot_id, user_id) {
  const slot = await taskSlotModel.getTaskSlotById(slot_id);
  if (!slot) {
    throw new AppError("Task slot not found", 404);
  }
  if (slot.status !== "open") {
    throw new AppError(`Cannot assign user to slot with status '${slot.status}'. Only 'open' slots can be assigned.`, 400);
  }

  const user = await userModel.getUserById(user_id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.is_available) {
    throw new AppError("User is not available for assignment", 400);
  }

  // Update user availability
  await userModel.updateUserAvailability(user_id, false);
  
  // Assign to slot
  return await taskSlotModel.assignUserToSlot(slot_id, user_id);
}

async function updateStatus(slot_id, status) {
  const slot = await taskSlotModel.getTaskSlotById(slot_id);
  if (!slot) {
    throw new AppError("Task slot not found", 404);
  }

  const validTransitions = {
    'open': ['assigned'],
    'assigned': ['in_progress', 'open'], // Might unassign
    'in_progress': ['submitted', 'assigned'], // Might revert
    'submitted': ['verified', 'rejected'],
    'verified': [],
    'rejected': ['in_progress', 'submitted']
  };

  const allowedNext = validTransitions[slot.status] || [];
  if (!allowedNext.includes(status)) {
    throw new AppError(`Invalid status transition from '${slot.status}' to '${status}'`, 400);
  }
  
  return await taskSlotModel.updateSlotStatus(slot_id, status);
}

async function uploadPhoto(slot_id, upload_url) {
  const slot = await taskSlotModel.getTaskSlotById(slot_id);
  if (!slot) {
    throw new AppError("Task slot not found", 404);
  }

  if (slot.status !== "assigned" && slot.status !== "in_progress") {
    throw new AppError(`Cannot upload photo. Slot must be in 'assigned' or 'in_progress' state, currently '${slot.status}'`, 400);
  }

  return await taskSlotModel.attachUpload(slot_id, upload_url);
}

async function verifySlot(slot_id, verified_by) {
  const slot = await taskSlotModel.getTaskSlotById(slot_id);
  if (!slot) {
    throw new AppError("Task slot not found", 404);
  }

  if (slot.status !== "submitted") {
    throw new AppError(`Cannot verify slot. Must be 'submitted', currently '${slot.status}'`, 400);
  }

  // Mark verified
  const updatedSlot = await taskSlotModel.verifySlot(slot_id, verified_by);
  
  // Free up user
  if (slot.assigned_to) {
    await userModel.updateUserAvailability(slot.assigned_to, true);
  }

  return updatedSlot;
}

module.exports = {
  createTaskSlot,
  getTaskSlotById,
  getSlotsByEventId,
  updateTaskSlot,
  assignUser,
  updateStatus,
  uploadPhoto,
  verifySlot,
};
