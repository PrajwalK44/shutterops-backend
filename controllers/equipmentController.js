const {
  createEquipment,
  getEquipmentList,
  getEquipmentByGearId,
  updateEquipmentByGearId,
  assignEquipment,
  getEquipmentHistory,
} = require("../services/equipmentService");
const { sendSuccess } = require("../utils/response");

async function createEquipmentController(req, res) {
  const data = await createEquipment(req.body);
  return sendSuccess(res, 201, data, "Equipment created successfully");
}

async function listEquipmentController(req, res) {
  const data = await getEquipmentList(req.query);
  return sendSuccess(res, 200, data, "Equipment fetched successfully");
}

async function getEquipmentByIdController(req, res) {
  const data = await getEquipmentByGearId(req.params.gear_id);
  return sendSuccess(res, 200, data, "Equipment fetched successfully");
}

async function updateEquipmentController(req, res) {
  const data = await updateEquipmentByGearId(req.params.gear_id, req.body);
  return sendSuccess(res, 200, data, "Equipment updated successfully");
}

async function assignEquipmentController(req, res) {
  const data = await assignEquipment(req.params.gear_id, req.body);
  return sendSuccess(res, 200, data, "Equipment assigned successfully");
}

async function getEquipmentHistoryController(req, res) {
  const data = await getEquipmentHistory(req.params.gear_id);
  return sendSuccess(res, 200, data, "Equipment history fetched successfully");
}

module.exports = {
  createEquipmentController,
  listEquipmentController,
  getEquipmentByIdController,
  updateEquipmentController,
  assignEquipmentController,
  getEquipmentHistoryController,
};
