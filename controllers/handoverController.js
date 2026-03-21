const {
  createHandoverLog,
  confirmHandoverLog,
} = require("../services/handoverService");
const { sendSuccess } = require("../utils/response");

async function createHandoverController(req, res) {
  const data = await createHandoverLog(req.body);
  return sendSuccess(res, 201, data, "Handover log created successfully");
}

async function confirmHandoverController(req, res) {
  const data = await confirmHandoverLog(req.params.log_id);
  return sendSuccess(res, 200, data, "Handover log confirmed successfully");
}

module.exports = {
  createHandoverController,
  confirmHandoverController,
};
