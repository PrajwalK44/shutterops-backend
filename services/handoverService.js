const {
  insertHandoverLog,
  getHandoverLogById,
  confirmHandoverLogById,
} = require("../models/handoverLogModel");
const {
  getEquipmentByGearId,
  updateEquipmentByGearId,
} = require("../models/equipmentModel");
const AppError = require("./appError");
const { isValidUUID, ensureRequiredString } = require("../utils/validators");

function validateCreatePayload(payload) {
  const errors = [];

  if (!isValidUUID(payload.gear_id)) {
    errors.push("gear_id must be a valid UUID.");
  }

  const fromError = ensureRequiredString(payload.from_user, "from_user");
  if (fromError) errors.push(fromError);

  const toError = ensureRequiredString(payload.to_user, "to_user");
  if (toError) errors.push(toError);

  if (errors.length) {
    throw new AppError("Validation error", 400, { errors });
  }
}

async function createHandoverLog(payload) {
  validateCreatePayload(payload);

  const equipment = await getEquipmentByGearId(payload.gear_id);
  if (!equipment) {
    throw new AppError("Equipment not found", 404);
  }

  const created = await insertHandoverLog({
    gear_id: payload.gear_id,
    from_user: payload.from_user,
    to_user: payload.to_user,
    event_id: payload.event_id || equipment.event_id || null,
  });

  return created;
}

async function confirmHandoverLog(logId) {
  if (!isValidUUID(logId)) {
    throw new AppError("Invalid log_id format", 400);
  }

  const log = await getHandoverLogById(logId);
  if (!log) {
    throw new AppError("Handover log not found", 404);
  }

  if (log.status === "confirmed") {
    throw new AppError("Handover log is already confirmed", 400);
  }

  const updatedLog = await confirmHandoverLogById(logId);

  // Confirming handover updates current equipment ownership atomically from domain perspective.
  await updateEquipmentByGearId(log.gear_id, {
    assigned_to: log.to_user,
    status: "assigned",
  });

  return updatedLog;
}

module.exports = {
  createHandoverLog,
  confirmHandoverLog,
};
