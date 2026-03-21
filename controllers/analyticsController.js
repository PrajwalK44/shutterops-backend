const {
  getEventAnalytics,
  getUserAnalytics,
  getEquipmentUsageAnalytics,
} = require("../services/analyticsService");
const { sendSuccess } = require("../utils/response");

async function getEventAnalyticsController(req, res) {
  const data = await getEventAnalytics(req.params.event_id);
  return sendSuccess(res, 200, data, "Event analytics fetched successfully");
}

async function getUserAnalyticsController(req, res) {
  const data = await getUserAnalytics(req.params.user_id);
  return sendSuccess(res, 200, data, "User analytics fetched successfully");
}

async function getEquipmentUsageAnalyticsController(req, res) {
  const data = await getEquipmentUsageAnalytics();
  return sendSuccess(res, 200, data, "Equipment usage analytics fetched successfully");
}

module.exports = {
  getEventAnalyticsController,
  getUserAnalyticsController,
  getEquipmentUsageAnalyticsController,
};
