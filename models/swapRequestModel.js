const { query } = require("../db");

const SWAP_STATUS = ["Searching", "Peer_Agreed", "Approved", "Rejected"];

async function createSwapRequestsTable() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS swap_requests (
      swap_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      requester_id TEXT NOT NULL,
      current_slot_id TEXT NOT NULL,
      requested_slot_id TEXT NOT NULL,
      peer_id TEXT,
      status TEXT NOT NULL DEFAULT 'Searching'
        CHECK (status IN ('Searching', 'Peer_Agreed', 'Approved', 'Rejected')),
      event_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function insertSwapRequest(payload) {
  const result = await query(
    `
      INSERT INTO swap_requests (requester_id, current_slot_id, requested_slot_id, status, event_id)
      VALUES ($1, $2, $3, 'Searching', $4)
      RETURNING swap_id::text, requester_id, current_slot_id, requested_slot_id, peer_id, status, event_id, created_at, updated_at
    `,
    [
      payload.requester_id,
      payload.current_slot_id,
      payload.requested_slot_id,
      payload.event_id || null,
    ],
  );

  return result.rows[0];
}

async function getSwapRequestById(swapId) {
  const result = await query(
    `
      SELECT swap_id::text, requester_id, current_slot_id, requested_slot_id, peer_id, status, event_id, created_at, updated_at
      FROM swap_requests
      WHERE swap_id = $1
    `,
    [swapId],
  );

  return result.rows[0] || null;
}

async function getSwapSuggestions(swapId, request) {
  const result = await query(
    `
      SELECT swap_id::text, requester_id, current_slot_id, requested_slot_id, peer_id, status, event_id, created_at, updated_at
      FROM swap_requests
      WHERE swap_id != $1
        AND status = 'Searching'
        AND current_slot_id = $2
        AND requested_slot_id = $3
        AND requester_id != $4
      ORDER BY created_at DESC
    `,
    [swapId, request.requested_slot_id, request.current_slot_id, request.requester_id],
  );

  return result.rows;
}

async function updateSwapPeerAccept(swapId, peerId) {
  const result = await query(
    `
      UPDATE swap_requests
      SET peer_id = $1, status = 'Peer_Agreed', updated_at = NOW()
      WHERE swap_id = $2
      RETURNING swap_id::text, requester_id, current_slot_id, requested_slot_id, peer_id, status, event_id, created_at, updated_at
    `,
    [peerId, swapId],
  );

  return result.rows[0] || null;
}

async function updateSwapStatus(swapId, status) {
  const result = await query(
    `
      UPDATE swap_requests
      SET status = $1, updated_at = NOW()
      WHERE swap_id = $2
      RETURNING swap_id::text, requester_id, current_slot_id, requested_slot_id, peer_id, status, event_id, created_at, updated_at
    `,
    [status, swapId],
  );

  return result.rows[0] || null;
}

async function getSwapStats(match = {}) {
  const conditions = [];
  const values = [];

  if (match.event_id) {
    values.push(match.event_id);
    conditions.push(`event_id = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await query(
    `
      SELECT status, COUNT(*)::int AS count
      FROM swap_requests
      ${whereClause}
      GROUP BY status
    `,
    values,
  );

  return result.rows;
}

module.exports = {
  createSwapRequestsTable,
  SWAP_STATUS,
  insertSwapRequest,
  getSwapRequestById,
  getSwapSuggestions,
  updateSwapPeerAccept,
  updateSwapStatus,
  getSwapStats,
};
