const { query } = require("../db");

const EQUIPMENT_STATUS = ["available", "assigned", "maintenance"];

async function createEquipmentTable() {
  await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await query(`
    CREATE TABLE IF NOT EXISTS equipment (
      gear_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available'
        CHECK (status IN ('available', 'assigned', 'maintenance')),
      assigned_to TEXT,
      event_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function insertEquipment(payload) {
  const result = await query(
    `
      INSERT INTO equipment (name, type, status, assigned_to, event_id)
      VALUES ($1, $2, COALESCE($3, 'available'), $4, $5)
      RETURNING gear_id::text, name, type, status, assigned_to, event_id, created_at, updated_at
    `,
    [
      payload.name,
      payload.type,
      payload.status || null,
      payload.assigned_to || null,
      payload.event_id || null,
    ],
  );

  return result.rows[0];
}

async function listEquipment(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.type) {
    values.push(filters.type);
    conditions.push(`type = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await query(
    `
      SELECT gear_id::text, name, type, status, assigned_to, event_id, created_at, updated_at
      FROM equipment
      ${whereClause}
      ORDER BY created_at DESC
    `,
    values,
  );

  return result.rows;
}

async function getEquipmentByGearId(gearId) {
  const result = await query(
    `
      SELECT gear_id::text, name, type, status, assigned_to, event_id, created_at, updated_at
      FROM equipment
      WHERE gear_id = $1
    `,
    [gearId],
  );

  return result.rows[0] || null;
}

async function updateEquipmentByGearId(gearId, updates) {
  const fieldMap = {
    name: "name",
    type: "type",
    status: "status",
    assigned_to: "assigned_to",
    event_id: "event_id",
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
    return getEquipmentByGearId(gearId);
  }

  values.push(gearId);

  const result = await query(
    `
      UPDATE equipment
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE gear_id = $${values.length}
      RETURNING gear_id::text, name, type, status, assigned_to, event_id, created_at, updated_at
    `,
    values,
  );

  return result.rows[0] || null;
}

module.exports = {
  createEquipmentTable,
  EQUIPMENT_STATUS,
  insertEquipment,
  listEquipment,
  getEquipmentByGearId,
  updateEquipmentByGearId,
};
