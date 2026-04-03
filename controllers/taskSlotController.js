const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const taskSlotService = require("../services/taskSlotService");

const createTaskSlot = asyncHandler(async (req, res) => {
  const data = req.body;
  const newSlot = await taskSlotService.createTaskSlot(data);
  return sendSuccess(res, 201, newSlot, "Task slot created successfully");
});

const getTaskSlotById = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const slot = await taskSlotService.getTaskSlotById(slot_id);
  return sendSuccess(res, 200, slot, "Task slot fetched successfully");
});

const getSlotsByEventId = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const slots = await taskSlotService.getSlotsByEventId(event_id);
  return sendSuccess(
    res,
    200,
    slots,
    "Task slots fetched successfully for event",
  );
});

const updateTaskSlot = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const data = req.body;
  const updatedSlot = await taskSlotService.updateTaskSlot(slot_id, data);
  return sendSuccess(res, 200, updatedSlot, "Task slot updated successfully");
});

const assignUser = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    const AppError = require("../services/appError");
    throw new AppError("user_id is required", 400);
  }

  const assignedSlot = await taskSlotService.assignUser(slot_id, user_id);
  return sendSuccess(
    res,
    200,
    assignedSlot,
    "User assigned to slot successfully",
  );
});

const updateStatus = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const { status } = req.body;

  if (!status) {
    const AppError = require("../services/appError");
    throw new AppError("status is required", 400);
  }

  const updatedSlot = await taskSlotService.updateStatus(slot_id, status);
  return sendSuccess(
    res,
    200,
    updatedSlot,
    "Task slot status updated successfully",
  );
});

const uploadPhoto = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const { upload_url } = req.body;

  if (!upload_url) {
    const AppError = require("../services/appError");
    throw new AppError("upload_url is required", 400);
  }

  const updatedSlot = await taskSlotService.uploadPhoto(slot_id, upload_url);
  return sendSuccess(
    res,
    200,
    updatedSlot,
    "Photo uploaded to slot successfully",
  );
});

const verifySlot = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const { verified_by } = req.body;

  if (!verified_by) {
    const AppError = require("../services/appError");
    throw new AppError("verified_by is required", 400);
  }

  const updatedSlot = await taskSlotService.verifySlot(slot_id, verified_by);
  return sendSuccess(res, 200, updatedSlot, "Slot verified successfully");
});

const deliverSlot = asyncHandler(async (req, res) => {
  const { slot_id } = req.params;
  const updatedSlot = await taskSlotService.deliverSlot(slot_id);
  return sendSuccess(res, 200, updatedSlot, "Slot delivered successfully");
});

module.exports = {
  createTaskSlot,
  getTaskSlotById,
  getSlotsByEventId,
  updateTaskSlot,
  assignUser,
  updateStatus,
  uploadPhoto,
  verifySlot,
  deliverSlot,
};
