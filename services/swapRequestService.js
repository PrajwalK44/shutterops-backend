const {
  SWAP_STATUS,
  insertSwapRequest,
  getSwapRequestById,
  getSwapSuggestions,
  updateSwapPeerAccept,
  updateSwapStatus,
  getSwapStats: getSwapStatsRows,
} = require("../models/swapRequestModel");
const AppError = require("./appError");
const { isValidUUID, ensureRequiredString } = require("../utils/validators");

function validateCreatePayload(payload) {
  const errors = [];

  const requesterError = ensureRequiredString(payload.requester_id, "requester_id");
  if (requesterError) errors.push(requesterError);

  const currentSlotError = ensureRequiredString(payload.current_slot_id, "current_slot_id");
  if (currentSlotError) errors.push(currentSlotError);

  const requestedSlotError = ensureRequiredString(payload.requested_slot_id, "requested_slot_id");
  if (requestedSlotError) errors.push(requestedSlotError);

  if (payload.current_slot_id && payload.requested_slot_id) {
    if (payload.current_slot_id === payload.requested_slot_id) {
      errors.push("current_slot_id and requested_slot_id cannot be the same.");
    }
  }

  if (errors.length) {
    throw new AppError("Validation error", 400, { errors });
  }
}

async function createSwapRequest(payload) {
  validateCreatePayload(payload);

  const created = await insertSwapRequest({
    requester_id: payload.requester_id,
    current_slot_id: payload.current_slot_id,
    requested_slot_id: payload.requested_slot_id,
    event_id: payload.event_id || null,
  });

  return created;
}

async function getSwapSuggestionsById(swapId) {
  if (!isValidUUID(swapId)) {
    throw new AppError("Invalid swap request id format", 400);
  }

  const request = await getSwapRequestById(swapId);
  if (!request) {
    throw new AppError("Swap request not found", 404);
  }

  // Reciprocal match: requester A wants B's slot and B wants A's slot.
  const suggestions = await getSwapSuggestions(swapId, request);

  return {
    request,
    suggestions,
  };
}

async function peerAcceptSwapRequest(swapId, payload) {
  if (!isValidUUID(swapId)) {
    throw new AppError("Invalid swap request id format", 400);
  }

  const peerError = ensureRequiredString(payload.peer_id, "peer_id");
  if (peerError) {
    throw new AppError("Validation error", 400, { errors: [peerError] });
  }

  const request = await getSwapRequestById(swapId);
  if (!request) {
    throw new AppError("Swap request not found", 404);
  }

  if (request.status !== "Searching") {
    throw new AppError("Only Searching requests can be peer-accepted", 400);
  }

  if (request.requester_id === payload.peer_id) {
    throw new AppError("peer_id cannot be the same as requester_id", 400);
  }

  const updated = await updateSwapPeerAccept(swapId, payload.peer_id);

  return updated;
}

async function approveSwapRequest(swapId) {
  if (!isValidUUID(swapId)) {
    throw new AppError("Invalid swap request id format", 400);
  }

  const request = await getSwapRequestById(swapId);
  if (!request) {
    throw new AppError("Swap request not found", 404);
  }

  if (request.status !== "Peer_Agreed") {
    throw new AppError(
      "Swap request can be approved only after peer acceptance",
      400,
    );
  }

  const updated = await updateSwapStatus(swapId, "Approved");

  return updated;
}

async function rejectSwapRequest(swapId) {
  if (!isValidUUID(swapId)) {
    throw new AppError("Invalid swap request id format", 400);
  }

  const request = await getSwapRequestById(swapId);
  if (!request) {
    throw new AppError("Swap request not found", 404);
  }

  if (request.status === "Approved") {
    throw new AppError("Approved swap request cannot be rejected", 400);
  }

  const updated = await updateSwapStatus(swapId, "Rejected");

  return updated;
}

async function getSwapStats(matchQuery = {}) {
  const stats = await getSwapStatsRows(matchQuery);

  const formatted = {
    Searching: 0,
    Peer_Agreed: 0,
    Approved: 0,
    Rejected: 0,
  };

  for (const row of stats) {
    if (Object.prototype.hasOwnProperty.call(formatted, row.status)) {
      formatted[row.status] = row.count;
    }
  }

  return formatted;
}

module.exports = {
  SWAP_STATUS,
  createSwapRequest,
  getSwapSuggestionsById,
  peerAcceptSwapRequest,
  approveSwapRequest,
  rejectSwapRequest,
  getSwapStats,
};
