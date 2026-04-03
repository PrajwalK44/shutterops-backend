const { query } = require("../db");

async function createTaskSlotTable() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS task_slots (
      slot_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id     UUID REFERENCES events(event_id) ON DELETE CASCADE,
      title        TEXT NOT NULL,
      description  TEXT,
      slot_type    TEXT CHECK (slot_type IN ('photography', 'videography', 'editing', 'coordination')),
      start_time   TIMESTAMPTZ,
      end_time     TIMESTAMPTZ,
      assigned_to  UUID REFERENCES users(id),
      status       TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'submitted', 'verified', 'rejected')),
      upload_url   TEXT,
      verified_by  UUID REFERENCES users(id),
      verified_at  TIMESTAMPTZ,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function createTaskSlot(payload) {
  const result = await query(
    `
      INSERT INTO task_slots (event_id, title, description, slot_type, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      payload.event_id,
      payload.title,
      payload.description || null,
      payload.slot_type || null,
      payload.start_time || null,
      payload.end_time || null,
    ]
  );
  return result.rows[0];
}

async function getTaskSlotById(slot_id) {
  const result = await query(
    `SELECT * FROM task_slots WHERE slot_id = $1`,
    [slot_id]
  );
  return result.rows[0] || null;
}

async function getSlotsByEventId(event_id) {
  const result = await query(
    `
      SELECT * FROM task_slots 
      WHERE event_id = $1
      ORDER BY start_time ASC
    `,
    [event_id]
  );
  return result.rows;
}

async function updateTaskSlot(slot_id, updates) {
  const fieldMap = {
    title: "title",
    description: "description",
    slot_type: "slot_type",
    start_time: "start_time",
    end_time: "end_time",
  };

  const setClauses = [];
  const values = [];

  Object.keys(fieldMap).forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      values.push(updates[field]);
      setClauses.push(`${fieldMap[field]} = $${values.length}`);
    }
  });

  if (!setClauses.length) {
    return getTaskSlotById(slot_id);
  }

  values.push(slot_id);

  const result = await query(
    `
      UPDATE task_slots
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE slot_id = $${values.length}
      RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}

async function assignUserToSlot(slot_id, user_id) {
  const result = await query(
    `
      UPDATE task_slots
      SET assigned_to = $1, status = 'assigned', updated_at = NOW()
      WHERE slot_id = $2
      RETURNING *
    `,
    [user_id, slot_id]
  );
  return result.rows[0] || null;
}

async function updateSlotStatus(slot_id, status) {
  const result = await query(
    `
      UPDATE task_slots
      SET status = $1, updated_at = NOW()
      WHERE slot_id = $2
      RETURNING *
    `,
    [status, slot_id]
  );
  return result.rows[0] || null;
}

async function attachUpload(slot_id, upload_url) {
  const result = await query(
    `
      UPDATE task_slots
      SET upload_url = $1, status = 'submitted', updated_at = NOW()
      WHERE slot_id = $2
      RETURNING *
    `,
    [upload_url, slot_id]
  );
  return result.rows[0] || null;
}

async function verifySlot(slot_id, verified_by) {
  const result = await query(
    `
      UPDATE task_slots
      SET verified_by = $1, verified_at = NOW(), status = 'verified', updated_at = NOW()
      WHERE slot_id = $2
      RETURNING *
    `,
    [verified_by, slot_id]
  );
  return result.rows[0] || null;
}

module.exports = {
  createTaskSlotTable,
  createTaskSlot,
  getTaskSlotById,
  getSlotsByEventId,
  updateTaskSlot,
  assignUserToSlot,
  updateSlotStatus,
  attachUpload,
  verifySlot,
};
