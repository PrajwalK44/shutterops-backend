const {
  EQUIPMENT_STATUS,
  insertEquipment,
  listEquipment,
  getEquipmentByGearId: findEquipmentByGearId,
  updateEquipmentByGearId: updateEquipmentRecordByGearId,
} = require("../models/equipmentModel");
const { getEquipmentHistoryByGearId } = require("../models/handoverLogModel");
const AppError = require("./appError");
const { isValidUUID, ensureRequiredString } = require("../utils/validators");

function validateCreatePayload(payload) {
  const errors = [];

  const nameError = ensureRequiredString(payload.name, "name");
  if (nameError) errors.push(nameError);

  const typeError = ensureRequiredString(payload.type, "type");
  if (typeError) errors.push(typeError);

  if (
    payload.status &&
    !EQUIPMENT_STATUS.includes(payload.status)
  ) {
    errors.push(`status must be one of: ${EQUIPMENT_STATUS.join(", ")}.`);
  }

  if (
    Object.prototype.hasOwnProperty.call(payload, "assigned_to") &&
    payload.assigned_to !== null &&
    typeof payload.assigned_to !== "string"
  ) {
    errors.push("assigned_to must be a string when provided.");
  }

  if (errors.length) {
    throw new AppError("Validation error", 400, { errors });
  }
}

async function createEquipment(payload) {
  validateCreatePayload(payload);

  const created = await insertEquipment({
    name: payload.name.trim(),
    type: payload.type.trim(),
    status: payload.status || "available",
    assigned_to: payload.assigned_to || null,
    event_id: payload.event_id || null,
  });

  return created;
}

async function getEquipmentList(filters = {}) {
  const query = {};

  if (filters.status) {
    if (!EQUIPMENT_STATUS.includes(filters.status)) {
      throw new AppError(
        `status must be one of: ${EQUIPMENT_STATUS.join(", ")}.`,
        400,
      );
    }
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  const rows = await listEquipment(query);
  return rows;
}

async function getEquipmentByGearId(gearId) {
  if (!isValidUUID(gearId)) {
    throw new AppError("Invalid gear_id format", 400);
  }

  const equipment = await findEquipmentByGearId(gearId);
  if (!equipment) {
    throw new AppError("Equipment not found", 404);
  }

  return equipment;
}

async function updateEquipmentByGearId(gearId, updates) {
  if (!isValidUUID(gearId)) {
    throw new AppError("Invalid gear_id format", 400);
  }

  const allowedFields = ["name", "type", "status", "assigned_to", "event_id"];
  const safeUpdates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      safeUpdates[field] = updates[field];
    }
  }

  if (!Object.keys(safeUpdates).length) {
    throw new AppError("No valid fields provided for update", 400);
  }

  if (
    Object.prototype.hasOwnProperty.call(safeUpdates, "status") &&
    !EQUIPMENT_STATUS.includes(safeUpdates.status)
  ) {
    throw new AppError(
      `status must be one of: ${EQUIPMENT_STATUS.join(", ")}.`,
      400,
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(safeUpdates, "assigned_to") &&
    safeUpdates.assigned_to !== null &&
    typeof safeUpdates.assigned_to !== "string"
  ) {
    throw new AppError("assigned_to must be a string when provided", 400);
  }

  const updated = await updateEquipmentRecordByGearId(gearId, safeUpdates);

  if (!updated) {
    throw new AppError("Equipment not found", 404);
  }

  return updated;
}

async function assignEquipment(gearId, payload) {
  if (!isValidUUID(gearId)) {
    throw new AppError("Invalid gear_id format", 400);
  }

  if (!payload || typeof payload.user_id !== "string" || !payload.user_id.trim()) {
    throw new AppError("user_id is required and must be a non-empty string", 400);
  }

  const equipment = await findEquipmentByGearId(gearId);
  if (!equipment) {
    throw new AppError("Equipment not found", 404);
  }

  if (equipment.status === "maintenance") {
    throw new AppError("Equipment under maintenance cannot be assigned", 400);
  }

  const updated = await updateEquipmentRecordByGearId(gearId, {
    assigned_to: payload.user_id,
    status: "assigned",
  });

  return updated;
}

async function getEquipmentHistory(gearId) {
  if (!isValidUUID(gearId)) {
    throw new AppError("Invalid gear_id format", 400);
  }

  const logs = await getEquipmentHistoryByGearId(gearId);

  return logs;
}

module.exports = {
  createEquipment,
  getEquipmentList,
  getEquipmentByGearId,
  updateEquipmentByGearId,
  assignEquipment,
  getEquipmentHistory,
};
