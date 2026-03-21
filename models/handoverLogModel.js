const { query } = require("../db");

const HANDOVER_STATUS = ["pending", "confirmed"];

async function createHandoverLogsTable() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS handover_logs (
      log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      gear_id UUID NOT NULL REFERENCES equipment(gear_id) ON DELETE CASCADE,
      from_user TEXT NOT NULL,
      to_user TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed')),
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      event_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function insertHandoverLog(payload) {
  const result = await query(
    `
      INSERT INTO handover_logs (gear_id, from_user, to_user, status, timestamp, event_id)
      VALUES ($1, $2, $3, 'pending', NOW(), $4)
      RETURNING log_id::text, gear_id::text, from_user, to_user, status, timestamp, event_id, created_at, updated_at
    `,
    [payload.gear_id, payload.from_user, payload.to_user, payload.event_id || null],
  );

  return result.rows[0];
}

async function getHandoverLogById(logId) {
  const result = await query(
    `
      SELECT log_id::text, gear_id::text, from_user, to_user, status, timestamp, event_id, created_at, updated_at
      FROM handover_logs
      WHERE log_id = $1
    `,
    [logId],
  );

  return result.rows[0] || null;
}

async function confirmHandoverLogById(logId) {
  const result = await query(
    `
      UPDATE handover_logs
      SET status = 'confirmed', updated_at = NOW()
      WHERE log_id = $1
      RETURNING log_id::text, gear_id::text, from_user, to_user, status, timestamp, event_id, created_at, updated_at
    `,
    [logId],
  );

  return result.rows[0] || null;
}

async function getEquipmentHistoryByGearId(gearId) {
  const result = await query(
    `
      SELECT log_id::text, gear_id::text, from_user, to_user, status, timestamp, event_id, created_at, updated_at
      FROM handover_logs
      WHERE gear_id = $1
      ORDER BY timestamp DESC
    `,
    [gearId],
  );

  return result.rows;
}

module.exports = {
  createHandoverLogsTable,
  HANDOVER_STATUS,
  insertHandoverLog,
  getHandoverLogById,
  confirmHandoverLogById,
  getEquipmentHistoryByGearId,
};
