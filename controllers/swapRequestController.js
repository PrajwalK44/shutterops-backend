const {
  createSwapRequest,
  getSwapSuggestionsById,
  peerAcceptSwapRequest,
  approveSwapRequest,
  rejectSwapRequest,
} = require("../services/swapRequestService");
const { sendSuccess } = require("../utils/response");

async function createSwapRequestController(req, res) {
  const data = await createSwapRequest(req.body);
  return sendSuccess(res, 201, data, "Swap request created successfully");
}

async function getSwapSuggestionsController(req, res) {
  const data = await getSwapSuggestionsById(req.params.id);
  return sendSuccess(res, 200, data, "Swap suggestions fetched successfully");
}

async function peerAcceptSwapController(req, res) {
  const data = await peerAcceptSwapRequest(req.params.id, req.body);
  return sendSuccess(res, 200, data, "Swap request peer-accepted successfully");
}

async function approveSwapController(req, res) {
  const data = await approveSwapRequest(req.params.id);
  return sendSuccess(res, 200, data, "Swap request approved successfully");
}

async function rejectSwapController(req, res) {
  const data = await rejectSwapRequest(req.params.id);
  return sendSuccess(res, 200, data, "Swap request rejected successfully");
}

module.exports = {
  createSwapRequestController,
  getSwapSuggestionsController,
  peerAcceptSwapController,
  approveSwapController,
  rejectSwapController,
};
